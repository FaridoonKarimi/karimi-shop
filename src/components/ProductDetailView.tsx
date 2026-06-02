import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Send, Check } from 'lucide-react';
import { Product, ReviewFa } from '../types';
import { PRODUCTS } from '../productsData';

interface ProductDetailViewProps {
  productId: number;
  setSelectedProductId: (id: number) => void;
  addToCart: (product: Product, quantity: number) => void;
  setCurrentPage: (page: string) => void;
}

export default function ProductDetailView({ productId, setSelectedProductId, addToCart, setCurrentPage }: ProductDetailViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ReviewFa[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  // Custom states for simulated new review adding
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Find the product
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1); // reset quantity on load
      
      // Load reviews from backend dynamically to prove full-stack capabilities
      setLoadingReviews(true);
      fetch(`/api/reviews/${foundProduct.id}`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setReviews(res.data);
          }
          setLoadingReviews(false);
        })
        .catch(err => {
          console.error("Error loading reviews:", err);
          setLoadingReviews(false);
        });
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p>در حال بارگذاری جزئیات محصول...</p>
      </div>
    );
  }

  // Find related products
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    // Simulate review adding (full-stack demo)
    const newRev: ReviewFa = {
      id: Date.now(),
      userName: newName,
      rating: newRating,
      comment: newComment,
      date: "همین اکنون"
    };

    setReviews([newRev, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="py-6 space-y-12" id="product-detail">
      
      {/* Back button shortcut */}
      <div className="text-right">
        <button
          onClick={() => setCurrentPage('shop')}
          className="text-sky-600 hover:text-sky-700 text-xs sm:text-sm font-bold flex items-center justify-start gap-1 cursor-pointer"
        >
          <span>&rarr; بازگشت به فروشگاه محصولات</span>
        </button>
      </div>

      {/* Main product structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-right">
        
        {/* RIGHT COLUMN: Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-xs p-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Trust badges immediately beneath photo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-sky-505" />
              <span className="text-[10px] font-bold text-slate-700">۱۰۰٪ اصل و اورجینال</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center flex flex-col items-center gap-1">
              <Truck size={16} className="text-sky-505" />
              <span className="text-[10px] font-bold text-slate-700">ارسال ایمن ولایاتی</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center flex flex-col items-center gap-1">
              <RefreshCw size={16} className="text-sky-505" />
              <span className="text-[10px] font-bold text-slate-700">ضمانت بازگشت وجه</span>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Buying Options and details */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Title block */}
          <div className="space-y-3">
            <span className="inline-block bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-bold px-3 py-1 rounded-full cursor-pointer">
              {product.categoryFa}
            </span>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>MODEL: {product.englishName}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <span className="font-bold text-slate-800 text-sm mt-0.5">{product.rating}</span>
                <Star size={14} fill="currentColor" />
                <span className="text-slate-400">({reviews.length || product.reviewCount} نظر مشتری)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-1"></div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">توضیحات و نقد اجمالی:</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features bullet list */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">ویژگی‌های شاخص محصول:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 mr-1">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5 justify-start">
                  <span className="text-sky-500 font-bold shrink-0 mt-0.5">&bull;</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 my-1"></div>

          {/* Pricing and checkout operations */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Price values */}
            <div className="flex flex-col text-right">
              <span className="text-slate-400 text-xs">قیمت مصرف‌کننده:</span>
              <span className="text-amber-600 text-2xl font-black font-mono">
                {product.price.toLocaleString('fa-IR')} <span className="text-sm font-sans font-black">افغانی</span>
              </span>
              {product.oldPrice && (
                <span className="text-slate-400 text-xs line-through font-mono">
                  {product.oldPrice.toLocaleString('fa-IR')} افغانی
                </span>
              )}
            </div>

            {/* Quantity modifier and add button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs shrink-0 select-none">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 text-sm font-black cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-800 font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 text-sm font-black cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                disabled={!product.inStock}
                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  product.inStock
                    ? 'bg-sky-600 text-white hover:bg-sky-500 shadow-md shadow-sky-600/10'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{product.inStock ? 'افزودن به سبد خرید' : 'اتمام موجودی'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* TECHNICAL SPECIFICATIONS */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 text-right space-y-4">
        <h3 className="text-lg font-black text-slate-900 border-r-4 border-sky-500 pr-2">جدول مشخصات تخنیکی</h3>
        
        <div className="overflow-hidden border border-slate-100 rounded-2xl">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="px-4 py-3.5 border-b border-slate-100">ویژگی فنی</th>
                <th className="px-4 py-3.5 border-b border-slate-100">مقدار مشخصه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(product.specs).map(([key, val]) => (
                <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800 bg-slate-50/30">{key}</td>
                  <td className="px-4 py-3 font-medium">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* REVIEWS DISCUSSIONS SECTION (Simulated Full-Stack persistence) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Review submission form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-right space-y-4 self-start">
          <h4 className="font-bold text-slate-900 text-base">ثبت نظر جدید محصول</h4>
          <p className="text-slate-400 text-xs">تجربه خرید و کاربری خود با این کالا را با دیگر مشتریان ما به اشتراک بگذارید.</p>
          
          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-605">نام کامل تان:</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="مثال: فریدون کرمی"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-605">امتیاز دهی عددی (از ۵):</label>
              <select
                value={newRating}
                onChange={e => setNewRating(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-505"
              >
                <option value={5}>۵ ستاره - عالی است</option>
                <option value={4}>۴ ستاره - خیلی خوب است</option>
                <option value={3}>۳ ستاره - معمولی است</option>
                <option value={2}>۲ ستاره - ضعیف است</option>
                <option value={1}>۱ ستاره - افتضاح</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-605">متن نظر شما:</label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="دیدگاه ارزشمند خود را در اینجا تایپ فرمائید..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 text-right"
              />
            </div>

            {reviewSuccess && (
              <div className="bg-emerald-50 text-emerald-600 text-xs p-2 rounded-xl border border-emerald-100 flex items-center justify-center gap-1 font-medium animate-pulse">
                <Check size={14} />
                <span>دیدگاه شما با موفقیت ثبت شد!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send size={12} />
              <span>ارسال و انتشار دیدگاه</span>
            </button>
          </form>
        </div>

        {/* Right: Reviews lists loaded from API */}
        <div className="md:col-span-2 space-y-4 text-right">
          <h3 className="text-lg font-black text-slate-900 border-r-4 border-sky-500 pr-2 pb-1">نظرات خریداران این محصول</h3>
          
          {loadingReviews ? (
            <div className="p-8 text-center text-slate-400">
              <span>در حال فراخوانی دیدگاه‌ها از پایگاه داده مکرر...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-50 text-slate-400 text-xs p-8 rounded-2xl text-center border">
              <span>تاکنون نظری برای این کالا ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{rev.userName}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 font-mono text-xs font-bold">
                      <span>{rev.rating}</span>
                      <Star size={11} fill="currentColor" />
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    «{rev.comment}»
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 text-right">
          <h3 className="text-lg font-black text-slate-900 border-r-4 border-amber-500 pr-2">محصولات مشابه و مرتبط</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => setSelectedProductId(rel.id)}
                className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-50">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{rel.name}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-amber-600 font-extrabold text-xs sm:text-sm font-mono">
                      {rel.price.toLocaleString('fa-IR')} افغانی
                    </span>
                    <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded-md">{rel.categoryFa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
