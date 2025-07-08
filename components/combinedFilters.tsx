"use client";

import type { DemoFiltersData, GeoFiltersData } from "@/types";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";

import StateFilters from "./stateFilters";
import CountyFilters from "./countyFilters";

export interface CombinedFiltersData {
  geo: GeoFiltersData;
  demo: DemoFiltersData;
}

interface CombinedFiltersProps {
  onSubmit?: (data: CombinedFiltersData) => void;
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

export default function CombinedFilters({
  onSubmit,
  onReset,
}: CombinedFiltersProps) {
  // Demo filters state
  const [familyMakeup, setFamilyMakeup] = useState<string>("");
  const [averageMonthlySalary, setAverageMonthlySalary] = useState<string>("");
  const [ichraAmount, setIchraAmount] = useState<string>("");

  // Geo filters state
  const [geoFilters, setGeoFilters] = useState<GeoFiltersData>({
    state: "",
    county: "",
  });

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

  const handleStateChange = (stateCode: string) => {
    const updatedFilters = {
      ...geoFilters,
      state: stateCode,
      county: "", // Reset county when state changes
    };

    setGeoFilters(updatedFilters);
  };

  const handleCountyChange = (countyName: string) => {
    const updatedFilters = {
      ...geoFilters,
      county: countyName,
    };

    setGeoFilters(updatedFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        geo: geoFilters,
        demo: {
          familyMakeup,
          averageMonthlySalary,
          ichraAmount,
        },
      });
    }
  };

  const handleReset = () => {
    // Reset demo filters
    setFamilyMakeup("");
    setAverageMonthlySalary("");
    setIchraAmount("");

    // Reset geo filters
    setGeoFilters({ state: "", county: "" });

    if (onReset) {
      onReset();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Demographics Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Chip color="primary" size="sm" variant="flat">
              1
            </Chip>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                👥 Demographics & Income
              </h3>
              <p className="text-sm text-gray-600">
                Tell us about your family and financial situation
              </p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {/* Family Makeup Dropdown */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              👨‍👩‍👧‍👦 Family Makeup
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
              💰 Average Monthly Salary
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
              🏢 ICHRA Amount
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
        </CardBody>
      </Card>

      {/* Geographic Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Chip color="secondary" size="sm" variant="flat">
              2
            </Chip>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                📍 Location Information
              </h3>
              <p className="text-sm text-gray-600">
                Select your state and county to find available plans
              </p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* State Filter */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm font-medium text-gray-700">
                🗺️ State
              </span>
              <div className="flex w-full justify-center">
                <StateFilters
                  className="w-full"
                  placeholder="Select a state"
                  selectedState={geoFilters.state}
                  onStateChange={handleStateChange}
                />
              </div>
            </div>

            {/* County Filter */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm font-medium text-gray-700">
                🏘️ County
              </span>
              <div className="flex w-full justify-center">
                <CountyFilters
                  className="w-full"
                  placeholder="Select a county"
                  selectedCounty={geoFilters.county}
                  selectedState={geoFilters.state}
                  onCountyChange={handleCountyChange}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardBody>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              color="primary"
              isDisabled={!geoFilters.state || !geoFilters.county}
              type="submit"
            >
              🔍 Find My Plans
            </Button>
            <Button
              className="flex-1"
              color="secondary"
              variant="bordered"
              onPress={handleReset}
            >
              🔄 Reset
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
