import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface ProductCarouselProps {
  title: string;
  categoryName: string;
  categoryId?: number;
}

function ProductCarousel({ title, categoryName, categoryId }: ProductCarouselProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (categoryId) params.append('category', String(categoryId));
        params.append('size', '10');
        
        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data?.result?.content || res.data?.content || []);
      } catch (error) {
        console.error(`Failed to fetch ${categoryName} products`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, categoryName]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">
            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></span>
            {t('home.ourProducts')}
          </div>
        </div>
        <Link 
          to={categoryId ? `/shop?category=${categoryId}` : '/shop'} 
          className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 transition-colors text-xs uppercase tracking-widest group/link"
        >
          {t('home.viewAll')} <span className="text-xl group-hover/link:translate-x-1 transition-transform">›</span>
        </Link>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 px-2 scrollbar-hide snap-x"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-64 snap-start bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center border-b border-slate-100 relative group/img overflow-hidden">
                <span className="text-slate-300 text-6xl group-hover/img:scale-125 transition-transform duration-700">📦</span>
                <div className="absolute inset-0 bg-primary-900/0 group-hover/img:bg-primary-900/10 transition-colors duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 min-h-[3rem]" title={product.name}>
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-black text-slate-900">{product.price.toLocaleString()} ₫</span>
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    +
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex"
        >
          ←
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data?.result || res.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section - Restored Old Style but Polished */}
      <section className="bg-primary-50 rounded-[2rem] p-16 text-center border border-primary-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary-100/50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-widest mb-2 border border-primary-200">
            Next-Gen Electronics
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary-900 tracking-tight leading-tight">
            {t('home.welcome')}
          </h1>
          <p className="text-lg md:text-xl text-primary-700 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            {t('home.subtitle')}
          </p>
          <div className="pt-8">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 text-white font-black text-lg rounded-2xl hover:bg-primary-700 hover:scale-105 transition-all shadow-xl shadow-primary-200 active:scale-95"
            >
              Shop Now <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Category Sections */}
      <div className="space-y-16">
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <ProductCarousel 
            title={t('home.trending')} 
            categoryName="All" 
          />
        </section>

        {/* Categories from DB */}
        {categories.map((cat, index) => (
          <section key={cat.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <ProductCarousel 
              title={index % 2 === 0 ? cat.name : `${cat.name} ${t('home.newArrivals')}`} 
              categoryId={cat.id}
              categoryName={cat.name}
            />
          </section>
        ))}
        
        {/* Placeholder if categories aren't loaded or specific ones desired */}
        {categories.length === 0 && (
          <>
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <ProductCarousel title={t('home.topSaleLaptops')} categoryName="Laptop" />
            </section>
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <ProductCarousel title={t('home.topSaleHeadphones')} categoryName="Headphone" />
            </section>
          </>
        )}
      </div>

      {/* Final CTA */}
      <section className="bg-slate-900 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.2),transparent)]"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white">Ready to upgrade your tech?</h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">Join thousands of happy customers and experience next-gen electronics shopping.</p>
          <div className="pt-6">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-4 px-12 py-5 bg-primary-600 text-white font-black text-xl rounded-2xl hover:bg-primary-500 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary-900/40"
            >
              Start Shopping <span className="text-3xl">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
