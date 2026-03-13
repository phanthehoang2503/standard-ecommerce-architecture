import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Shop() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialKeyword = searchParams.get('keyword');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [keyword, setKeyword] = useState<string>(initialKeyword || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Sync with URL params if they change externally (e.g. from Navbar search)
    setKeyword(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, keyword]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data?.result || res.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('size', '20'); // Bigger size for shop page

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data?.result?.content || res.data?.content || res.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    setSelectedCategory(catId);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-20">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            {t('shop.categories')}
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              {t('home.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(String(cat.id))}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === String(cat.id)
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {keyword ? `${t('home.searchResults')} "${keyword}"` : t('shop.title')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {selectedCategory 
                ? `${categories.find(c => String(c.id) === selectedCategory)?.name || ''}` 
                : t('shop.allProducts')}
            </p>
          </div>
          <div className="text-sm text-slate-600 font-medium">
            {products.length} {t('home.ourProducts').toLowerCase()}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg mb-4">{t('home.noProducts')}</p>
            <button 
              onClick={() => {
                setSearchParams({});
                setKeyword('');
                setSelectedCategory(null);
              }}
              className="text-primary-600 font-semibold hover:underline"
            >
              {t('shop.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center border-b border-slate-100 overflow-hidden relative">
                  <span className="text-slate-300 text-5xl group-hover:scale-110 transition-transform duration-500">📦</span>
                  <div className="absolute top-2 right-2 flex gap-1">
                     <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 uppercase italic">
                       {product.category?.name || 'Item'}
                     </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 transition-colors" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="text-xl font-black text-slate-900">{product.price.toLocaleString()} ₫</div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
