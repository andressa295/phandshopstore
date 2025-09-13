"use client";

import React, { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FiltersSidebarProps {
  title?: string;
  options?: FilterOption[];
  onChange?: (selected: string[]) => void;
}

export default function FiltersSidebar({
  title = "Filtros",
  options = [
    { label: "Promoção", value: "sale" },
    { label: "Mais vendidos", value: "bestsellers" },
    { label: "Novidades", value: "new" },
  ],
  onChange,
}: FiltersSidebarProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <aside className="border rounded p-4">
      <h2 className="font-bold mb-2">{title}</h2>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggleOption(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </aside>
  );
}
