"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [""],
    features: [""],
  });

  useEffect(() => {
    if (!isAuthenticated && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (index: number, field: "images" | "features", value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field: "images" | "features") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (index: number, field: "images" | "features") => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray.length ? newArray : [""],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Format the data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Filter out empty values
        images: formData.images.filter(img => img.trim() !== ""),
        features: formData.features.filter(feature => feature.trim() !== ""),
      };

      await axios.post("/products", productData);
      router.push("/admin/products");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error creating product:", error);
      setError("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Add New Product</h1>
        <Link href="/admin/products" className="btn btn-secondary">
          Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            {formData.images.map((url, index) => (
              <div key={`image-${index}`} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleArrayChange(index, "images", e.target.value)}
                  placeholder="Image URL"
                  className="input flex-grow"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "images")}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("images")}
              className="btn btn-outline btn-sm"
            >
              Add Image URL
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange(index, "features", e.target.value)}
                  placeholder="Product feature"
                  className="input flex-grow"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "features")}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("features")}
              className="btn btn-outline btn-sm"
            >
              Add Feature
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/admin/products" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
