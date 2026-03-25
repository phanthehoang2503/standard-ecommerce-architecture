import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProductDetail() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [userReview, setUserReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch product details first
      const prodRes = await api.get(`/products/${id}`);
      const prodData = prodRes.data?.result || prodRes.data;
      setProduct(prodData);
      
      // Attempt to fetch reviews separately
      try {
        const reviewsRes = await api.get(`/products/${id}/reviews?page=0&size=5`);
        const reviewsData = reviewsRes.data?.result || reviewsRes.data;
        setReviews(reviewsData.content || []);
        setHasMoreReviews(!reviewsData.last);

        const currentUsername = localStorage.getItem('username');
        if (currentUsername && reviewsData.content) {
          const existing = reviewsData.content.find((r: any) => r.username === currentUsername);
          if (existing) setUserReview(existing);
        }
      } catch (reviewError) {
        console.error('Failed to fetch reviews (Backend Sort bug?)', reviewError);
        // We still have the product, so we don't block the UI
      }
    } catch (error: any) {
      console.error('Failed to fetch product details', error);
      if (error.response?.status === 401) {
        setProduct({ error: 'unauthorized' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreReviews = async () => {
    if (reviewsLoading || !hasMoreReviews) return;
    setReviewsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const res = await api.get(`/products/${id}/reviews?page=${nextPage}&size=5`);
      const data = res.data?.result || res.data;
      setReviews(prev => [...prev, ...(data.content || [])]);
      setHasMoreReviews(!data.last);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more reviews', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, reviewForm);
      const newReview = res.data?.result || res.data;
      setReviews(prev => [newReview, ...prev]);
      setUserReview(newReview);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const addToCart = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await api.post('/cart/add', { productId: Number(id), quantity });
      alert(t('prod.addedSuccess'));
    } catch (error) {
      console.error('Failed to add to cart', error);
      alert(t('prod.addedMock'));
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 aspect-square bg-slate-100 rounded-3xl"></div>
          <div className="lg:w-1/2 space-y-6">
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-1/4 bg-slate-200 rounded-lg"></div>
            <div className="h-32 w-full bg-slate-100 rounded-2xl"></div>
            <div className="h-12 w-48 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || product.error === 'unauthorized') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">{product?.error === 'unauthorized' ? '🔐' : '🔍'}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {product?.error === 'unauthorized' ? 'Login Required' : 'Product Not Found'}
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          {product?.error === 'unauthorized' 
            ? 'Detailed product information and reviews are only available for our members. Please sign in to continue.'
            : "The product you are looking for doesn't exist or has been removed."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/shop')} className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl font-bold transition-all hover:bg-slate-50">
            Back to Shop
          </button>
          {product?.error === 'unauthorized' && (
            <button onClick={() => navigate('/login')} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-primary-700 shadow-lg shadow-primary-100">
              Sign In Now
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-primary-600 transition-colors">Shop</button>
        <span>/</span>
        <button 
          onClick={() => {
            const catId = product.category?.id;
            const catName = product.categoryName || product.category?.name;
            if (catId) navigate(`/shop?category=${catId}`);
            else if (catName) navigate(`/shop?keyword=${encodeURIComponent(catName)}`);
            else navigate('/shop');
          }} 
          className="hover:text-primary-600 transition-colors"
        >
          {product.categoryName || product.category?.name || 'Category'}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
        {/* Gallery Section */}
        <div className="lg:w-1/2 group">
          <div className="aspect-square bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-12 sticky top-24 transition-all duration-500 hover:shadow-xl hover:shadow-primary-50/50">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <span className="text-9xl grayscale opacity-20 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">📦</span>
            )}
            
            <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Free Shipping</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="flex items-center gap-3 mb-4">
            <span 
              onClick={() => {
                const catId = product.category?.id;
                if (catId) navigate(`/shop?category=${catId}`);
              }}
              className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary-100 cursor-pointer hover:bg-primary-100 transition-colors"
            >
              {product.categoryName || product.category?.name || 'Store'}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              {'★'.repeat(Math.round(product.averageRating || 5))}
              <span className="text-slate-400 text-xs font-bold ml-1">({product.reviewCount || reviews.length} reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.1]">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-black text-primary-600 tracking-tight">
              {product.price.toLocaleString()} ₫
            </span>
            {product.price > 100000 && (
              <span className="text-slate-400 text-lg line-through font-medium">
                {(product.price * 1.2).toLocaleString()} ₫
              </span>
            )}
          </div>

          <p className="text-slate-500 leading-relaxed mb-10 text-lg">
            {product.description || 'Elevate your experience with our premium selection.'}
          </p>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-slate-50 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-slate-50 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={addToCart}
                disabled={addingToCart}
                className="flex-[2] bg-slate-900 text-white h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button 
                className="flex-1 bg-white text-slate-900 border-2 border-slate-900 h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-16">
        <div className="flex gap-12 mb-12 overflow-x-auto pb-4 hide-scrollbar">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specifications', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${reviews.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-black uppercase tracking-widest transition-all pb-4 border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'description' && (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Product Story</h3>
              <p className="text-slate-500 leading-relaxed text-lg mb-8">
                {product.description || 'Every detail has been carefully considered to provide you with a premium experience.'}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Technical details</h3>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Technical details</h3>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {[
                  { label: 'Category', value: product.categoryName || product.category?.name || 'N/A' },
                  { label: 'Stock Available', value: `${product.stockQuantity ?? product.stock ?? product.inventory?.quantity ?? 0} Units` },
                  { label: 'Product ID', value: `#${product.id}` }
                ].map((spec, i) => (
                  <div key={i} className="py-5 flex items-center justify-between group">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors">{spec.value}</span>
                  </div>
                ))}

                {/* Placeholder for future dynamic map-based specifications */}
                {product.specifications && Object.entries(product.specifications).map(([key, value]: [string, any], i) => (
                  <div key={`dyn-${i}`} className="py-5 flex items-center justify-between group">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{key}</span>
                    <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors">{String(value)}</span>
                  </div>
                ))}

                {(!product.specifications || Object.keys(product.specifications).length === 0) && (
                  <div className="py-12 text-center opacity-30">
                    <p className="text-xs font-bold uppercase tracking-[0.3em]">Detailed specifications coming soon</p>
                  </div>
                )}
              </div>
            </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-2/3 space-y-12">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Community Feedback</h3>
                  
                  {reviews.length === 0 ? (
                    <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                      <div className="text-5xl mb-4 opacity-20">💬</div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No reviews yet for this product.</p>
                      <p className="text-slate-400 text-sm mt-2">Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-8">
                        {reviews.map((review, i) => (
                          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                                {review.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-black text-slate-900">@{review.username}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex text-amber-400 text-xs">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm italic font-medium">"{review.comment}"</p>
                          </div>
                        ))}
                      </div>
                      
                      {hasMoreReviews && (
                        <div className="text-center pt-8">
                          <button 
                            onClick={fetchMoreReviews}
                            disabled={reviewsLoading}
                            className="bg-white border border-slate-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                          >
                            {reviewsLoading ? 'Loading...' : 'Load older reviews'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="lg:w-1/3">
                  <div className="sticky top-24 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
                    {userReview ? (
                      <div className="text-center py-6">
                        <h4 className="text-xl font-black mb-4">Thanks for sharing!</h4>
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm text-left">
                          <div className="flex text-amber-400 text-xs mb-3">{'★'.repeat(userReview.rating)}</div>
                          <p className="text-xs text-white/80 italic leading-relaxed">"{userReview.comment}"</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-xl font-black mb-2">Write a Review</h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-6 mt-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                                  className={`w-10 h-10 rounded-xl font-black transition-all ${
                                    reviewForm.rating >= num ? 'bg-amber-400 text-slate-900 scale-110 shadow-lg shadow-amber-400/20' : 'bg-white/10 text-white hover:bg-white/20'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <textarea
                              required
                              placeholder="Tell us what you liked..."
                              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-white/30 transition-all text-sm h-32 resize-none placeholder:text-white/20"
                              value={reviewForm.comment}
                              onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center p-0"
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
