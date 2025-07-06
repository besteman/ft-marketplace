"use client";

import type { CombinedFiltersData } from "@/types";

import React from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

interface FiltersSummaryProps {
  data: CombinedFiltersData;
  onReset: () => void;
}

const familyMakeupLabels: Record<string, string> = {
  adult_individual: "Adult Individual",
  couple: "Couple (Two Adults)",
  couple_one_child: "Couple + 1 child",
  couple_two_children: "Couple + 2 children",
  couple_three_children: "Couple + 3 or more children",
  individual_one_children: "Individual + 1 child",
  individual_two_children: "Individual + 2 children",
  individual_three_children: "Individual + 3 or more children",
};

export default function FiltersSummary({ data, onReset }: FiltersSummaryProps) {
  const formatCurrency = (value: string) => {
    if (!value) return "Not specified";

    const number = parseFloat(value);

    if (isNaN(number)) return "Not specified";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const summaryData = [
    {
      key: "state",
      category: "Geographic",
      field: "State",
      value: data.geo.state || "Not specified",
    },
    {
      key: "county",
      category: "Geographic",
      field: "County",
      value: data.geo.county || "Not specified",
    },
    {
      key: "familyMakeup",
      category: "Demographics",
      field: "Family Makeup",
      value: data.demo.familyMakeup
        ? familyMakeupLabels[data.demo.familyMakeup] || data.demo.familyMakeup
        : "Not specified",
    },
    {
      key: "salary",
      category: "Income",
      field: "Average Monthly Salary",
      value: formatCurrency(data.demo.averageMonthlySalary),
    },
    {
      key: "ichra",
      category: "Income",
      field: "ICHRA Amount",
      value: formatCurrency(data.demo.ichraAmount),
    },
  ];

  const columns = [
    { key: "category", label: "Category" },
    { key: "field", label: "Field" },
    { key: "value", label: "Value" },
  ];

  return (
    <div className="space-y-6">
      <Table aria-label="Selected filters summary">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={summaryData}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "category" && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {item.category}
                    </span>
                  )}
                  {columnKey === "field" && (
                    <span className="font-medium text-gray-700">
                      {item.field}
                    </span>
                  )}
                  {columnKey === "value" && (
                    <span className="text-gray-900">{item.value}</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center pt-1">
        <Button color="secondary" variant="bordered" onPress={onReset}>
          Change Filters
        </Button>
      </div>
    </div>
  );
}
