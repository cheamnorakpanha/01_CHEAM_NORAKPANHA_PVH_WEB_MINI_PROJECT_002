"use client";

import { useState } from "react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import { Checkbox } from "@nextui-org/react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [selectedPrice, setSelectedPrice] = useState("Under $50");
  const [priceRange, setPriceRange] = useState(150);
  const [selectedCategories, setSelectedCategories] = useState(["Skincare"]);

  const priceOptions = ["Under $50", "Under $100", "Under $150", "All prices"];
  const categories = [
    { name: "Hair Care", count: 0 },
    { name: "Skincare", count: 3 },
  ];

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleResetFilters = () => {
    setSelectedPrice("Under $50");
    setPriceRange(150);
    setSelectedCategories(["Skincare"]);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-semibold">Luxury beauty products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Use the filters to narrow by price and brand.
          </p>
        </div>

        <Input
          placeholder="Search by product name..."
          className="max-w-xs bg-gray-100 border rounded-lg focus-visible:ring-0 px-4 py-5"
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 h-fit">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-900">Filters</h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold border px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition"
              aria-label="Reset all filters"
            >
              Reset filters
            </button>
          </div>

          {/* Price */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-900 mb-2">
              PRICE RANGE
            </p>

            <p className="text-sm font-medium text-gray-700 mb-4">
              $0 - ${priceRange}
            </p>

            <Slider
              value={[priceRange]}
              onValueChange={(value) => setPriceRange(value[0])}
              max={300}
              step={10}
              className="w-full max-w-xs"
              aria-label="Price range filter"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$0</span>
              <span>$300</span>
            </div>
          </div>

          {/* Quick Select */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-900 mb-3">
              QUICK SELECT
            </p>

            <div className="flex flex-wrap gap-2">
              {priceOptions.map((item) => {
                const isActive = selectedPrice === item;

                return (
                  <button
                    key={item}
                    onClick={() => setSelectedPrice(item)}
                    className={`px-4 py-2 text-xs font-medium rounded-full border transition
                      ${
                        isActive
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-4">
              CATEGORIES
            </p>

            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <label
                  key={category.name}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      size="sm"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {category.count}
                  </span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Select none to include all categories.
            </p>
          </div>
        </aside>

        {/* Products */}
        <section className="col-span-9">
          <p className="text-sm text-gray-500 mb-4">Showing <span className="font-semibold">3</span> products</p>

          <div className="grid grid-cols-3 gap-6">
            <ShopCardComponent />
            <ShopCardComponent />
            <ShopCardComponent />
          </div>
        </section>
      </div>
    </div>
  );
}
