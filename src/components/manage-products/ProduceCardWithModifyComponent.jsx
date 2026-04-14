"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonAddComponent from "../ButtonAddComponent";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function StarRow({ rating = 4.8 }) {
  return (
    <p
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`${rating} stars`}
    >
      <span className="text-sm">★★★★★</span>
      <span className="ml-1 text-xs tabular-nums text-gray-500">{rating}</span>
    </p>
  );
}

export default function ProduceCardWithModifyComponent({
  product,
  onEdit,
  onDelete,
}) {
  const { productId, name, productName, price, imageUrl } = product;
  const displayName = name || productName;

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="absolute right-3 top-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full p-2 text-gray-500 bg-white border">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() =>
                onEdit ? onEdit(product) : console.log("Edit", productId)
              }
              className="flex cursor-pointer items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                onDelete
                  ? onDelete(productId)
                  : console.log("Delete", productId)
              }
              className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-transparent data-highlighted:bg-red-50 data-highlighted:text-red-600"
            >
              <Trash2 className="h-4 w-4 text-current" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
              ◇
            </div>
          )}
        </div>
      </Link>

      <div className="relative mt-4 pr-14">
        <StarRow />

        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {displayName}
          </h3>
        </Link>

        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">
          ${price}
        </p>
      </div>

      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent productId={productId} />
      </div>
    </article>
  );
}
