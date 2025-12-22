"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import {
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Car,
  Zap,
  Wrench,
  Droplet,
  Circle,
  HelpCircle,
} from "lucide-react";

import bremboLogo from "../assets/brembo-logo.png";
import boschLogo from "../assets/bosch-logo.png";
import ngkLogo from "../assets/ngk-logo.png";
import densoLogo from "../assets/denso-logo.png";
import mobil1Logo from "../assets/mobil-1-logo.png";
import castrolLogo from "../assets/castrol-logo.png";
import michelinLogo from "../assets/michelin-logo.png";
import bridgestoneLogo from "../assets/bridgestone-logo.png";
import continentalLogo from "../assets/continental-logo.png";
import acdelcoLogo from "../assets/acdelco-logo.png";
import mannFilterLogo from "../assets/mann-filter-logo.png";
import kybLogo from "../assets/kyb-logo.png";
import automotiveBanner from "../assets/automotive-banner.png";
import brakePadsBanner from "../assets/brake-pads-promotion-banner.png";
import oilFiltersBanner from "../assets/oil-filters-sale-banner.png";
import ToyozuGIF from "../assets/New.jpg";
import Logo from "../assets/Arrival.png";

import Header from "../common/Header";
import Footer from "../common/Footer";
import ProductGrid from "../components/user-components/product-components/ProductGrid";

import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

/**
 * Types
 */
interface Category {
  id: number;
  name: string;
}

interface Brand {
  name: string;
  logo: StaticImageData;
}

interface CarMake {
  car_id: number | string;
  make: string;
}

interface CarModel {
  model_id: number | string;
  car_id: number | string;
  model_name: string;
}

interface YearItem {
  year_id: number | string;
  year: number | string;
}

export default function LandingPage() {
  // Local demo data (no backend)
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Brake Pads" },
    { id: 2, name: "Engine Oil" },
    { id: 3, name: "Filters" },
    { id: 4, name: "Suspension" },
    { id: 5, name: "Lighting" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [carMakes, setCarMakes] = useState<CarMake[]>([
    { car_id: "1", make: "Toyota" },
    { car_id: "2", make: "Honda" },
    { car_id: "3", make: "Nissan" },
  ]);
  const [carModels, setCarModels] = useState<CarModel[]>([
    { model_id: "1", car_id: "1", model_name: "Corolla" },
    { model_id: "2", car_id: "1", model_name: "Hilux" },
    { model_id: "3", car_id: "2", model_name: "Civic" },
    { model_id: "4", car_id: "3", model_name: "Cruise" },
  ]);
  const [years, setYears] = useState<YearItem[]>([
    { year_id: "1", year: "2023" },
    { year_id: "2", year: "2022" },
    { year_id: "3", year: "2021" },
    { year_id: "4", year: "2020" },
  ]);

  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Frontend-only demo: no API calls.

  const brands: Brand[] = [
    { name: "Brembo", logo: bremboLogo },
    { name: "Bosch", logo: boschLogo },
    { name: "NGK", logo: ngkLogo },
    { name: "Denso", logo: densoLogo },
    { name: "Mobil 1", logo: mobil1Logo },
    { name: "Castrol", logo: castrolLogo },
    { name: "Michelin", logo: michelinLogo },
    { name: "Bridgestone", logo: bridgestoneLogo },
    { name: "Continental", logo: continentalLogo },
    { name: "ACDelco", logo: acdelcoLogo },
    { name: "Mann Filter", logo: mannFilterLogo },
    { name: "KYB", logo: kybLogo },
  ];

  const iconMap: Record<string, string> = {
    "Wield Shield": "🛡️",
    "Brake Fluid": "💧",
    Coolant: "🧊",
    "Head Lights": "💡",
    "Spark Plug": "⚡",
    "Engine Oil": "🛢️",
    "Brake Pad": "🛞",
    "Air Filter": "🌬️",
    "Fuel Filter": "⛽",
  };

  const slideImages = [automotiveBanner, brakePadsBanner, oilFiltersBanner];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [currentBrandSlide, setCurrentBrandSlide] = useState<number>(0);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  useEffect(() => {
    const brandTimer = setInterval(() => {
      setCurrentBrandSlide((prev) => (prev + 1) % Math.ceil(brands.length / 6));
    }, 3000);
    return () => clearInterval(brandTimer);
  }, [brands.length]);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleSearch = async (): Promise<void> => {
    // Demo-only: no backend. In future wire this to your API.
    const q = new URLSearchParams();
    if (selectedModel) q.set("car_model", selectedModel);
    if (selectedYear) q.set("year", selectedYear);
    console.log("Demo search (no backend):", q.toString());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Full-screen GIF background */}
        <img
          src={(ToyozuGIF as StaticImageData).src}
          alt="Toyozu Promo GIF"
          className="absolute inset-0 w-full h-[500px] object-cover z-0 blur-sm"
        />

        {/* Content over GIF */}
        <div className="relative z-[10] flex justify-center items-center h-full px-4 pb-35">
          <div className="p-10">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-primary-foreground drop-shadow-sm">
                Find Parts for Your Vehicle
              </h2>
              <p className="text-primary-foreground drop-shadow-sm">
                Select your car details to find compatible parts
              </p>
              <div className="w-24 h-1  mx-auto mt-4 rounded-full" />
            </div>

            {/* Main container with white background */}
            <div className="w-[800px] p-6 rounded-lg shadow-lg flex-row flex justify-between items-start gap-6 bg-surface text-surface-foreground">
              {/* LEFT SIDE — Form */}
              <div className="w-[600px]">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Car Brand
                    </label>
                    <Select
                      value={selectedMake}
                      onValueChange={(value) => {
                        setSelectedMake(value);
                        setSelectedModel("");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {carMakes.map((make) => (
                          <SelectItem key={String(make.car_id)} value={String(make.car_id)}>
                            {make.make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Car Model
                    </label>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={!selectedMake}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {carModels
                          .filter((m) => String(m.car_id) === String(selectedMake))
                          .map((model) => (
                            <SelectItem key={String(model.model_id)} value={String(model.model_id)}>
                              {model.model_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Year Model
                    </label>
                    <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedModel}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={String(y.year_id)} value={String(y.year)}>
                            {y.year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center mt-4">
                  <Button
                    type="button"
                    onClick={handleSearch}
                    className="px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all shadow-lg flex items-center space-x-2 bg-primary text-primary-foreground"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Find Compatible Parts</span>
                  </Button>
                </div>
              </div>

              {/* RIGHT SIDE — Information Box */}
              <div className="flex flex-col justify-center p-6 rounded-lg w-[250px] bg-primary-container border-primary-container text-tertiary-foreground">
                <h3 className="text-lg font-bold mb-2">Quick Tip</h3>
                <p className="text-sm leading-relaxed">
                  Select your vehicle’s brand, model, and year to instantly find parts compatible with your car.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="w-[1300px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold ">CATEGORIES</h2>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {displayedCategories.map((category, i) => {
              const icon = iconMap[category.name] || "📦"; // default fallback

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="px-4 py-3 rounded-lg flex items-center space-x-2 font-medium hover:scale-105 transition-all duration-200 hover:shadow-lg transform bg-primary-container text-primary-container-foreground"
                  // style animation kept for now
                >
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-lg">
                    <span>{icon}</span>
                  </div>
                  <span className="text-sm">{category.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-gray-600 font-medium hover:underline transition-all duration-150 hover:scale-105"
            >
              {showAllCategories ? "Show Less" : "More"}
            </button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-12 px-4 bg-transparent">
        <div className="w-[1300px] mx-auto">
          <h2 className="text-2xl font-bold text-justify mb-8">TRUSTED BRANDS</h2>

            <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentBrandSlide * 100}%)` }}>
              {Array.from({ length: Math.ceil(brands.length / 6) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-6 gap-6">
                    {brands.slice(slideIndex * 6, (slideIndex + 1) * 6).map((brand, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center bg-primary-foreground text-surface-foreground"
                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <img
                          src={(brand.logo as StaticImageData).src}
                          alt={brand.name}
                          className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Brand navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(brands.length / 6) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBrandSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentBrandSlide ? "bg-primary-container" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-full mx-auto flex justify-center items-center flex-col">
          <h2 className="text-2xl font-bold  text-justify mb-8">Discovery</h2>
          <ProductGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
}