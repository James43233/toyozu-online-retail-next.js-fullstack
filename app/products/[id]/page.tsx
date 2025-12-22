"use client";

import React, { JSX, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Footer from "../../common/Footer";
import ProductGrid from "../../components/user-components/product-components/ProductGrid";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

/**
 * Product detail page (client-side) using mock data so you can view the UI
 * without any backend. Drop this file at: app/products/[id]/page.tsx
 */

/* -------- Types -------- */
interface ProductImage {
  id?: number;
  image: string;
}

interface CompatibleCar {
  car_model: {
    car_make: string;
    model_name: string;
  };
  year_start: { year: number };
  year_end: { year: number };
}

interface Product {
  product_id: number;
  name: string;
  brand_name?: string;
  category_name?: string;
  description?: string;
  selling_price: number;
  quantity: number;
  rating?: number;
  reviews?: number;
  images?: ProductImage[];
  condition_item?: string;
  compatible_cars?: CompatibleCar[];
}

/* -------- Mock store (template data) -------- */
const MOCK_PRODUCTS: Product[] = [
  {
    product_id: 1,
    name: "Brake Pads Premium",
    brand_name: "Brembo",
    category_name: "Brakes",
    description:
      "Premium ceramic brake pads for improved stopping power and reduced noise.",
    selling_price: 1299.0,
    quantity: 12,
    rating: 4.6,
    reviews: 34,
    condition_item: "New",
    images: [
      { id: 1, image: "/placeholder-product-1.jpg" },
      { id: 2, image: "/placeholder-product-1b.jpg" },
      { id: 3, image: "/placeholder-product-1c.jpg" },
    ],
    compatible_cars: [
      {
        car_model: { car_make: "Toyota", model_name: "Corolla" },
        year_start: { year: 2016 },
        year_end: { year: 2020 },
      },
    ],
  },
  {
    product_id: 2,
    name: "Oil Filter Standard",
    brand_name: "Mann Filter",
    category_name: "Filters",
    description: "Reliable oil filter for most standard engines.",
    selling_price: 299.0,
    quantity: 0,
    rating: 4.1,
    reviews: 12,
    images: [{ id: 1, image: "/placeholder-product-2.jpg" }],
    compatible_cars: [],
  },
  {
    product_id: 3,
    name: "Air Filter Deluxe",
    brand_name: "Bosch",
    category_name: "Filters",
    description: "High-flow air filter for better engine performance.",
    selling_price: 499.0,
    quantity: 5,
    rating: 4.2,
    reviews: 18,
    images: [{ id: 1, image: "/placeholder-product-3.jpg" }],
    compatible_cars: [],
  },
];

export default function ProductDetailPage(): JSX.Element {
  const params = useParams();
  const rawId = params?.id;
  const id = rawId ? Number(rawId) : NaN;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description",
  );

  useEffect(() => {
    // load product from mock store based on id
    const found = MOCK_PRODUCTS.find((p) => p.product_id === id) || null;
    setProduct(found);
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  const incrementQuantity = (): void => {
    if (!product) return;
    if (quantity < product.quantity) setQuantity((q) => q + 1);
  };

  const decrementQuantity = (): void => {
    if (!product) return;
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = async (): Promise<void> => {
    if (!product) return;
    // For mock mode just show an alert / console log
    console.log("Add to cart (mock):", { product_id: product.product_id, quantity });
    // show a simple browser alert for now
    alert(`(Mock) Added ${quantity} × ${product.name} to cart`);
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div>Product not found or loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Breadcrumb */}
      <div className="w-[1300px] mx-auto px-4 mt-4 mb-4">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <span className="text-primary hover:underline cursor-pointer">
                {product.category_name}
              </span>
            </li>
            <li className="text-muted-foreground">›</li>
            <li>
              <span className="text-primary hover:underline cursor-pointer">
                {product.brand_name}
              </span>
            </li>
            <li className="text-muted-foreground">›</li>
            <li>
              <span className="text-foreground font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-[1300px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-card p-6 rounded-lg shadow-sm">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg flex items-center justify-center w-[500px] h-[400px]">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage].image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1">
              {(product.images || []).slice(0, 5).map((img, index) => (
                <button
                  key={img.id ?? index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden w-[100px] h-[100px] ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={`${product.name} ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-sm text-muted-foreground mb-2">
                {product.brand_name} • {product.category_name}
              </p>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating || 0} ({product.reviews || 0})
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="primary">₱{product.selling_price}</Badge>
                <span className="text-success font-medium">✓ In Stock ({product.quantity} available)</span>
              </div>
            </div>

            {/* Quantity controls */}
            <div>
              <h3 className="font-medium text-foreground mb-2">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={decrementQuantity} className="p-2 hover:bg-muted transition-colors" disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button onClick={incrementQuantity} className="p-2 hover:bg-muted transition-colors" disabled={quantity >= product.quantity}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-muted-foreground">Max: {product.quantity} pieces</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                <Button variant="default" size="lg" onClick={handleAddToCart} className="w-full">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <Button variant="secondary" size="lg" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: description / specifications */}
        <div className="mt-16 bg-card p-8 rounded-lg shadow-sm">
          <nav className="flex space-x-8">
            {["description", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "description" | "specifications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="py-8 bg-card rounded-lg">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Product Description</h3>
                <p className="text-muted-foreground mb-4">{product.description || "No description available."}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Brand:</span>
                      <span className="text-muted-foreground">{product.brand_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Category:</span>
                      <span className="text-muted-foreground">{product.category_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Condition:</span>
                      <span className="text-muted-foreground">{product.condition_item || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Stock:</span>
                      <span className="text-muted-foreground">{product.quantity}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="py-2 border-b border-border">
                      <span className="font-medium block mb-1">Compatible Vehicles:</span>
                      {product.compatible_cars && product.compatible_cars.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {product.compatible_cars.map((c, i) => (
                            <li key={`compat-${i}`}>
                              {c.car_model.car_make} {c.car_model.model_name} ({c.year_start.year} – {c.year_end.year})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="py-8 rounded-lg mt-[30px]">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Customer Reviews</h3>
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>

        {/* Related / Related products */}
        <section className="">
          <div className="w-[1300px]">
            <h2 className="text-2xl font-bold text-primary text-justify mb-5">Related Products</h2>
            <ProductGrid />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}