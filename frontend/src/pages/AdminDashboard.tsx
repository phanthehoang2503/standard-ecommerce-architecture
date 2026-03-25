import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmStyle?: 'danger' | 'primary';
}

function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmStyle = 'primary' }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200 p-8 text-center">
        <div className={`w-16 h-16 ${confirmStyle === 'danger' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-600'} rounded-full flex items-center justify-center mx-auto mb-6 text-2xl`}>
          {confirmStyle === 'danger' ? '⚠️' : '❓'}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
              confirmStyle === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-100'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', categoryId: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', dob: '', role: 'USER' });

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
        const res = await api.get('/products?size=50');
        setProducts(res.data?.result?.content || res.data?.content || []);
        // Also fetch categories for the product form
        const catRes = await api.get('/categories');
        setCategories(catRes.data?.result || catRes.data || []);
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', newCategory);
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '' });
      fetchData('categories');
    } catch (err) {
      alert('Failed to add category');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the new /users/admin endpoint for staff creation
      const endpoint = newUser.role === 'USER' ? '/users' : '/users/admin';
      await api.post(endpoint, {
        ...newUser,
        roles: [newUser.role]
      });
      setShowUserModal(false);
      setNewUser({ username: '', password: '', fullName: '', dob: '', role: 'USER' });
      fetchData('users');
    } catch (err) {
      alert('Failed to create account');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      console.log('Attempting to delete product:', id);
      const res = await api.delete(`/products/${id}`);
      console.log('Delete response:', res.status);
      setProductToDelete(null);
      fetchData('products');
    } catch (err: any) {
      console.error('Failed to delete product:', err.response || err);
      // We'll keep error alerts as fallback or could use a toast
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditProductRequest = (p: any) => {
    setEditingProduct(p);
    setNewProduct({
      name: p.name,
      price: p.price.toString(),
      stock: (p.stockQuantity ?? p.stock ?? p.inventory?.quantity ?? 0).toString(),
      categoryId: p.categoryId?.toString() || p.category?.id?.toString() || '',
      description: p.description || ''
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category: { id: Number(newProduct.categoryId) }
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', stock: '', categoryId: '', description: '' });
      fetchData('products');
    } catch (err) {
      alert(`Failed to ${editingProduct ? 'update' : 'add'} product`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">{t('admin.title')}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-2 sticky top-20">
            {[
              { id: 'products', name: t('admin.tabProducts') },
              { id: 'categories', name: t('admin.tabCategories') },
              { id: 'users', name: t('admin.tabUsers') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 -translate-x-1'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              <span className="text-slate-400 font-medium">{t('admin.loading')}</span>
            </div>
          ) : (
            <>
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manage Inventory</h2>
                    <button 
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ name: '', price: '', stock: '', categoryId: '', description: '' });
                        setShowProductModal(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-100 flex items-center gap-2"
                    >
                      <span className="text-lg">+</span> {t('admin.addProduct')}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl">{t('admin.thId')}</th>
                          <th className="px-6 py-4">{t('admin.thName')}</th>
                          <th className="px-6 py-4">{t('admin.thPrice')}</th>
                          <th className="px-6 py-4 text-right rounded-tr-xl">{t('admin.thActions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">#{p.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                            <td className="px-6 py-4 text-primary-600 font-black">{p.price.toLocaleString()} ₫</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleEditProductRequest(p)}
                                className="text-primary-600 hover:text-primary-800 font-bold mr-4 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => setProductToDelete(p.id)} 
                                className="text-red-500 hover:text-red-700 font-bold transition-colors"
                              >
                                Delete
                              </button>
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
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Taxonomy</h2>
                    <button 
                      onClick={() => setShowCategoryModal(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-100 flex items-center gap-2"
                    >
                      <span className="text-lg">+</span> {t('admin.addCategory')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((c) => (
                      <div key={c.id} className="p-6 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 flex items-center justify-center rounded-lg mb-4 text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                          {c.name.charAt(0)}
                        </div>
                        <h3 className="font-black text-slate-800 mb-2">{c.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">{c.description || 'No description provided.'}</p>
                        <div className="flex justify-end gap-4 border-t border-slate-50 pt-4">
                           <button className="text-xs font-bold text-primary-600 hover:underline transition-colors font-sans">Edit</button>
                           <button className="text-xs font-bold text-red-500 hover:underline transition-colors font-sans">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Staff & Users</h2>
                    <button 
                      onClick={() => setShowUserModal(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-100 flex items-center gap-2"
                    >
                      <span className="text-lg">+</span> Create Staff account
                    </button>
                  </div>
                  <div className="overflow-x-auto text-slate-600">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl">{t('admin.thUsername')}</th>
                          <th className="px-6 py-4">{t('admin.thFullName')}</th>
                          <th className="px-6 py-4 rounded-tr-xl">{t('admin.thRoles')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">@{u.username}</td>
                            <td className="px-6 py-4">{u.fullName}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {(u.roles || []).map((r: string) => (
                                  <span key={r} className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    r === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                    r === 'STAFF' ? 'bg-primary-50 text-primary-600 border border-primary-100' : 
                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}>
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

      {/* Modals */}
      {showProductModal && (
        <Modal 
          title={editingProduct ? "Edit Product" : "Add New Product"} 
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        >
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name</label>
              <input 
                required
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₫)</label>
                  <input 
                    required type="number"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock</label>
                  <input 
                    required type="number"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                  />
               </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <select 
                required
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400 bg-white" 
                value={newProduct.categoryId}
                onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea 
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400 h-24" 
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              {editingProduct ? 'Update Product' : 'Publish Product'}
            </button>
          </form>
        </Modal>
      )}

      {productToDelete && (
        <ConfirmModal 
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete Now"
          confirmStyle="danger"
          onConfirm={() => deleteProduct(productToDelete)}
          onCancel={() => setProductToDelete(null)}
        />
      )}

      {showCategoryModal && (
        <Modal title="Create Category" onClose={() => setShowCategoryModal(false)}>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
              <input 
                required
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                value={newCategory.name}
                onChange={e => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea 
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400 h-24" 
                value={newCategory.description}
                onChange={e => setNewCategory({...newCategory, description: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              Create Category
            </button>
          </form>
        </Modal>
      )}

      {showUserModal && (
        <Modal title="Add Staff Member" onClose={() => setShowUserModal(false)}>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <input 
                required
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400 font-mono" 
                placeholder="staff_name"
                value={newUser.username}
                onChange={e => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <input 
                required type="password"
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                value={newUser.password}
                onChange={e => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input 
                required
                className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-primary-400" 
                value={newUser.fullName}
                onChange={e => setNewUser({...newUser, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <div className="flex gap-4">
                {['USER', 'STAFF', 'ADMIN'].map(role => (
                  <label key={role} className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer has-[:checked]:bg-primary-50 has-[:checked]:border-primary-400 transition-colors">
                    <input 
                      type="radio" 
                      name="role" 
                      value={role} 
                      checked={newUser.role === role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="hidden"
                    />
                    <span className="text-[10px] font-black">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              Create Account
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
