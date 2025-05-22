"use client";

import {
  ShoppingCartIcon,
  UserIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isAdmin, signOut, checkAuthStatus } = useAuth();

  useEffect(() => {
    setMounted(true);
    // Check auth status when component mounts
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-lg font-semibold">ShopNest</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isAdmin ? (
                <>
                  <Link
                    href="/admin/reports"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    Reports
                  </Link>
                  <Link
                    href="/admin/products"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    Products
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/products"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    Products
                  </Link>
                  <Link
                    href="/orders"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    Orders
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </Link>
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Sign Out"
              >
                <ArrowRightCircleIcon className="h-5 w-5" />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
