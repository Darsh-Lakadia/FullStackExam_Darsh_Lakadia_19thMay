import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { fetchProducts } from "@/lib/data";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; order?: string; search?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "createdAt";
  const order = (searchParams.order as "asc" | "desc") || "desc";
  const search = searchParams.search || "";

  const { products, totalPages } = await fetchProducts({
    page,
    limit: 10,
    sort,
    order,
    search: search || undefined,
  });

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    }>
      <ProductsClient 
        initialProducts={products} 
        initialTotalPages={totalPages}
        initialPage={page}
        initialSort={sort}
        initialOrder={order}
        initialSearch={search}
      />
    </Suspense>
  );
}
