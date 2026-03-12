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
      navigate(`/?keyword=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
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
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold text-primary-700 tracking-tight flex items-center gap-2">
            E-Shop
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-auto">
            <input
              type="text"
              placeholder={t('nav.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-l px-3 py-1 text-sm focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 text-sm font-medium rounded-r transition-colors"
            >
              {t('nav.searchBtn')}
            </button>
          </form>

          <div className="flex gap-5 items-center">
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors uppercase"
            >
              {language === 'vi' ? 'EN' : 'VI'}
            </button>
            
            <div 
              className="relative group py-4"
              onMouseEnter={handleCartHover}
            >
              <Link to="/cart" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                {t('nav.cart')}
              </Link>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-[-8px] w-80 bg-white border border-slate-200 shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 cursor-default">
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
                  <h4 className="font-bold text-slate-800 border-b pb-2 mb-3">{t('minicart.recentItems')}</h4>
                  {loadingCart ? (
                    <div className="text-center text-sm text-slate-500 py-4">{t('cart.loading')}</div>
                  ) : cartItems.length === 0 ? (
                    <div className="text-center text-sm text-slate-500 py-4">{t('minicart.empty')}</div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {cartItems.slice(0, 3).map(item => {
                        const productPrice = item.product?.price || item.price || 0;
                        const productName = item.product?.name || item.productName || item.name || 'Product';
                        return (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="truncate pr-4 text-slate-700">{productName} (x{item.quantity})</span>
                            <span className="font-semibold text-slate-900">{(productPrice * item.quantity).toLocaleString()} ₫</span>
                          </div>
                        );
                      })}
                      {cartItems.length > 3 && (
                        <div className="text-center text-xs text-slate-500 pt-2">
                          + {cartItems.length - 3} {t('minicart.moreItems')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 rounded transition-colors shadow-sm"
                  >
                    {t('minicart.viewFull')}
                  </button>
                </div>
              </div>
            </div>

            {token ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 transition-colors shadow-sm">
                {t('nav.login')}
              </Link>
            )}
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
