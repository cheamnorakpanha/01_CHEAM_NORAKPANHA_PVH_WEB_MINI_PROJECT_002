"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import {
  ESSENTIALS_TABS,
  filterProductsByEssentialsTab,
} from "../../data/mockData";
import ProductCardComponent from "../ProductCardComponent";
import { getAllProducts, getProductsByCategory } from "@/service/product.service";
import { useSession } from "next-auth/react";

const PAGE_SIZE = 8;

export default function LandingEssentialsGrid() {
  const { data: session } = useSession();

  const token = session?.user?.accessToken;

  const [tab, setTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = filterProductsByEssentialsTab(products, tab);
  const visible = showAll ? products : products.slice(0, PAGE_SIZE);
  const canLoadMore = !showAll && products.length > PAGE_SIZE;

  const CATEGORY_MAP = {
    Cleanser: "c6dd93ff-3a0a-47a0-aede-640b0c9e5688",
    Moisturizer: "dd49024b-bb02-405d-80b5-1dbc7b880172",
    Serum: "a7bd1eaa-f931-4292-8341-fa6c76084589",
    Toner: "00bf48d5-cc06-4d10-9b7a-e140777b4acb",
  };

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      setLoading(true);

      let data = [];

      if (tab === "All") {
        console.log("Fetching ALL products");
        data = await getAllProducts(token);
      } else {
        const categoryId = CATEGORY_MAP[tab];

        console.log("TAB:", tab);
        console.log("CATEGORY ID:", categoryId);

        if (categoryId) {
          data = await getProductsByCategory(categoryId, token);
        } else {
          console.warn("No category mapping found for:", tab);
          data = [];
        }
      }

      console.log("FINAL DATA:", data);

      setProducts(data || []);
      setShowAll(false);
      setLoading(false);
    }

    fetchData();
  }, [tab, token]);

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
        {ESSENTIALS_TABS.map((label) => {
          const on = tab === label;
          return (
            <Button
              key={label}
              role="tab"
              aria-selected={on}
              onPress={() => {
                setTab(label);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                on
                  ? "bg-lime-400 text-gray-900 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {visible.map((product, index) => (
          <ProductCardComponent product={product} key={product.productId} />
        ))}
      </div>

      {filtered.length === 0 && (
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
