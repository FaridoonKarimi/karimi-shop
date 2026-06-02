import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, Star, ShoppingCart, FilterX } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../productsData';

interface ShopViewProps {
  setSelectedProductId: (id: number) => void;
  setCurrentPage: (page: string) => void;
  addToCart: (product: Product) => void;
}

export default function ShopView({ setSelectedProductId, setCurrentPage, addToCart }: ShopViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Listen to the custom event from landing page category quick clicks
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const categoryId = (e as CustomEvent).detail;
      if (categoryId) {
        setSelectedCategory(categoryId);
        // Scroll to component top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('setShopCategory', handleSetCategory);
    return () => {
      window.removeEventListener('setShopCategory', handleSetCategory);
    };
  }, []);

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = !showInStockOnly || product.inStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return 0; // default
  });

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'electronics', label: 'لوازم الکترونیک' },
    { id: 'fashion', label: 'پوشاک و مد' },
    { id: 'watches', label: 'ساعت‌های لوکس' },
    { id: 'living', label: 'وسایل زندگی' }
  ];

  return (
    <div className="py-6 space-y-8" id="shop-view">
      
      {/* Search and Title Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 text-right">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pr-1">ویترین محصولات کریمی شاپ</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">آسان، مطمئن و با گارانتی معتبر خرید نمائید.</p>
        </div>
        
        {/* Search Field */}
        <div className="relative w-full md:w-80 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="جستجوی نام محصول، برند..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100/50 transition-all text-right"
          />
          <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6 text-right self-start">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal size={16} className="text-sky-500" />
              <span>فیلترهای پیشرفته</span>
            </h3>
            {(selectedCategory !== 'all' || searchQuery !== '' || maxPrice < 500000 || showInStockOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMaxPrice(500000);
                  setShowInStockOnly(false);
                }}
                className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <FilterX size={12} />
                <span>پاکسازی</span>
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">کتگوری محصولات</h4>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-sky-50 text-sky-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-50">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">رنج قیمت (افغانی)</h4>
            <input
              type="range"
              min="1000"
              max="500000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-sky-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between font-mono text-xs text-slate-500 mt-1">
              <span>تا {maxPrice.toLocaleString('fa-IR')} افغانی</span>
              <span>1,000 افغانی</span>
            </div>
          </div>

          {/* Stock Toggle Filter */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 cursor-pointer select-none">
            <label htmlFor="stock" className="text-xs font-bold text-slate-600 cursor-pointer">فقط کالاهای موجود در انبار</label>
            <input
              type="checkbox"
              id="stock"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className="w-4 h-4 text-sky-600 border-slate-200 rounded-md focus:ring-sky-500 focus:outline-none cursor-pointer"
            />
          </div>
        </aside>

        {/* PRODUCTS GRID AREA */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Sorting and Results count header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 text-right">
            <div>
              یافت شده: <span className="text-slate-900 font-bold">{sortedProducts.length} محصول</span> از کاتالوگ کریمی شاپ
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span>مرتب‌سازی بر اساس:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-sky-500"
              >
                <option value="default">پیش‌فرض (برترین‌ها)</option>
                <option value="price-asc">ارزان‌ترین ابتدا</option>
                <option value="price-desc">گران‌ترین ابتدا</option>
                <option value="rating">بالاترین امتیاز مشتریان</option>
                <option value="reviews">بیشترین تعداد نظرات</option>
              </select>
            </div>
          </div>

          {/* Actual grid list */}
          {sortedProducts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-16 text-center border border-dashed border-slate-200">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-slate-800 font-black text-base mt-4">هیچ محصولی یافت نشد!</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">لطفاً کلیدواژه‌های جستجوی خود را تغییر دهید یا دکمه پاکسازی فیلترها را کلیک نمائید.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMaxPrice(500000);
                  setShowInStockOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ریست کردن همه‌ی فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Photo container */}
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    className="relative aspect-square overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-slate-800 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md">ناموجود در انبار</span>
                      </div>
                    )}
                    {product.oldPrice && product.inStock && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-800 shadow-sm border border-slate-100">
                      {product.categoryFa}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-4 sm:p-5 text-right flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="text-[9px] truncate max-w-36">{product.englishName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <span className="font-bold">{product.rating}</span>
                          <Star size={11} fill="currentColor" />
                        </div>
                      </div>

                      <h3
                        onClick={() => handleProductClick(product.id)}
                        className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 hover:text-sky-600 cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex flex-col text-right">
                        <span className="text-amber-600 text-base font-extrabold font-mono">
                          {product.price.toLocaleString('fa-IR')} <span className="text-[10px] font-sans font-bold">افغانی</span>
                        </span>
                        {product.oldPrice && (
                          <span className="text-slate-400 text-[10px] line-through font-mono">
                            {product.oldPrice.toLocaleString('fa-IR')} افغانی
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                          product.inStock
                            ? 'bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                        title={product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
