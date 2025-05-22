import { ProductSearchParams, Product } from "@/types";
import { API_BASE_URL } from "@/lib/constants";

export async function getProducts(searchParams: ProductSearchParams) {
  try {
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 12;
    const search = searchParams.search || "";
    const category = searchParams.category || "";

    const apiUrl = `${API_BASE_URL}/products`;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) {
      queryParams.append("search", search);
    }

    if (category) {
      queryParams.append("category", category);
    }

    const res = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalProducts: 0, totalPages: 0, currentPage: 1 };
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const apiUrl = `${API_BASE_URL}/products/${productId}`;

    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}
