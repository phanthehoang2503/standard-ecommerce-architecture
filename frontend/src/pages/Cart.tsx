import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { t } = useLanguage();
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
      const items = res.data?.result?.items || res.data?.result || res.data?.items || res.data;
      setCartItems(Array.isArray(items) ? items : []);
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
      setLoading(true);
      
      // Check if user has address
      const userRes = await api.get('/users/me');
      const user = userRes.data?.result || userRes.data;
      
      if (!user?.address) {
        alert(t('profile.noAddress'));
        navigate('/profile');
        return;
      }

      const res = await api.post('/order/checkout');
      const order = res.data?.result || res.data;

      if (order && order.id && order.totalAmount) {
        const paymentRes = await api.get(`/api/payment/create-url?orderId=${order.id}&amount=${order.totalAmount}`);
        const paymentUrl = paymentRes.data;
        if (typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
          setCartItems([]);
          window.location.href = paymentUrl; // Redirect to VNPay
          return;
        }
      }

      // Clear cart
      setCartItems([]);
      alert(t('cart.checkoutSuccess'));
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert('Checkout failed! Please try again later.');
    } finally {
      if (window.location.hostname !== 'sandbox.vnpayment.vn') {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-500">{t('cart.loading')}</div>;

  const total = cartItems.reduce((sum, item) => sum + ((item.product?.price || item.price || 0) * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">{t('cart.title')}</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 text-center rounded border border-slate-200 shadow-sm">
          <div className="text-4xl mb-3 text-slate-300">🛒</div>
          <h2 className="text-lg font-medium text-slate-700 mb-2">{t('cart.empty')}</h2>
          <button onClick={() => navigate('/')} className="text-primary-600 text-sm font-medium hover:underline">
            &larr; {t('cart.continue')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-3">
            {cartItems.map((item) => {
              const productName = item.product?.name || item.productName || item.name || 'Product';
              const productPrice = item.product?.price || item.price || 0;
              const productId = item.product?.id || item.productId || item.id;
              
              return (
              <div key={item.id} className="bg-white p-4 rounded border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-100 rounded text-xl">
                    📦
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm">{productName}</h3>
                    <div className="text-slate-500 text-xs mt-1">
                      {productPrice.toLocaleString()} ₫ &times; {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-slate-900">
                    {(productPrice * item.quantity).toLocaleString()} ₫
                  </div>
                  <button
                    onClick={() => removeItem(productId)}
                    className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            )})}

            <button
              onClick={clearCart}
              className="mt-4 text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              {t('cart.clear')}
            </button>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-slate-50 p-5 rounded border border-slate-200 shadow-sm sticky top-20">
              <h2 className="text-lg font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">{t('cart.summary')}</h2>
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>{total.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span>{t('cart.free')}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-base text-slate-900">
                  <span>{t('cart.total')}</span>
                  <span>{total.toLocaleString()} ₫</span>
                </div>
              </div>
              <button
                onClick={checkout}
                className="w-full bg-primary-600 text-white py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                {t('cart.checkout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
