"use client";

import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

// US States data with full names and 2-letter codes
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

interface StateFiltersProps {
  selectedState?: string;
  onStateChange?: (stateCode: string) => void;
  placeholder?: string;
  className?: string;
}

export default function StateFilters({
  selectedState,
  onStateChange,
  placeholder = "Select a state",
  className = "",
}: StateFiltersProps) {
  const selectedStateName = selectedState
    ? US_STATES.find((state) => state.code === selectedState)?.name
    : null;

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys as Set<string>)[0];

    if (selectedKey && onStateChange) {
      onStateChange(selectedKey);
    }
  };

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <Button className="capitalize" variant="bordered">
          {selectedStateName || placeholder}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="State selection"
        className="max-h-60 overflow-y-auto"
        disallowEmptySelection={false}
        selectedKeys={selectedState ? new Set([selectedState]) : new Set()}
        selectionMode="single"
        variant="flat"
        onSelectionChange={handleSelectionChange}
      >
        {US_STATES.map((state) => (
          <DropdownItem key={state.code} value={state.code}>
            {state.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
