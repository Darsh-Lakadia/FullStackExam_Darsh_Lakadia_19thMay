import axios from "./axios";
import { Product, Cart, Order, User } from "@/types";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    axios.post<{ token: string; user: User }>("/auth/login", data),

  register: (data: { username: string; email: string; password: string }) =>
    axios.post<{ token: string; user: User }>("/auth/register", data),

  getCurrentUser: () => axios.get<{ user: User }>("/auth/me"),
};

export const productsApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) =>
    axios.get<{
      products: Product[];
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    }>("/products", { params }),

  getProduct: (id: string) => axios.get<Product>(`/products/${id}`),

  getCategories: () => axios.get<string[]>("/products/categories"),

  createProduct: (
    data: Omit<Product, "_id" | "createdAt" | "updatedAt" | "ratings">
  ) => axios.post<Product>("/products", data),

  updateProduct: (
    id: string,
    data: Partial<Omit<Product, "_id" | "createdAt" | "updatedAt">>
  ) => axios.put<Product>(`/products/${id}`, data),

  deleteProduct: (id: string) =>
    axios.delete<{ message: string }>(`/products/${id}`),
};

export const cartApi = {
  getCart: () => axios.get<Cart>("/cart"),

  addToCart: (data: { productId: string; quantity: number }) =>
    axios.post<Cart>("/cart", data),

  updateCartItem: (productId: string, quantity: number) =>
    axios.put<Cart>(`/cart/${productId}`, { quantity }),

  removeFromCart: (productId: string) =>
    axios.delete<Cart>(`/cart/${productId}`),

  clearCart: () => axios.delete<Cart>("/cart"),
};

export const ordersApi = {
  createOrder: (data: {
    shippingAddress: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
  }) => axios.post<{ message: string; order: Order }>("/orders", data),

  getUserOrders: () => axios.get<Order[]>("/orders"),

  getOrder: (id: string) => axios.get<Order>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    axios.put<Order>(`/orders/${id}/status`, { status }),

  updatePaymentStatus: (id: string, paymentStatus: string) =>
    axios.put<Order>(`/orders/${id}/payment`, { paymentStatus }),
};

export const reportsApi = {
  getSalesReport: (params?: { startDate?: string; endDate?: string }) =>
    axios.get<{ date: string; revenue: number }[]>("/reports/sales", {
      params,
    }),

  getInventoryReport: () =>
    axios.get<{ product: string; stock: number }[]>("/reports/inventory"),
};
