"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Category {
  _id: string;
  name: string;
}

interface ProductsFilterProps {
  categories: string[] | Category[];
  selectedCategory: string;
  searchQuery: string;
  onFilterChange?: (newCategory: string, newSearch: string) => void;
}

export default function ProductsFilter({
  categories,
  selectedCategory,
  searchQuery,
  onFilterChange,
}: ProductsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchQuery || "");
  const [category, setCategory] = useState(selectedCategory || "");

  // Update form state when props change (browser back button, etc.)
  useEffect(() => {
    setSearch(searchQuery || "");
    setCategory(selectedCategory || "");
  }, [searchQuery, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If onFilterChange callback is provided, use it
    if (onFilterChange) {
      onFilterChange(category, search);
      return;
    }
    
    // Otherwise, use the default navigation behavior
    // Build query parameters
    const params = new URLSearchParams();
    
    if (search) {
      params.append("search", search);
    }
    
    if (category) {
      params.append("category", category);
    }
    
    // Reset to page 1 when filters change
    params.append("page", "1");
    
    // Navigate with new params
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    
    if (onFilterChange) {
      onFilterChange("", "");
      return;
    }
    
    router.push(pathname);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="input pr-10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => {
              // Handle both string categories and Category objects
              const value = typeof cat === 'string' ? cat : cat.name;
              const id = typeof cat === 'string' ? cat : cat._id;
              return (
                <option key={id} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-col space-y-3">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
} 
