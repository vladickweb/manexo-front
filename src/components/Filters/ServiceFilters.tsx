import React, { useEffect, useMemo, useRef } from "react";

import { Box } from "@mantine/core";
import { useFormik } from "formik";

import { CATEGORIES } from "@/constants/categories";

import { PriceSlider } from "./PriceSlider";

interface FilterValues {
  categoryId?: string;
  subcategoryIds: string[];
  minPrice: string;
  maxPrice: string;
}

interface Props {
  onFilterChange: (filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    subcategoryIds?: string[];
  }) => void;
  resetKey?: number;
  initialValues?: FilterValues;
}

const DEFAULT_VALUES: FilterValues = {
  categoryId: undefined,
  subcategoryIds: [],
  minPrice: "0",
  maxPrice: "1000",
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

  const lastValuesRef = useRef<FilterValues | null>(null);

  useEffect(() => {
    const currentValues = formik.values;
    if (
      JSON.stringify(lastValuesRef.current) !== JSON.stringify(currentValues)
    ) {
      lastValuesRef.current = { ...currentValues };

      onFilterChange({
        categoryId: currentValues.categoryId,
        subcategoryIds: currentValues.subcategoryIds,
        minPrice: currentValues.minPrice ? +currentValues.minPrice : undefined,
        maxPrice: currentValues.maxPrice ? +currentValues.maxPrice : undefined,
      });
    }
  }, [formik.values, onFilterChange]);

  return (
    <Box maw={600} mx="auto" px="md" py="4">
      <form onSubmit={formik.handleSubmit} key={resetKey}>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-gray-700">Categoría</div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-base font-medium shadow-sm
                  ${
                    formik.values.categoryId === cat.id.toString()
                      ? "bg-primary/90 text-white border-primary scale-105 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                onClick={() => {
                  formik.setFieldValue("categoryId", cat.id.toString());
                  formik.setFieldValue("subcategoryIds", []);
                }}
              >
                <img src={cat.icon} alt={cat.name} className="w-6 h-6" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">
              Subcategorías
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-sm font-medium
                    ${
                      formik.values.subcategoryIds.includes(sub.id.toString())
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
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
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end mb-2">
          <PriceSlider
            min={0}
            value={[
              Number(formik.values.minPrice),
              Number(formik.values.maxPrice),
            ]}
            onChange={([min, max]) => {
              formik.setFieldValue("minPrice", String(min));
              formik.setFieldValue("maxPrice", String(max));
            }}
          />
        </div>
      </form>
    </Box>
  );
};
