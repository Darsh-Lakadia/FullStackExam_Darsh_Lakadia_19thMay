"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axios";
import { Product } from "@/types";
import { useAuth } from "@/providers/auth-provider";

// Define the validation schema with zod
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  images: z.array(z.string().url("Please enter a valid URL").or(z.string().length(0))).min(1),
  features: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductPageProps {
  product: Product;
}

export default function EditProductPage({ product }: EditProductPageProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default values with type cast to avoid type errors
  const defaultValues = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    images: product.images.length ? product.images : [""],
    features: product.features || [""],
  } as ProductFormValues;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  // Use field arrays for dynamic inputs (images and features)
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features" as const, // Use const assertion to fix typing issue
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Clean up the data - filter out empty strings from arrays
      const productData = {
        ...data,
        images: data.images.filter(img => img.trim() !== ""),
        features: data.features?.filter(feature => feature.trim() !== "") || [],
      };

      await axios.put(`/products/${product._id}`, productData);
      router.push("/admin/products");
    } catch (err: unknown) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isAdmin, router]);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">Edit Product</h1>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                className="input"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category *
              </label>
              <input
                id="category"
                type="text"
                className="input"
                {...register("category")}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price ($) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="input"
                {...register("price")}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">
                Stock *
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                className="input"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className="input w-full"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images *</label>
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  className="input flex-grow"
                  {...register(`images.${index}`)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn btn-error btn-sm"
                  disabled={imageFields.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            {errors.images && typeof errors.images === 'object' && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {Array.isArray(errors.images) && errors.images[0]?.message 
                  ? errors.images[0].message 
                  : "Please add at least one valid image URL"}
              </p>
            )}
            <button
              type="button"
              onClick={() => appendImage("")}
              className="btn btn-outline btn-sm mt-2"
            >
              Add Image URL
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Product feature"
                  className="input flex-grow"
                  {...register(`features.${index}` as const)}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="btn btn-error btn-sm"
                  disabled={featureFields.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendFeature("")}
              className="btn btn-outline btn-sm mt-2"
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
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
