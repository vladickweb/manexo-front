const fs = require("fs");
const path = require("path");

const OPENAPI_PATH = path.resolve(__dirname, "../open-api/openapi-spec.json");
const OUTPUT_HOOKS_DIR = path.resolve(__dirname, "../src/hooks/api");
const QUERY_KEYS_FILE = path.resolve(__dirname, "../src/constants/queryKeys.ts");
const MODELS_DIR = path.resolve(__dirname, "../src/models");
const MODELS_INDEX = path.join(MODELS_DIR, "index.ts");

const toPascalCase = (str) =>
  str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "");

const toSnakeCase = (str) =>
  str
    .replace(/\.?([A-Z]+)/g, (_, y) => "_" + y.toLowerCase())
    .replace(/^_/, "");

const getEntityFromPath = (routePath) => {
  const parts = routePath.split("/").filter(Boolean);
  return parts[1]?.includes("{") ? parts[0] + "ById" : parts.join("_");
};

const resolveType = (property) => {
  if (!property) return "any";

  if (property.$ref) {
    return property.$ref.split("/").pop();
  }

  if (property.type === "string") return "string";
  if (property.type === "number" || property.type === "integer") return "number";
  if (property.type === "boolean") return "boolean";
  if (property.type === "array") {
    const itemsType = resolveType(property.items);
    return `${itemsType}[]`;
  }

  return "any";
};

const generateModelFile = (name, schema) => {
  if (!schema || schema.type !== "object") {
    return `export type ${name} = any;\n`;
  }

  const props = schema.properties || {};
  const required = new Set(schema.required || []);

  const lines = [`export type ${name} = {`];
  for (const [key, prop] of Object.entries(props || {})) {
    const optional = required.has(key) ? "" : "?";
    const type = resolveType(prop);
    lines.push(`  ${key}${optional}: ${type};`);
  }
  lines.push("};\n");

  return lines.join("\n");
};

const generateHookContent = ({
  hookName,
  method,
  routePath,
  hasParams,
  responseType,
  requestType,
}) => {
  const isGet = method === "get";
  const queryKey = toSnakeCase(hookName).toUpperCase();

  const nativeTypes = ["any", "void", "string", "number", "boolean", "unknown", "any[]"];
  const typesToImport = [responseType, requestType]
    .filter((type) => !!type && !nativeTypes.includes(type))
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const importLine = [
    typesToImport.length ? `import { ${typesToImport.join(", ")} } from '@/models';` : null,
    `import axiosClient from '@/api/axiosClient';`,
  ]
    .filter(Boolean)
    .join("\n");

  if (isGet) {
    return `
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/queryKeys';
${importLine}

export const use${hookName} = (${hasParams ? `params: any, ` : ""}options?: Omit<UseQueryOptions<${responseType}>, "queryKey" | "queryFn">) => {
  return useQuery<${responseType}>({
    queryKey: [QueryKeys.${queryKey}${hasParams ? ", params" : ""}],
    queryFn: async () => {
      const { data } = await axiosClient.get<${responseType}>(\`${routePath}\`${hasParams ? ", { params }" : ""});
      return data;
    },
    ...options,
  });
};
`.trim();
  } else {
    return `
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
${importLine}

export const use${hookName} = (options?: UseMutationOptions<${responseType}, unknown, ${requestType || "void"}>) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (${requestType ? "params: " + requestType : ""}) => {
      const { data } = await axiosClient.${method}<${responseType}>(\`${routePath}\`${requestType ? ", params" : ""});
      return data;
    },
  });
};
`.trim();
  }
};


const generateQueryKeysFile = (queryKeys) => {
  const entries = queryKeys.map((k) => `  ${k}: '${k}'`).join(",\n");
  return `export const QueryKeys = {\n${entries}\n};\n`;
};

const main = () => {
  const spec = JSON.parse(fs.readFileSync(OPENAPI_PATH, "utf8"));
  const { paths } = spec;

  const allQueryKeys = new Set();
  const modelSchemas = spec.components?.schemas || {};

  // Generar modelos individuales
  if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });

  const exportStatements = [];

  for (const [name, schema] of Object.entries(modelSchemas)) {
    const modelContent = generateModelFile(name, schema);
    const filePath = path.join(MODELS_DIR, `${name}.ts`);
    fs.writeFileSync(filePath, modelContent, "utf8");
    exportStatements.push(`export * from './${name}';`);
  }

  fs.writeFileSync(MODELS_INDEX, exportStatements.join("\n") + "\n", "utf8");
  console.log(`✅ Modelos generados en archivos individuales en: src/models/`);

  // Generar hooks
  if (!fs.existsSync(OUTPUT_HOOKS_DIR)) fs.mkdirSync(OUTPUT_HOOKS_DIR, { recursive: true });

  for (const [routePath, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const entity = getEntityFromPath(routePath);
      const hookName = `${toPascalCase(method)}${toPascalCase(entity)}`;

      const hasParams =
        (operation.parameters && operation.parameters.length > 0) ||
        !!operation.requestBody;

      const responseSchema =
        operation.responses?.["200"]?.content?.["application/json"]?.schema ||
        operation.responses?.["201"]?.content?.["application/json"]?.schema;

      const responseType = responseSchema?.$ref
        ? responseSchema.$ref.split("/").pop()
        : method === "get"
        ? "any[]"
        : "any";

      const requestSchema =
        operation.requestBody?.content?.["application/json"]?.schema;
      const requestType = requestSchema?.$ref
        ? requestSchema.$ref.split("/").pop()
        : hasParams
        ? "any"
        : undefined;

      const fileName = `use${hookName}.ts`;
      const filePath = path.join(OUTPUT_HOOKS_DIR, fileName);

      const hookContent = generateHookContent({
        hookName,
        method,
        routePath,
        hasParams,
        responseType,
        requestType,
      });

      fs.writeFileSync(filePath, hookContent, "utf8");
      console.log(`✅ Hook generado: use${hookName}`);

      if (method === "get") {
        allQueryKeys.add(toSnakeCase(hookName).toUpperCase());
      }
    }
  }

  // Guardar QueryKeys.ts
  const queryKeysContent = generateQueryKeysFile([...allQueryKeys].sort());
  const queryKeysDir = path.dirname(QUERY_KEYS_FILE);
  if (!fs.existsSync(queryKeysDir)) fs.mkdirSync(queryKeysDir, { recursive: true });
  fs.writeFileSync(QUERY_KEYS_FILE, queryKeysContent, "utf8");
  console.log(`✅ Archivo queryKeys.ts actualizado con ${allQueryKeys.size} claves`);
};

main();
