"use client";

import React, { useState } from "react";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";

import StateFilters from "./stateFilters";
import CountyFilters from "./countyFilters";

interface GeoFiltersProps {
  onFiltersChange?: (filters: GeoFiltersData) => void;
  onSubmit?: (filters: GeoFiltersData) => void;
  className?: string;
}

interface GeoFiltersData {
  state: string;
  county: string;
}

export default function GeoFilters({
  onFiltersChange,
  onSubmit,
  className = "",
}: GeoFiltersProps) {
  const [filters, setFilters] = useState<GeoFiltersData>({
    state: "",
    county: "",
  });

  const handleStateChange = (stateCode: string) => {
    const updatedFilters = {
      ...filters,
      state: stateCode,
      county: "", // Reset county when state changes
    };

    setFilters(updatedFilters);

    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const handleCountyChange = (countyName: string) => {
    const updatedFilters = {
      ...filters,
      county: countyName,
    };

    setFilters(updatedFilters);

    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(filters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      state: "",
      county: "",
    };

    setFilters(resetFilters);

    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  return (
    <div className={className}>
      <Form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="state-filter"
            >
              State
            </label>
            <StateFilters
              placeholder="Select a state"
              selectedState={filters.state}
              onStateChange={handleStateChange}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="county-filter"
            >
              County
            </label>
            <CountyFilters
              placeholder="Select a county"
              selectedCounty={filters.county}
              selectedState={filters.state}
              onCountyChange={handleCountyChange}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button color="primary" isDisabled={!filters.state} type="submit">
            Apply Filters
          </Button>
          <Button
            color="default"
            type="button"
            variant="bordered"
            onPress={handleReset}
          >
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
