import { API_BASE_URL } from "@/lib/constants";

export async function getCategories() {
  try {
    const apiUrl = `${API_BASE_URL}/products/categories`;
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
} 
