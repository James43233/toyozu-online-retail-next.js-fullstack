"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User } from "lucide-react";
import Logo from "../assets/Arrival.png";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

const CART_STORAGE_KEY = "cartItems";

function getCartCountFromStorage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return 0;
    return parsed.length;
  } catch {
    return 0;
  }
}

export default function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const sync = () => setCartCount(getCartCountFromStorage());
    sync();

    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) sync();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", sync as EventListener);
    };
  }, []);

  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const roleid = typeof window !== "undefined" ? localStorage.getItem("role_id") : null;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    router.push("/");
  };

  const onSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Send user to products page with query param (adjust route as needed)
    const params = new URLSearchParams();
    if (searchValue) params.set("q", searchValue);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border px-6 py-3 flex items-center justify-between shadow-sm w-full">
      {/* Logo */}
      <div
        className="flex items-center justify-center cursor-pointer flex-1"
        onClick={() => router.push("/")}
        role="button"
        aria-label="Go to home"
      >
        <Image src={Logo} alt="Toyozu Logo" width={60} height={60} priority />
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-8 flex justify-center">
        <form onSubmit={onSearchSubmit} className="relative w-full max-w-[600px]">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Search className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6 relative justify-center flex-1 gap-10 ">
        {isLoggedIn && (
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/cart")}
              aria-label="Cart"
              className="relative"
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
            <span className="absolute -bottom-1 -right-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount || 0}
            </span>
          </div>
        )}

        {/* User Menu */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="User menu">
                <User className="w-7 h-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => router.push("/user-dashboard")}>Account</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/unauthorized")}>Purchases</DropdownMenuItem>

              {(roleid === "1" || roleid === "2" || roleid === "3") && (
                <DropdownMenuItem onClick={() => router.push("/admin-dashboard")}>
                  Admin Dashboard
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" onClick={() => router.push("/login")}
              className="text-sm font-medium">
              Sign In
            </Button>
            <span className="h-6 w-px bg-border" />
            <Button type="button" variant="ghost" onClick={() => router.push("/register")}
              className="text-sm font-medium">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}