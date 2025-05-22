'use client';

import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

interface ProductsListProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  search: string;
  category: string;
}

export default function ProductsList({
  products,
  totalPages,
  currentPage,
  search,
  category
}: ProductsListProps) {
  return (
    <>
      {products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">No products found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex shadow-sm">
            {currentPage > 1 && (
              <Link
                href={{
                  pathname: "/products",
                  query: { 
                    page: currentPage - 1,
                    ...(search ? { search } : {}),
                    ...(category ? { category } : {})
                  },
                }}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </Link>
            )}
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={{
                  pathname: "/products",
                  query: { 
                    page: i + 1,
                    ...(search ? { search } : {}),
                    ...(category ? { category } : {})
                  },
                }}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </Link>
            ))}
            
            {currentPage < totalPages && (
              <Link
                href={{
                  pathname: "/products",
                  query: { 
                    page: currentPage + 1,
                    ...(search ? { search } : {}),
                    ...(category ? { category } : {})
                  },
                }}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
} 
