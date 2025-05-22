import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import EditProductPage from './EditProductPage';
import { API_BASE_URL } from '@/lib/constants';

// This is a server component
async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { 
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function EditProductServerPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <Suspense fallback={<div className="p-12 flex justify-center">Loading product data...</div>}>
      <EditProductPage product={product} />
    </Suspense>
  );
} 
