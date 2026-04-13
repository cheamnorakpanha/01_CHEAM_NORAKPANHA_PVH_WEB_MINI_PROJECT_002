"use client";

import { useState, useEffect } from "react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { getAllProducts, getAllCategories } from "@/service/product.service";
import SectionHeaderComponent from "@/components/SectionHeaderComponent";

export default function Page() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [priceRange, setPriceRange] = useState(300);
  const [selectedPrice, setSelectedPrice] = useState("All prices");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const priceOptions = ["Under $50", "Under $100", "Under $150", "All prices"];

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      setLoading(true);
      const data = await getAllProducts(token);

      setProducts(data);
      setFilteredProducts(data);

      setLoading(false);
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      const data = await getAllCategories(token);

      const formatted = data.map((cat) => ({
        id: cat.categoryId,
        name: cat.name,
      }));

      setCategories(formatted);
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (priceRange >= 300) {
      setSelectedPrice("All prices");
    } else if (priceRange <= 50) {
      setSelectedPrice("Under $50");
    } else if (priceRange <= 100) {
      setSelectedPrice("Under $100");
    } else if (priceRange <= 150) {
      setSelectedPrice("Under $150");
    } else {
      setSelectedPrice("");
    }
  }, [priceRange]);

  useEffect(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.categoryId),
      );
    }

    filtered = filtered.filter((p) => p.price <= priceRange);

    setFilteredProducts(filtered);
  }, [products, search, selectedCategories, priceRange]);

  const categoryCountMap = products.reduce((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
    return acc;
  }, {});

  const handleQuickSelect = (value) => {
    setSelectedPrice(value);

    if (value === "All prices") {
      setPriceRange(300);
    } else if (value === "Under $50") {
      setPriceRange(50);
    } else if (value === "Under $100") {
      setPriceRange(100);
    } else if (value === "Under $150") {
      setPriceRange(150);
    }
  };

  const handleResetFilters = () => {
    setSelectedPrice("All prices");
    setPriceRange(300);
    setSelectedCategories([]);
    setSearch("");
  };

  if (loading)
    return (
      <p className="flex items-center justify-center h-screen">
        Loading products...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto py-16">
      {/* Header */}
      <SectionHeaderComponent
        title={"Luxury beauty products"}
        desc={"Use the filters to narrow by price and brand."}
      >
        <Input
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-gray-100 border rounded-lg px-4 py-5 focus-visible:ring-lime-400"
        />
      </SectionHeaderComponent>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3 h-150 rounded-2xl border bg-gray-50 p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold">Filters</h2>
            <button
              onClick={handleResetFilters}
              className="text-xs border px-4 py-2 rounded-full"
            >
              Reset filters
            </button>
          </div>

          {/* Price */}
          <div className="mb-8">
            <p className="text-xs font-semibold mb-2">PRICE RANGE</p>
            <p className="text-sm mb-4">$0 - ${priceRange}</p>

            <Slider
              value={[priceRange]}
              onValueChange={(value) => setPriceRange(value[0])}
              max={300}
              step={10}
            />

            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>

          {/* Quick Select */}
          <div className="mb-8">
            <p className="text-xs font-semibold mb-3">QUICK SELECT</p>

            <div className="flex flex-wrap gap-2">
              {priceOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(item)}
                  className={`px-4 py-2 text-xs rounded-full border ${
                    selectedPrice === item ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold mb-4">CATEGORIES</p>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center justify-between rounded-lg py-2 cursor-pointer hover:bg-gray-100 transition"
                >
                  {/* Left side */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories((prev) => [
                            ...prev,
                            category.id,
                          ]);
                        } else {
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== category.id),
                          );
                        }
                      }}
                    />
                    <span className="text-sm text-gray-800">
                      {category.name}
                    </span>
                  </div>

                  {/* Right side (badge) */}
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full min-w-5 text-center">
                    {categoryCountMap[category.id] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <section className="col-span-9">
          <p className="text-sm text-gray-500 mb-4">
            Showing{" "}
            <span className="font-semibold">{filteredProducts.length}</span>{" "}
            products
          </p>

          {filteredProducts.length === 0 ? (
            <ProductNotFound handleResetFilters={handleResetFilters} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <ShopCardComponent
                  key={product.id || index}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProductNotFound({ handleResetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">
        No products match these filters
      </h3>

      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        Try raising the price limit or clearing category filters.
      </p>

      <button
        onClick={handleResetFilters}
        className="mt-6 px-5 py-2.5 text-sm font-medium rounded-full border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition"
      >
        Reset all filters
      </button>
    </div>
  );
}
