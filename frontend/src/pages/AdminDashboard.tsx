import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchData(activeTab);
    }
  }, [navigate, activeTab]);

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      if (tab === 'products') {
        const res = await api.get('/products?size=20');
        setProducts(res.data?.result?.content || res.data?.content || []);
      } else if (tab === 'categories') {
        const res = await api.get('/categories');
        setCategories(res.data?.result || res.data || []);
      } else if (tab === 'users') {
        const res = await api.get('/users');
        setUsers(res.data?.result || res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">{t('admin.title')}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('admin.tabProducts')}
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('admin.tabCategories')}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('admin.tabUsers')}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
          {loading ? (
            <div className="text-center text-slate-500 py-12">{t('admin.loading')}</div>
          ) : (
            <>
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('admin.tabProducts').replace('📦 ', '')}</h2>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      {t('admin.addProduct')}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-medium">
                        <tr>
                          <th className="px-4 py-3 rounded-tl">{t('admin.thId')}</th>
                          <th className="px-4 py-3">{t('admin.thName')}</th>
                          <th className="px-4 py-3">{t('admin.thPrice')}</th>
                          <th className="px-4 py-3 rounded-tr">{t('admin.thActions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">{p.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                            <td className="px-4 py-3">{p.price.toLocaleString()} ₫</td>
                            <td className="px-4 py-3">
                              <button className="text-primary-600 hover:text-primary-800 mr-3">{t('admin.actionEdit')}</button>
                              <button className="text-red-500 hover:text-red-700">{t('admin.actionDelete')}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{t('admin.tabCategories').replace('🏷️ ', '')}</h2>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                      {t('admin.addCategory')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((c) => (
                      <div key={c.id} className="p-4 border border-slate-200 rounded-lg shadow-sm">
                        <h3 className="font-bold text-slate-800">{c.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6">{t('admin.tabUsers').replace('👥 ', '')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-medium">
                        <tr>
                          <th className="px-4 py-3 rounded-tl">{t('admin.thId')}</th>
                          <th className="px-4 py-3">{t('admin.thUsername')}</th>
                          <th className="px-4 py-3">{t('admin.thFullName')}</th>
                          <th className="px-4 py-3 rounded-tr">{t('admin.thRoles')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-xs">{u.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{u.username}</td>
                            <td className="px-4 py-3">{u.fullName}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {(u.roles || []).map((r: string) => (
                                  <span key={r} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
