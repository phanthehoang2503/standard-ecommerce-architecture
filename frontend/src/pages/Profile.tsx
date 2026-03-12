import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', dob: '', address: '' });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const userRes = await api.get('/users/me').catch(() => null);
      if (userRes && userRes.data) {
        const userData = userRes.data.result || userRes.data;
        setUser({
          name: userData.fullName || userData.username || 'User',
          email: `${userData.username || 'user'}@example.com`,
          dob: userData.dob,
          address: userData.address
        });
        setEditForm({
          name: userData.fullName || userData.username || '',
          dob: userData.dob || '',
          address: userData.address || ''
        });
      } else {
        setUser({ name: 'User', email: 'user@example.com', address: '' });
        setEditForm({ name: '', dob: '', address: '' });
      }

      const ordersRes = await api.get('/order/my-orders').catch(() => ({
        data: []
      }));
      setOrders(ordersRes.data?.result || ordersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.put('/users/me', {
        fullName: editForm.name,
        dob: editForm.dob || null,
        address: editForm.address
      });
      setUser((prev: any) => ({ ...prev, name: editForm.name, dob: editForm.dob, address: editForm.address }));
      setIsEditing(false);
      alert(t('profile.updateSuccess'));
    } catch (error) {
      console.error('Failed to update profile', error);
      alert(t('profile.updateFail'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-500">{t('profile.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">{t('profile.title')}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm mb-6">
            {!isEditing ? (
              <>
                <h2 className="text-lg font-bold text-slate-800 mb-1">{user?.name}</h2>
                <p className="text-slate-500 text-sm mb-1">{user?.email}</p>
                {user?.dob && <p className="text-slate-400 text-xs mb-1">{t('profile.dob')}: {user.dob}</p>}
                {user?.address && <p className="text-slate-400 text-xs mb-4">{t('profile.addressLabel')}: {user.address}</p>}
                {!user?.dob && !user?.address && <div className="mb-4"></div>}

                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded hover:bg-slate-100 transition-colors"
                >
                  {t('profile.edit')}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('profile.fullName')}</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('profile.dob')}</label>
                  <input 
                    type="date" 
                    value={editForm.dob} 
                    onChange={e => setEditForm(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{t('profile.addressLabel')}</label>
                  <textarea 
                    value={editForm.address} 
                    onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 py-1.5 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors"
                  >
                    {saving ? `${t('profile.save')}...` : t('profile.save')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: user?.name, dob: user?.dob || '' });
                    }}
                    className="flex-1 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded hover:bg-slate-200 transition-colors"
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm border-b border-slate-100 pb-2">
              {t('profile.address')}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {user?.address || t('profile.noAddress')}
            </p>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">{t('profile.orderHistory')}</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  {t('profile.noOrders')}
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {order.id}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                          {t('profile.paymentLabel')}{order.paymentStatus || 'PENDING'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{t('profile.placedOn')} {order.date || order.createdAt}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-slate-900">{(order.total || order.totalAmount || 0).toLocaleString()} ₫</div>
                      <Link
                        to={`/order/${order.id}`}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-100 bg-primary-50 px-3 py-1.5 rounded transition-colors cursor-pointer hover:bg-primary-100"
                      >
                        {t('profile.view')}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
