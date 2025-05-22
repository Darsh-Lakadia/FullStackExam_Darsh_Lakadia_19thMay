"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import axios from "@/lib/axios";
import { CartItem } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // For demo: use local storage cart if not authenticated
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
        setIsLoading(false);
        return;
      }

      // If authenticated, get cart from API
      const response = await axios.get("/cart");
      setCartItems(response.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // Update local storage cart
        const updatedCart = cartItems.map((item) => {
          if (item._id === itemId) {
            return { ...item, quantity };
          }
          return item;
        });
        
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        return;
      }

      // If authenticated, update via API
      await axios.put(`/cart/items/${itemId}`, { quantity });
      fetchCart(); // Refresh cart after update
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again.");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // Remove from local storage cart
        const updatedCart = cartItems.filter((item) => item._id !== itemId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        return;
      }

      // If authenticated, remove via API
      await axios.delete(`/cart/items/${itemId}`);
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Your Shopping Cart</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <li key={item._id} className="p-6 flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 h-24 w-24 relative rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">
                          <Link href={`/products/${item.productId}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => updateItemQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            <MinusIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <PlusIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${calculateTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>Calculated at checkout</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4 font-medium">
                  <p>Total</p>
                  <p>${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn btn-primary w-full"
                >
                  Proceed to Checkout
                </button>
                <div className="mt-4">
                  <Link href="/products" className="text-sm text-center block hover:underline">
                    or continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
