import axios from "./axios";
import { Product } from "@/types";

interface FetchProductsParams {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
}

export async function fetchProducts(params: FetchProductsParams): Promise<ProductsResponse> {
  try {
    const response = await axios.get(`/products`, {
      params: {
        page: params.page,
        limit: params.limit,
        sort: params.sort,
        order: params.order,
        search: params.search,
      },
    });

    return {
      products: response.data.products || [],
      totalPages: response.data.totalPages || 1,
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    return {
      products: [],
      totalPages: 1,
    };
  }
} 
