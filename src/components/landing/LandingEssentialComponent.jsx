"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import {
  ESSENTIALS_TABS,
  filterProductsByEssentialsTab,
} from "../../data/mockData";
import ProductCardComponent from "../ProductCardComponent";
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
} from "@/service/product.service";
import { useSession } from "next-auth/react";

const PAGE_SIZE = 8;

export default function LandingEssentialsGrid() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [tab, setTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const visible = showAll ? products : products.slice(0, PAGE_SIZE);
  const canLoadMore = !showAll && products.length > PAGE_SIZE;

  useEffect(() => {
    if (!token) return;

    async function fetchCategories() {
      const data = await getAllCategories(token);
      console.log("CATEGORIES:", data);
      setCategories(data || []);
    }

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function fetchProducts() {
      setLoading(true);

      let data = [];

      if (tab === "All") {
        console.log("Fetching ALL products");
        data = await getAllProducts(token);
      } else {
        console.log("Fetching category:", tab);
        data = await getProductsByCategory(tab, token);
      }

      console.log("PRODUCTS:", data);

      setProducts(data || []);
      setShowAll(false);
      setLoading(false);
    }

    fetchProducts();
  }, [tab, token]);

  const tabs = [
    { label: "All", value: "All" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.categoryId,
    })),
  ];

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Our skincare essentials
        </h2>
        <p className="mt-2 max-w-lg text-gray-500">
          Filter by routine step — same mock catalog, organized for quick
          discovery.
        </p>
      </div>

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Product categories"
      >
        {tabs.map((item) => {
          const on = tab === item.value;

          return (
            <Button
              key={item.value}
              role="tab"
              aria-selected={on}
              onPress={() => {
                setTab(item.value);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                on
                  ? "bg-lime-400 text-gray-900 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {visible.map((product, index) => (
          <ProductCardComponent product={product} key={product.productId} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-gray-500">
          No products in this tab — try “All”.
        </p>
      )}

      {canLoadMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            onPress={() => setShowAll(true)}
            className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
