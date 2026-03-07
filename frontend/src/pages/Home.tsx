import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data?.content || res.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts([
        { id: 1, name: 'Premium Wireless Headphones', price: 199.99, description: 'High-quality noise-canceling headphones.', stock: 10 },
        { id: 2, name: 'Mechanical Keyboard', price: 89.50, description: 'RGB backlit mechanical keyboard with blue switches.', stock: 15 },
        { id: 3, name: 'Ultra-thin Laptop', price: 1299.00, description: 'Lightweight laptop with powerful processor.', stock: 5 },
        { id: 4, name: 'Smart Watch Series X', price: 299.00, description: 'Waterproof smart watch with health tracking.', stock: 20 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-50 rounded p-8 text-center border border-primary-100">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Welcome to E-Shop</h1>
        <p className="text-primary-700">Find the best products at the best prices.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b border-slate-200 pb-2">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden hover:shadow transition-shadow flex flex-col"
            >
              <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                <span className="text-slate-300 text-4xl">📦</span>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-slate-800 mb-1 line-clamp-2" title={product.name}>
                  {product.name}
                </h3>
                <div className="text-lg font-bold text-slate-900 mt-1 mb-4">${product.price}</div>
                <div className="mt-auto">
                  <Link
                    to={`/product/${product.id}`}
                    className="block text-center w-full py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded border border-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
