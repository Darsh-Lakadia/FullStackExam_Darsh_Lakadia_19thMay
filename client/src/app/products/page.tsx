import { Suspense } from "react";
import ProductsSkeleton from "@/components/ui/ProductsSkeleton";
import ProductsPage from "./ProductsPage";
import { getProducts } from "../api/products";
import { getCategories } from "@/app/api/categories";
import { ProductSearchParams } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract and convert search parameters to the right format
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit, 10) : 12;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  
  // Prepare formatted params for API call
  const formattedParams: ProductSearchParams = {
    page,
    limit,
    search,
    category
  };
  
  // Fetch initial data on the server
  const productData = await getProducts(formattedParams);
  const categories = await getCategories();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsPage
            initialProducts={productData.products} 
            initialTotalPages={productData.totalPages} 
            initialCurrentPage={productData.currentPage}
            categories={categories}
            initialSearch={search}
            initialCategory={category}
          />
        </Suspense>
      </div>
    </div>
  );
} 
