import axios from '../../lib/axios';
import { RevenueData, InventoryData } from '@/types';

export const fetchRevenueData = async (): Promise<RevenueData[]> => {
  let token;
  
  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const response = await axios.get('/reports/sales', {
    headers: token ? {
      Authorization: `Bearer ${token}`
    } : undefined
  });
  return response.data || [];
};

export const fetchInventoryData = async (): Promise<InventoryData[]> => {
  let token;
  
  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const response = await axios.get('/reports/inventory', {
    headers: token ? {
      Authorization: `Bearer ${token}`
    } : undefined
  });
  return response.data || [];
};
