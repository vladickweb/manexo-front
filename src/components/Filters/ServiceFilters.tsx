import React, { useEffect, useMemo } from "react";

import { Box, Group, Switch, TextInput } from "@mantine/core";
import { useFormik } from "formik";

import { CATEGORIES } from "@/constants/categories";

interface FilterValues {
  categoryId?: string;
  subcategoryIds: string[];
  minPrice: string;
  maxPrice: string;
  onlyActives: boolean;
}

interface Props {
  onFilterChange: (filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    onlyActives: boolean;
    subcategoryIds?: string[];
  }) => void;
  resetKey?: number;
  initialValues?: FilterValues;
}

const DEFAULT_VALUES: FilterValues = {
  categoryId: undefined,
  subcategoryIds: [],
  minPrice: "",
  maxPrice: "",
  onlyActives: true,
};

export const ServiceFilters: React.FC<Props> = ({
  onFilterChange,
  resetKey,
  initialValues,
}) => {
  const formik = useFormik({
    initialValues: initialValues || DEFAULT_VALUES,
    onSubmit: () => {},
    enableReinitialize: true,
  });

  const selectedCategory = useMemo(
    () =>
      CATEGORIES.find((cat) => cat.id.toString() === formik.values.categoryId),
    [formik.values.categoryId],
  );

  useEffect(() => {
    onFilterChange({
      categoryId: formik.values.categoryId,
      subcategoryIds: formik.values.subcategoryIds,
      minPrice: formik.values.minPrice ? +formik.values.minPrice : undefined,
      maxPrice: formik.values.maxPrice ? +formik.values.maxPrice : undefined,
      onlyActives: formik.values.onlyActives,
    });
  }, [formik.values, onFilterChange]);

  return (
    <Box maw={1200} mx="auto" px="md" py="4">
      <form onSubmit={formik.handleSubmit} key={resetKey}>
        <Group align="flex-end" gap="md" wrap="wrap">
          <div className="flex flex-wrap gap-2 mb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium shadow-sm ${
                  formik.values.categoryId === cat.id.toString()
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => {
                  formik.setFieldValue("categoryId", cat.id.toString());
                  formik.setFieldValue("subcategoryIds", []);
                }}
              >
                <img src={cat.icon} alt={cat.name} className="w-5 h-5" />
                {cat.name}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="flex flex-wrap gap-2 mb-2 w-full">
              {selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-colors text-xs font-medium shadow-sm ${
                    formik.values.subcategoryIds.includes(sub.id.toString())
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    const exists = formik.values.subcategoryIds.includes(
                      sub.id.toString(),
                    );
                    if (exists) {
                      formik.setFieldValue(
                        "subcategoryIds",
                        formik.values.subcategoryIds.filter(
                          (id) => id !== sub.id.toString(),
                        ),
                      );
                    } else {
                      formik.setFieldValue("subcategoryIds", [
                        ...formik.values.subcategoryIds,
                        sub.id.toString(),
                      ]);
                    }
                  }}
                >
                  <img src={sub.icon} alt={sub.name} className="w-4 h-4" />
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <TextInput
            label="Precio mínimo"
            type="number"
            placeholder="0"
            {...formik.getFieldProps("minPrice")}
          />

          <TextInput
            label="Precio máximo"
            type="number"
            placeholder="0"
            {...formik.getFieldProps("maxPrice")}
          />

          <Switch
            label="Solo activos"
            checked={formik.values.onlyActives}
            onChange={(e) =>
              formik.setFieldValue("onlyActives", e.currentTarget.checked)
            }
          />
        </Group>
      </form>
    </Box>
  );
};
