"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { getAllCategories, updateProductById } from "@/service/product.service";

export default function EditProductModal({ open, onClose, product }) {
  const { data: session } = useSession();
  const [categoryList, setCategoryList] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    colors: [],
    sizes: [],
    description: "",
  });

  const colors = ["green", "gray", "red", "blue", "white"];
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const toggleValue = (field, value) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    const token = session?.user?.accessToken;

    const payload = {
      name: form.name,
      price: Number(form.price),
      categoryId: form.category,
      imageUrl: form.imageUrl,
      colors: form.colors,
      sizes: form.sizes,
      description: form.description,
    };

    const result = await updateProductById(product.productId, payload, token);

    if (result) {
      alert("Product updated!");
      onClose();
    } else {
      alert("Failed");
    }
  };

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(session.user.accessToken);
        setCategoryList(data || []);
      } catch (err) {
        console.error(err);
        setCategoryList([]);
      }
    };

    fetchCategories();
  }, [session]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.productName || "",
        price: product.price || "",
        category: product.categoryId || "",
        imageUrl: product.imageUrl || "",
        colors: product.colors || [],
        sizes: product.sizes || [],
        description: product.description || "",
      });
    }
  }, [product]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold">Edit product</h2>
            <p className="text-sm text-gray-500">Update product details</p>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="">
                  {categoryList.length === 0 ? "Loading..." : "Select..."}
                </option>

                {categoryList.length === 0 && (
                  <option disabled>No categories found</option>
                )}

                {categoryList.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors
            </label>
            <div className="flex gap-4">
              {colors.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-full"
                >
                  <input
                    type="checkbox"
                    checked={form.colors.includes(c)}
                    onChange={() => toggleValue("colors", c)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-sm capitalize">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>
            <div className="flex gap-4">
              {sizes.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-full"
                >
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(s)}
                    onChange={() => toggleValue("sizes", s)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full bg-lime-400 hover:bg-lime-500 text-sm font-semibold"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
