'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import ProductsFilter from '@/components/products/ProductsFilter';
import ProductsList from '@/components/products/ProductsList';

interface ProductsPageProps {
  initialProducts: Product[];
  initialTotalPages: number;
  initialCurrentPage: number;
  categories: string[];
  initialSearch: string;
  initialCategory: string;
}

export default function ProductsPage({
  initialProducts,
  initialTotalPages,
  initialCurrentPage,
  categories,
  initialSearch,
  initialCategory
}: ProductsPageProps) {
  // We're not updating these values in this component, just passing initial values
  // from the server to the child components
  const router = useRouter();

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold">All Products</h1>
        {initialCurrentPage > 1 && (
          <p className="mt-2 text-sm text-gray-400">Page {initialCurrentPage}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <ProductsFilter 
            categories={categories} 
            selectedCategory={initialCategory} 
            searchQuery={initialSearch}
            onFilterChange={(newCategory, newSearch) => {
              // Update URL and reload page with new filters
              const params = new URLSearchParams();
              if (newSearch) params.set('search', newSearch);
              if (newCategory) params.set('category', newCategory);
              router.push(`/products?${params.toString()}`);
            }}
          />
        </div>

        {/* Product grid */}
        <div className="w-full md:w-3/4">
          <ProductsList
            products={initialProducts} 
            totalPages={initialTotalPages} 
            currentPage={initialCurrentPage}
            search={initialSearch}
            category={initialCategory}
          />
        </div>
      </div>
    </>
  );
} 
