import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [search, setSearch] = useState('');
  const { t, language, toggleLanguage } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const scope = decoded.scope || '';
        setIsAdmin(scope.includes('ADMIN') || scope.includes('STAFF'));
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleCartHover = async () => {
    if (!token) return;
    setLoadingCart(true);
    try {
      const res = await api.get('/cart');
      const items = res.data?.result?.items || res.data?.result || res.data?.items || res.data;
      setCartItems(Array.isArray(items) ? items : []);
    } catch {
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-primary-700 tracking-tighter hover:scale-105 transition-transform">
              E-Shop
            </Link>
            
            <div className="hidden lg:flex gap-6 items-center border-l border-slate-200 pl-8">
              <Link to="/shop" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors uppercase tracking-wider">
                {t('nav.shop')}
              </Link>
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
            <input
              type="text"
              placeholder={t('nav.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-6 pr-12 py-3 text-sm focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-primary-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          
          <div className="flex gap-6 items-center">
            <div className="flex gap-4 items-center pr-6 border-r border-slate-200">
              <div 
                className="relative group py-2"
                onMouseEnter={handleCartHover}
              >
                <Link to="/cart" className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {t('nav.cart')}
                </Link>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 cursor-default scale-95 group-hover:scale-100 origin-top-right overflow-hidden">
                  <div className="p-5" onClick={(e) => e.stopPropagation()}>
                    <h4 className="font-black text-slate-800 border-b border-slate-50 pb-3 mb-4 uppercase text-[10px] tracking-widest">{t('minicart.recentItems')}</h4>
                    {loadingCart ? (
                      <div className="text-center text-sm text-slate-500 py-6">{t('cart.loading')}</div>
                    ) : cartItems.length === 0 ? (
                      <div className="text-center text-sm text-slate-500 py-6">{t('minicart.empty')}</div>
                    ) : (
                      <div className="space-y-4 mb-5">
                        {cartItems.slice(0, 3).map(item => {
                          const productPrice = item.product?.price || item.price || 0;
                          const productName = item.product?.name || item.productName || item.name || 'Product';
                          return (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span className="truncate pr-4 text-slate-700 font-medium">{productName} <span className="text-slate-400 text-xs">x{item.quantity}</span></span>
                              <span className="font-black text-primary-600 whitespace-nowrap">{(productPrice * item.quantity).toLocaleString()} ₫</span>
                            </div>
                          );
                        })}
                        {cartItems.length > 3 && (
                          <div className="text-center text-xs text-slate-400 pt-1 font-bold">
                            + {cartItems.length - 3} {t('minicart.moreItems')}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => navigate('/cart')}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-black py-3 rounded-xl transition-all shadow-lg shadow-primary-100 active:scale-95 uppercase tracking-widest"
                    >
                      {t('minicart.viewFull')}
                    </button>
                  </div>
                </div>
              </div>

              {token ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link to="/admin" className="text-sm font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-tight">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-black bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 hover:scale-105 transition-all shadow-lg shadow-primary-100">
                  {t('nav.login')}
                </Link>
              )}
            </div>

            <button
              onClick={toggleLanguage}
              className="w-10 h-10 flex items-center justify-center text-[10px] font-black bg-slate-100 text-slate-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all uppercase border border-slate-200"
            >
              {language === 'vi' ? 'EN' : 'VI'}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder={t('nav.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:bg-white focus:border-primary-400"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-3 py-1.5 text-sm font-medium rounded-r"
            >
              {t('nav.go')}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
