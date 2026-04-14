"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Plus } from "lucide-react";
import SectionHeaderComponent from "@/components/SectionHeaderComponent";
import ProduceCardWithModifyComponent from "@/components/manage-products/ProduceCardWithModifyComponent";
import CreateProductModal from "@/components/manage-products/CreateProductModal";

import { getAllProducts } from "@/service/product.service";

const options = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selected, setSelected] = useState("name-asc");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const current = options.find((o) => o.value === selected);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.user?.accessToken) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      try {
        const data = await getAllProducts(session.user.accessToken);
        setProducts(data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchProducts();
    }
  }, [session]);

  const handleDelete = async (productId) => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    const token = session?.user?.accessToken;

    const success = await deleteProductById(productId, token);

    if (success) {
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } else {
      alert("Delete failed");
    }
  };

  const handleEdit = (product) => {
    router.push(`/products/edit/${product.productId}`);
  };

  const handleCreateProduct = (formData) => {
    // Add new product to the list (demo only)
    const newProduct = {
      productId: Date.now().toString(),
      productName: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      description: formData.description,
      colors: formData.colors,
      sizes: formData.sizes,
    };

    setProducts([...products, newProduct]);
    alert("Product created successfully (demo only)");
  };

  const sortedProducts = [...products].sort((a, b) => {
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
      <SectionHeaderComponent
        title="Manage products"
        desc="Create, update, and delete products."
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Sort</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full border border-gray-400 hover:border-lime-400 text-sm flex items-center gap-2 bg-gray-100 transition">
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
                  className="flex items-center justify-between cursor-pointer data-highlighted:bg-lime-100"
                >
                  {item.label}
                  {selected === item.value && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SectionHeaderComponent>

      <div className="border p-10 rounded-2xl">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-lime-400 hover:bg-lime-500 text-sm text-gray-900 font-semibold rounded-full"
          >
            <Plus className="w-5 h-5" />
            Create product
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 h-50 text-center flex items-center justify-center">
            Loading products...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProduceCardWithModifyComponent
                  key={product.productId}
                  product={product}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <p className="text-gray-500 h-50 text-center flex items-center justify-center">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>

      <CreateProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}x
      />
    </div>
  );
}
