import React, { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

/**
 * Lightweight typed ProductGrid TSX that uses mock/template data so
 * you can view the frontend without a backend.
 *
 * Drop this file at: components/user-components/ProductGrid.tsx
 *
 * Notes:
 * - Replaces axios/react-router usage with Next Link and local mock data.
 * - Later you can replace the mock loading with a fetch to /api/products.
 */

/* -------- Types -------- */
interface ProductImage {
  id?: number;
  image?: string;
  url?: string;
}

interface Product {
  product_id: number | string;
  name: string;
  brand_name?: string;
  images?: ProductImage[];
  discount?: number;
  quantity?: number;
  rating?: number;
  reviews?: number;
  selling_price: number;
}

/* -------- Mock data (template) --------
   Replace or extend these with real data later.
*/
const MOCK_PRODUCTS: Product[] = [
  {
    product_id: 1,
    name: "Brake Pads Premium",
    brand_name: "Brembo",
    images: [{ image: "/placeholder-product-1.jpg" }],
    discount: 10,
    quantity: 12,
    rating: 4.5,
    reviews: 24,
    selling_price: 1299.0,
  },
  {
    product_id: 2,
    name: "Oil Filter Standard",
    brand_name: "Mann Filter",
    images: [{ image: "/placeholder-product-2.jpg" }],
    discount: 0,
    quantity: 0,
    rating: 4.0,
    reviews: 8,
    selling_price: 299.0,
  },
  {
    product_id: 3,
    name: "Air Filter Deluxe",
    brand_name: "Bosch",
    images: [{ image: "/placeholder-product-3.jpg" }],
    discount: 5,
    quantity: 5,
    rating: 4.2,
    reviews: 12,
    selling_price: 499.0,
  },
  // add more mock items if you'd like to see fuller grid
];

/* -------- Component -------- */
export default function ProductGrid(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(20); // how many to show initially

  useEffect(() => {
    // simulate network delay so you can see the loading state
    const t = setTimeout(() => {
      // use mock/template data for now
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <div className="text-center py-6">Loading products...</div>;
  }

  if (!products.length) {
    return (
      <div className="text-center py-6 text-gray-500">No products found</div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center mb-5">
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-[1270px]">
        {visibleProducts.map((product) => {
          const firstImage =
            product.images?.[0]?.image ||
            product.images?.[0]?.url ||
            "/placeholder.svg";

          return (
            <Link
              key={product.product_id}
              href={`/products/${product.product_id}`}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow block"
            >
              {/* Image */}
              <div className="relative justify-center flex bg-white rounded-t-lg w-full h-[220px]">
                {/* using plain <img> to avoid next/image config for external hosts */}
                <img
                  src={firstImage}
                  alt={product.name}
                  className="w-full h-[220px] object-cover rounded-t-lg"
                />
                {product.discount && product.discount > 0 && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs font-bold">
                    -{product.discount}%
                  </Badge>
                )}
                {typeof product.quantity === "number" && product.quantity <= 0 && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-t-lg">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded font-semibold text-xs">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <div className="text-xs text-gray-500 mb-1">
                  {product.brand_name}
                </div>
                <h3
                  className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2 h-[50px]"
                  title={product.name}
                >
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {product.rating || 0} ({product.reviews || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  {product.discount && product.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-sm font-bold">
                        ₱{(product.selling_price * (1 - product.discount! / 100)).toFixed(2)}
                      </Badge>
                      <span className="text-xs text-muted line-through">₱{Number(product.selling_price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-primary">
                      ₱{Number(product.selling_price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to cart (UI only) */}
                <Button
                  size="sm"
                  className="w-full"
                  disabled={typeof product.quantity === "number" && product.quantity <= 0}
                >
                  {typeof product.quantity === "number" && product.quantity > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>
              </div>
            </Link>
          );
        })}
      </div>

      {/* More Button */}
      {visibleCount < products.length && (
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/all-products" onClick={() => setVisibleCount((c) => c + 20)} className="px-8 py-2 rounded-full font-semibold max-w-[100px]">
              More
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}