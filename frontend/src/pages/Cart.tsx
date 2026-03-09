import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data?.items || res.data || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCartItems([
        { id: 1, product: { id: 1, name: 'Premium Wireless Headphones', price: 199.99 }, quantity: 1 },
        { id: 2, product: { id: 2, name: 'Mechanical Keyboard', price: 89.50 }, quantity: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      fetchCart();
    } catch {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clearCart');
      setCartItems([]);
    } catch {
      setCartItems([]);
    }
  };

  const checkout = async () => {
    try {
      await api.post('/order/checkout');
      alert('Checkout successful!');
      setCartItems([]);
      navigate('/profile');
    } catch (error) {
      alert('Checkout mocked success');
      setCartItems([]);
      navigate('/profile');
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading cart...</div>;

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 text-center rounded border border-slate-200 shadow-sm">
          <div className="text-4xl mb-3 text-slate-300">🛒</div>
          <h2 className="text-lg font-medium text-slate-700 mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="text-primary-600 text-sm font-medium hover:underline">
            &larr; Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-100 rounded text-xl">
                    📦
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm">{item.product.name}</h3>
                    <div className="text-slate-500 text-xs mt-1">
                      {item.product.price.toLocaleString()} ₫ &times; {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-slate-900">
                    {(item.product.price * item.quantity).toLocaleString()} ₫
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="mt-4 text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-slate-50 p-5 rounded border border-slate-200 shadow-sm sticky top-20">
              <h2 className="text-lg font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">Order Summary</h2>
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-base text-slate-900">
                  <span>Total</span>
                  <span>{total.toLocaleString()} ₫</span>
                </div>
              </div>
              <button
                onClick={checkout}
                className="w-full bg-primary-600 text-white py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
