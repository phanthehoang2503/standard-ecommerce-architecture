import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const currentCategoryId = searchParams.get('category');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(keyword, currentCategoryId);
  }, [keyword, currentCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async (kw: string | null, cat: string | null) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (kw) params.append('keyword', kw);
      if (cat) params.append('category', cat);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data?.result?.content || res.data?.content || res.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data?.result || res.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-50 rounded p-8 text-center border border-primary-100">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">{t('home.welcome')}</h1>
        <p className="text-primary-700">{t('home.subtitle')}</p>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            to={keyword ? `/?keyword=${keyword}` : "/"}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${!currentCategoryId
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            {t('home.allCategories')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/?category=${cat.id}${keyword ? `&keyword=${keyword}` : ''}`}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${currentCategoryId === String(cat.id)
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b border-slate-200 pb-2">
          {keyword ? `${t('home.searchResults')} "${keyword}"` : t('home.ourProducts')}
        </h2>

        {products.length === 0 && !loading ? (
          <div className="text-center py-12 bg-slate-50 rounded border border-slate-100">
            <p className="text-slate-500">{t('home.noProducts')}</p>
            <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block text-sm">Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden hover:shadow transition-shadow flex flex-col"
              >
                <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                  <span className="text-slate-300 text-4xl">📦</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-medium text-slate-800 mb-1 line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="text-lg font-bold text-slate-900 mt-1 mb-4">{product.price.toLocaleString()} ₫</div>
                  <div className="mt-auto">
                    <Link
                      to={`/product/${product.id}`}
                      className="block text-center w-full py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded border border-slate-200 transition-colors"
                    >
                      {t('home.viewDetails')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
