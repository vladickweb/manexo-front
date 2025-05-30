import React, { useEffect } from "react";

import {
  Box,
  Group,
  MultiSelect,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useFormik } from "formik";

interface CategoryOption {
  id: string;
  name: string;
}
interface Props {
  categories: CategoryOption[];
  onFilterChange: (filters: {
    categoryIds: string[];
    minPrice?: number;
    maxPrice?: number;
    radius: number;
    isActive: boolean;
  }) => void;
}

export const ServiceFilters: React.FC<Props> = ({
  categories,
  onFilterChange,
}) => {
  const formik = useFormik({
    initialValues: {
      categoryIds: [] as string[],
      minPrice: "",
      maxPrice: "",
      radius: "5000",
      isActive: true,
    },
    onSubmit: () => {},
  });

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));
  const radiusOptions = [
    { value: "1000", label: "1 km" },
    { value: "5000", label: "5 km" },
    { value: "10000", label: "10 km" },
    { value: "20000", label: "20 km" },
    { value: "50000", label: "50 km" },
  ];

  useEffect(() => {
    onFilterChange({
      categoryIds: formik.values.categoryIds,
      minPrice: formik.values.minPrice ? +formik.values.minPrice : undefined,
      maxPrice: formik.values.maxPrice ? +formik.values.maxPrice : undefined,
      radius: +formik.values.radius,
      isActive: formik.values.isActive,
    });
  }, [formik.values, onFilterChange]);

  return (
    <Box maw={1200} mx="auto" px="md" py="4">
      <form onSubmit={formik.handleSubmit}>
        <Group align="flex-end" gap="md" wrap="wrap">
          <MultiSelect
            data={categoryOptions}
            label="Categorías"
            placeholder="Selecciona"
            clearable
            searchable
            maxDropdownHeight={300}
            {...formik.getFieldProps("categoryIds")}
          />

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

          <Select
            label="Radio"
            data={radiusOptions}
            clearable={false}
            {...formik.getFieldProps("radius")}
          />

          <Switch label="Solo activos" {...formik.getFieldProps("isActive")} />
        </Group>
      </form>
    </Box>
  );
};
