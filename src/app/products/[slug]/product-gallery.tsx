"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductGalleryProps {
  images: Array<{
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }>;
  productName: string;
  badge?: string | null;
  discountPercent?: number | null;
}

export function ProductGallery({
  images,
  productName,
  badge,
  discountPercent,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: "fallback",
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
            isPrimary: true,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border bg-muted/20 shadow-md">
        <Image
          src={currentImage.imageUrl}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-2">
            {badge && (
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-md text-foreground font-bold text-xs shadow-sm"
              >
                {badge}
              </Badge>
            )}
            {discountPercent && (
              <Badge className="bg-rose-600 hover:bg-rose-600 text-white font-bold text-xs shadow-sm">
                Diskon {discountPercent}%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails Selector */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative size-18 sm:size-20 shrink-0 overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-primary border-primary shadow-sm scale-102"
                    : "opacity-70 hover:opacity-100 border-border"
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
