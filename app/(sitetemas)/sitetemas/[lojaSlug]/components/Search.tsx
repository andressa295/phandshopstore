"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function Search({
  placeholder = "Buscar produtos...",
  onSearch,
}: SearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border rounded-[var(--radius)] overflow-hidden"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 outline-none"
      />
      <button
        type="submit"
        className="bg-[var(--color-primary)] text-white px-3 flex items-center justify-center"
        aria-label="Buscar"
      >
        <SearchIcon size={18} />
      </button>
    </form>
  );
}
