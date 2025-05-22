"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { CartItem, Product } from "@/types";
import axios from "@/lib/axios";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = async () => {
    setIsAdding(true);
    setError("");

    try {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        // For demo: use local storage cart if not authenticated
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        // Check if product is already in cart
        const existingItemIndex = localCart.findIndex(
          (item: CartItem) => item.productId === product._id
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if already in cart
          localCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          localCart.push({
            _id: Date.now().toString(), // Generate a temporary ID
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0] || "",
          });
        }
        
        localStorage.setItem("cart", JSON.stringify(localCart));
      } else {
        // If authenticated, add to cart via API
        await axios.post("/cart/items", {
          productId: product._id,
          quantity,
        });
      }
      
      // Redirect to cart page
      router.push("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <div className="mt-4 flex items-center">
        <p className="text-2xl font-medium">${product.price.toFixed(2)}</p>
        <div className="ml-4 flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.ratings.count > 0
              ? `${product.ratings.average.toFixed(1)} stars (${product.ratings.count} reviews)`
              : "No reviews yet"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium">Description</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{product.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium">Features</h2>
        {product.features && product.features.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-gray-500 dark:text-gray-400">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500 dark:text-gray-400">No features listed</p>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium">Quantity:</p>
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={decrementQuantity}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
            >
              <span className="sr-only">Decrease quantity</span>
              <span className="h-4 w-4 flex items-center justify-center">−</span>
            </button>
            <span className="px-4">{quantity}</span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span className="sr-only">Increase quantity</span>
              <span className="h-4 w-4 flex items-center justify-center">+</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={addToCart}
            disabled={isAdding || product.stock < 1}
            className="btn btn-primary flex items-center justify-center w-full"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            {isAdding ? "Adding..." : product.stock < 1 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {product.stock > 0 ? (
            <p>{product.stock} in stock</p>
          ) : (
            <p>Currently out of stock</p>
          )}
        </div>
      </div>
    </div>
  );
} 
