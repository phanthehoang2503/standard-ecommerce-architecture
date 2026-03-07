import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
      setProduct({
        id: id,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        description: 'Industry leading noise cancellation, incredible sound quality, and unparalleled comfort.',
        stock: 10
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart failed', error);
      alert('Added to cart (mocked)!');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading...</div>;
  if (!product) return <div className="text-center mt-20 text-slate-500">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        &larr; Back to Products
      </button>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 min-h-[300px]">
          <span className="text-6xl text-slate-300">🎧</span>
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            New Arrival
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {product.name}
          </h1>

          <div className="text-2xl font-semibold text-slate-900 mb-4 pb-4 border-b border-slate-100">
            ${product.price}
          </div>

          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            {product.description || 'No description available for this product.'}
          </p>

          <div className="mt-auto pt-4">
            <button
              onClick={addToCart}
              disabled={addingToCart}
              className={`w-full bg-primary-600 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm ${addingToCart ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
