"use client";

import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/chip";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 py-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">›</span>}
          {item.href && !item.isActive ? (
            <Link
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <Chip
              color={item.isActive ? "primary" : "default"}
              size="sm"
              variant={item.isActive ? "flat" : "bordered"}
            >
              {item.label}
            </Chip>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
