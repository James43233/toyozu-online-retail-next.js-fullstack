"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../common/Header";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PaymentMethod = "cod" | "gcash" | "card";

type CheckoutItem = {
  product: string;
  product_name: string;
  product_image?: string;
  brand_name?: string;
  category_name?: string;
  selling_price: number;
  quantity: number;
};

type CheckoutData = {
  items: CheckoutItem[];
};

type Address = {
  id: string;
  label: string;
  lines: string[];
};

type Courier = {
  id: string;
  name: string;
  eta: string;
  fee: number;
};

const CHECKOUT_STORAGE_KEY = "checkoutData";

const DEMO_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    lines: ["123 Demo Street", "Makati, NCR"],
  },
  {
    id: "addr-2",
    label: "Office",
    lines: ["45 Example Ave", "Taguig, NCR"],
  },
];

const DEMO_COURIERS: Courier[] = [
  { id: "courier-1", name: "Demo Express", eta: "2–3 days", fee: 120 },
  { id: "courier-2", name: "Demo Same-day", eta: "Same day", fee: 220 },
];

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeCheckoutItems(value: unknown): CheckoutItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((raw) => {
      const item = raw as Partial<CheckoutItem>;
      if (!item.product || !item.product_name) return null;

      const sellingPrice = Number(item.selling_price);
      const quantity = Number(item.quantity);
      if (!Number.isFinite(sellingPrice) || sellingPrice < 0) return null;
      if (!Number.isFinite(quantity) || quantity <= 0) return null;

      const normalized: CheckoutItem = {
        product: String(item.product),
        product_name: String(item.product_name),
        product_image: item.product_image ? String(item.product_image) : undefined,
        brand_name: item.brand_name ? String(item.brand_name) : undefined,
        category_name: item.category_name ? String(item.category_name) : undefined,
        selling_price: sellingPrice,
        quantity: Math.max(1, Math.floor(quantity)),
      };
      return normalized;
    })
    .filter((x): x is CheckoutItem => x !== null);
}

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(DEMO_ADDRESSES[0]?.id ?? "");
  const [selectedCourierId, setSelectedCourierId] = useState<string>(DEMO_COURIERS[0]?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = safeParseJson<unknown>(localStorage.getItem(CHECKOUT_STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") {
      setItems([]);
      return;
    }
    const rawItems = (parsed as Partial<CheckoutData>).items;
    setItems(normalizeCheckoutItems(rawItems));
  }, []);

  const selectedCourier = useMemo(
    () => DEMO_COURIERS.find((c) => c.id === selectedCourierId) ?? null,
    [selectedCourierId]
  );

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.selling_price * it.quantity, 0);
  }, [items]);

  const shippingCost = selectedCourier?.fee ?? 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      window.alert("No items selected for checkout.");
      return;
    }
    if (!selectedAddressId) {
      window.alert("Please select a delivery address.");
      return;
    }
    if (!selectedCourierId) {
      window.alert("Please select a courier.");
      return;
    }

    window.alert(
      `Order placed (demo only).\n\nItems: ${items.length}\nPayment: ${paymentMethod.toUpperCase()}\nTotal: ₱${total.toLocaleString()}`
    );

    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    router.push("/user-dashboard");
  };

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 pb-12 mt-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-sm text-muted-foreground">Demo only • No backend calls</p>
          </div>
          <Badge variant="secondary">Light mode</Badge>
        </div>

        {!hasItems ? (
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <div className="text-center space-y-3">
              <p className="text-foreground font-semibold">No items selected for checkout.</p>
              <p className="text-sm text-muted-foreground">Go back to your cart and select items to continue.</p>
              <Button onClick={() => router.push("/cart")}>Go to cart</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Order Items</h2>
                </div>
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category / Brand</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.product}>
                          <TableCell className="whitespace-normal">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.product_image || "/placeholder.svg"}
                                alt={it.product_name}
                                className="h-12 w-12 rounded-md border border-border object-cover"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-foreground line-clamp-1">{it.product_name}</div>
                                <div className="text-xs text-muted-foreground">ID: {it.product}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-normal text-muted-foreground">
                            {[it.category_name, it.brand_name].filter(Boolean).join(" • ") || "—"}
                          </TableCell>
                          <TableCell className="text-right text-foreground">{it.quantity}</TableCell>
                          <TableCell className="text-right text-foreground">₱{it.selling_price.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium text-foreground">
                            ₱{(it.selling_price * it.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Delivery</h3>
                  <p className="text-sm text-muted-foreground">Select a demo address and courier.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Address</div>
                    <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEMO_ADDRESSES.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">
                      {(DEMO_ADDRESSES.find((a) => a.id === selectedAddressId)?.lines ?? []).join(" • ")}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Courier</div>
                    <Select value={selectedCourierId} onValueChange={setSelectedCourierId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select courier" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEMO_COURIERS.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">
                      {selectedCourier ? `${selectedCourier.eta} • ₱${selectedCourier.fee.toLocaleString()}` : ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Payment method</div>
                    <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                        <SelectItem value="gcash">GCash (demo)</SelectItem>
                        <SelectItem value="card">Card (demo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Notes (optional)</div>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Call upon arrival" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">₱{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-semibold text-foreground">₱{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={handlePlaceOrder}>
                  Place Order
                </Button>

                <p className="text-xs text-muted-foreground">
                  By placing this order, you agree to our Terms & Conditions (demo text).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}