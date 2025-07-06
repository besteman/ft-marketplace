"use client";

import type { DemoFiltersData } from "@/types";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export interface DemoFiltersProps {
  onSubmit?: (data: DemoFiltersData) => void;
  onReset?: () => void;
}

const familyMakeupOptions = [
  { key: "adult_individual", label: "Adult Individual" },
  { key: "couple", label: "Couple (Two Adults)" },
  { key: "couple_one_child", label: "Couple + 1 child" },
  { key: "couple_two_children", label: "Couple + 2 children" },
  { key: "couple_three_children", label: "Couple + 3 or more children" },
  { key: "individual_one_children", label: "Individual + 1 child" },
  { key: "individual_two_children", label: "Individual + 2 children" },
  {
    key: "individual_three_children",
    label: "Individual + 3 or more children",
  },
];

export default function DemoFilters({ onSubmit, onReset }: DemoFiltersProps) {
  const [familyMakeup, setFamilyMakeup] = useState<string>("");
  const [averageMonthlySalary, setAverageMonthlySalary] = useState<string>("");
  const [ichraAmount, setIchraAmount] = useState<string>("");

  const selectedFamilyMakeup = familyMakeupOptions.find(
    (option) => option.key === familyMakeup,
  );

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");

    // Parse as float and format with commas
    const number = parseFloat(numericValue);

    if (isNaN(number)) return "";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const parseCurrencyValue = (formattedValue: string) => {
    // Extract numeric value from formatted currency
    return formattedValue.replace(/[^\d.]/g, "");
  };

  const handleSalaryChange = (value: string) => {
    const numericValue = parseCurrencyValue(value);

    setAverageMonthlySalary(numericValue);
  };

  const handleIchraChange = (value: string) => {
    const numericValue = parseCurrencyValue(value);

    setIchraAmount(numericValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        familyMakeup,
        averageMonthlySalary,
        ichraAmount,
      });
    }
  };

  const handleReset = () => {
    setFamilyMakeup("");
    setAverageMonthlySalary("");
    setIchraAmount("");

    if (onReset) {
      onReset();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Demographics & Income Information
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Please provide your family details and income information
        </p>
      </div>

      <div className="space-y-4">
        {/* Family Makeup Dropdown */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            Family Makeup
          </span>
          <Dropdown>
            <DropdownTrigger>
              <Button className="justify-start" variant="bordered">
                {selectedFamilyMakeup?.label || "Select family makeup"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Family Makeup Selection"
              items={familyMakeupOptions}
              onAction={(key) => setFamilyMakeup(key as string)}
            >
              {(item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Average Monthly Salary */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            Average Monthly Salary
          </span>
          <Input
            placeholder="Enter your monthly salary"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="text"
            value={formatCurrency(averageMonthlySalary)}
            onValueChange={handleSalaryChange}
          />
        </div>

        {/* ICHRA Amount */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            ICHRA Amount
          </span>
          <Input
            placeholder="Enter your ICHRA amount"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="text"
            value={formatCurrency(ichraAmount)}
            onValueChange={handleIchraChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button className="flex-1" color="primary" type="submit">
          Apply Filters
        </Button>
        <Button
          className="flex-1"
          color="secondary"
          variant="bordered"
          onPress={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
