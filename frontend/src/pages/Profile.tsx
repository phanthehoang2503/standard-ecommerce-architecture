import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

      const userRes = await api.get('/users/my-profile').catch(() => null);
      if (userRes && userRes.data) {
        const userData = userRes.data.result || userRes.data;
        setUser({
          name: userData.fullName || userData.username || 'User',
          email: `${userData.username || 'user'}@example.com`,
          dob: userData.dob
        });
      } else {
        setUser({ name: 'User', email: 'user@example.com' })
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

  if (loading) return <div className="text-center mt-20 text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">My Account</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-1">{user?.name}</h2>
            <p className="text-slate-500 text-sm mb-1">{user?.email}</p>
            {user?.dob && <p className="text-slate-400 text-xs mb-4">DOB: {user.dob}</p>}
            {!user?.dob && <div className="mb-4"></div>}

            <button className="w-full py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded hover:bg-slate-100 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm border-b border-slate-100 pb-2">
              Default Address
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              123 Main Street<br />
              Apartment 4B<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Order History</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  No orders found.
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {order.id}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Placed on {order.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-slate-900">{order.total.toLocaleString()} ₫</div>
                      <Link
                        to={`/order/${order.id}`}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-100 bg-primary-50 px-3 py-1.5 rounded transition-colors cursor-pointer hover:bg-primary-100"
                      >
                        View
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
