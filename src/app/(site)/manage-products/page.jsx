"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";

import SectionHeaderComponent from "@/components/SectionHeaderComponent";
import ProductCardComponent from "@/components/ProductCardComponent";
import { productsResponse } from "@/data/mockData";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ProduceCardWithModifyComponent from "@/components/manage-products/ProduceCardWithModifyComponent";

const options = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function Page() {
  const [selected, setSelected] = useState("name-asc");
  const current = options.find((o) => o.value === selected);

  // Sort products based on selected option
  const sortedProducts = [...productsResponse.data].sort((a, b) => {
    const nameA = (a.productName || a.name || "").toLowerCase();
    const nameB = (b.productName || b.name || "").toLowerCase();

    if (selected === "name-asc") {
      return nameA.localeCompare(nameB);
    } else if (selected === "name-desc") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto py-16">
      <div className="">
        <SectionHeaderComponent
          title={"Manage products"}
          desc={"Create, update, and delete products."}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 rounded-full border border-gray-400 hover:border-lime-400 data-[state=open]:border-lime-400 text-sm flex items-center gap-2 bg-gray-100 transition ease-in-out duration-300">
                  {current?.label}
                  <span className="pl-6"></span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40 rounded-xl shadow-md">
                {options.map((item) => (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => setSelected(item.value)}
                    className={`
                flex items-center justify-between cursor-pointer !hover:bg-lime-400 data-highlighted:bg-lime-100 data-highlighted:text-black
              `}
                  >
                    {item.label}

                    {selected === item.value && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SectionHeaderComponent>

        <div className=" mx-auto border p-10 rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Products</h1>
            </div>
            <Link
              href="/products/create"
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create product
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
            //   <ProductCardComponent key={product.productId} product={product} />
            <ProduceCardWithModifyComponent key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
