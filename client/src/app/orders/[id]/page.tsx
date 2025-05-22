"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "@/lib/axios";
import { Order, OrderItem } from "@/types";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { use } from 'react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params); 
  
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Fetch order details
      const response = await axios.get(`/orders/${orderId}`);
      
      // Transform the response data if needed to match our Order type
      const orderData = {
        ...response.data,
        // Ensure items is properly mapped to match our OrderItem type
        items: response.data.items?.map((item: OrderItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId,
          image: item.image || "https://via.placeholder.com/100"
        })) || []
      };
      
      setOrder(orderData);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder, orderId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-4">Error</h1>
        <p className="mb-8 text-red-600 dark:text-red-400">{error}</p>
        <Link href="/orders" className="btn btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-4">Order Not Found</h1>
        <p className="mb-8">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        <Link href="/orders" className="btn btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 flex items-center">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4" />
        <div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you for your order. We&apos;ve received your order and will begin processing it soon.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Order #{order.id}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {order.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Items</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0 h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded relative">
                    {item.image && (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        className="object-cover rounded"
                        fill
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${parseFloat(item.price.toString()).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>${parseFloat(order.totalAmount.toString()).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <p>Included</p>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-medium">
              <p>Total</p>
              <p>${parseFloat(order.totalAmount.toString()).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          <address className="not-italic">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Payment Status</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.paymentStatus === 'paid' 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : order.paymentStatus === 'pending'
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/products" className="btn btn-secondary">
          Continue Shopping
        </Link>
        <Link href="/orders" className="btn btn-primary">
          View All Orders
        </Link>
      </div>
    </div>
  );
} 
