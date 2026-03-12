import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function OrderDetail() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/order/${id}`);
        setOrder(res.data?.result || res.data);
      } catch (err) {
        console.error('Failed to fetch order details', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{t('order.notFound')}</h2>
        <p className="text-slate-500 mb-6">{error || "We couldn't find the order you're looking for."}</p>
        <Link to="/profile" className="text-primary-600 hover:underline font-medium">
          &larr; {t('order.back')}
        </Link>
      </div>
    );
  }

  // Fallback calculations if backend doesn't provide them nicely
  const orderItems = order.items || [];
  const status = order.status || 'Processing';
  const paymentStatus = order.paymentStatus || 'Pending';
  const total = order.total || orderItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('order.title')} #{order.id}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('profile.placedOn')} {order.createdAt || order.date || new Date().toLocaleDateString()}
          </p>
        </div>
        <Link to="/profile" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
          &larr; {t('order.back')}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('order.items')}</h2>
              <div className="flex gap-2">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                  {t('order.payment')}: {paymentStatus}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {t('order.fulfillment')}: {status}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {orderItems.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No items found in this order.</div>
              ) : (
                orderItems.map((item: any, index: number) => (
                  <div key={item.id || index} className="p-4 flex gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded flex-shrink-0 flex items-center justify-center border border-slate-100">
                      <span className="text-slate-300 text-xl">📦</span>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="font-medium text-slate-800 text-sm">{item.productName || item.name || 'Product'}</h4>
                      <p className="text-slate-500 text-xs mt-1">{t('order.qty')}: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col justify-center items-end text-sm">
                      <span className="font-semibold text-slate-900">{((item.price) * (item.quantity)).toLocaleString()} ₫</span>
                      <span className="text-slate-400 text-xs mt-0.5">{item.price.toLocaleString()} ₫/ea</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">{t('cart.summary')}</h2>

            <div className="space-y-3 text-sm border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>{t('cart.subtotal')}</span>
                <span>{total.toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t('cart.shipping')}</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t('order.tax')}</span>
                <span>0 ₫</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-slate-900 text-lg">
              <span>{t('cart.total')}</span>
              <span>{total.toLocaleString()} ₫</span>
            </div>
          </div>

          <div className="bg-white rounded border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">{t('order.shippingDetails')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              123 Main Street<br />
              Apartment 4B<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
