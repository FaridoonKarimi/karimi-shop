import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Percent, Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../productsData';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: number) => void;
  addToCart: (product: Product) => void;
}

export default function HomeView({ setCurrentPage, setSelectedProductId, addToCart }: HomeViewProps) {
  const featuredProducts = PRODUCTS.filter(p => p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  return (
    <div className="space-y-16 py-6" id="home-view">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600')]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-900/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 md:px-12 flex flex-col items-start text-right max-w-3xl gap-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-semibold rounded-full select-none">
            <Sparkles size={14} />
            تکنالوژی جدید، لباس شیک، زندگی مرفه
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black leading-tight sm:leading-none text-white tracking-tight">
            دنیایی از محصولات لوکس و اورجینال در <span className="text-sky-400 block sm:inline">کریمی شاپ</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            با کیفیت‌ترین گجت‌های الکترونیکی جهان، ساعت‌های نفیس سویسی، البسه با دوخت مدرن کلاسیک و تصفیه‌کننده‌های هوشمند را با گارانتی واقعی و ارسال فوق سریع به خانه‌تان بیاورید.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>مشاهده و خرید محصولات</span>
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setCurrentPage('smart-center')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              گفتگو با دستیار خرید AI
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">دسته‌بندی‌های برگزیده ما</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">محصولات خود را هوشمندانه در میان کتگوری‌های لوکس جستجو کنید</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: 'electronics', label: 'لوازم الکترونیک', count: '۶ محصول برتر', bg: 'from-blue-550 to-sky-500', icon: '💻', unsplash: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400' },
            { id: 'fashion', label: 'پوشاک و مد', count: '۴ محصول شیک', bg: 'from-amber-500 to-orange-500', icon: '🧥', unsplash: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400' },
            { id: 'watches', label: 'ساعت‌های لوکس', count: '۴ ساعت گرانبها', bg: 'from-teal-500 to-emerald-500', icon: '⌚', unsplash: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400' },
            { id: 'living', label: 'وسایل خانه و زندگی', count: '۶ محصول کم‌نظیر', bg: 'from-purple-500 to-violet-505', icon: '☕', unsplash: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400' }
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setCurrentPage('shop');
                // We'll pass information to set active filter in shop view
                window.dispatchEvent(new CustomEvent('setShopCategory', { detail: cat.id }));
              }}
              className="relative overflow-hidden rounded-2xl aspect-square sm:aspect-video cursor-pointer group shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <img src={cat.unsplash} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
              
              <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                <span className="text-xl sm:text-2.5xl block">{cat.icon}</span>
                <h3 className="text-white font-bold text-sm sm:text-base mt-1">{cat.label}</h3>
                <span className="text-[10px] sm:text-xs text-sky-300 block font-medium mt-0.5">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROMOTION BANNER */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl text-white p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="text-right flex items-center gap-5 shrink-0">
          <div className="p-4 bg-white/20 rounded-2xl text-white shrink-0 hidden sm:block">
            <Percent size={32} className="animate-spin-slow" />
          </div>
          <div>
            <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">سخاوتمندی بی‌سابقه کریمی شاپ</span>
            <h3 className="text-xl sm:text-2.5xl font-black mt-2">تخفیف ولکم (خوش‌آمدگویی) برای اولین خرید شما!</h3>
            <p className="text-rose-100 text-xs sm:text-sm mt-1">از کود تخفیف <strong className="font-mono bg-white text-rose-600 px-1.5 py-0.5 rounded text-xs select-all">WELCOME</strong> برای کسر فوری ۵۰۰ افغانی در سبد خرید بهره‌مند شوید.</p>
          </div>
        </div>

        <button 
          onClick={() => setCurrentPage('shop')} 
          className="bg-white hover:bg-slate-50 text-rose-600 px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          خرید کالا با تخفیف
        </button>
      </section>

      {/* 4. FEATURED PRODUCTS (20 Products Limit) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-right md:-mr-1">
          <div className="text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 border-r-4 border-sky-500 pr-3">محصولات ویژه و گلچین ما</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">محبوب‌ترین و جدیدترین محصولات ما با تاییدیه اصالت کریمی شاپ</p>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-sky-600 hover:text-sky-700 text-sm font-bold flex items-center gap-1 group whitespace-nowrap cursor-pointer"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {featuredProducts.slice(0, 6).map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Image box */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer group"
                onClick={() => handleProductClick(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                
                {product.oldPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span>-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-800 shadow-xs">
                  {product.categoryFa}
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 text-right flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[10px]">{product.englishName}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="font-bold">{product.rating}</span>
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>

                  <h3 
                    onClick={() => handleProductClick(product.id)}
                    className="text-base font-bold text-slate-900 line-clamp-1 hover:text-sky-600 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>
                  
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-amber-600 text-lg font-black font-mono">
                      {product.price.toLocaleString('fa-IR')} <span className="text-xs font-sans font-bold">افغانی</span>
                    </span>
                    {product.oldPrice && (
                      <span className="text-slate-400 text-xs line-through font-mono">
                        {product.oldPrice.toLocaleString('fa-IR')} افغانی
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="p-2.5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-xs shadow-sky-50"
                    title="افزودن به سبد خرید"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-sky-600 text-xs font-black uppercase tracking-widest">تعهد و صداقت ما</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900">سخن مشتریان کریمی شاپ</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">خشنودی خریداران، بالاترین سرمایه معنوی برای خدمات کریمی شاپ است</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-right">
          {[
            { name: "فرهاد رسولی", role: "برنامه‌نویس ارشد (کابل)", comment: "من مک‌بوک پرو M3 مکس را خریداری کردم. گارانتی اصالت کالا و نحوه ارسال شان واقعاً مرا شگفت زده کرد. بهترین در صنف خودشان هستند.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150" },
            { name: "فرزانه کریمی", role: "دیزاینر داخلی (هرات)", comment: "دستگاه تصفیه هوای شیائومی را سفارش دادم و در سریع‌ترین زمان ممکن در هرات به من تحویل دادند. تماس‌های پشتیبانی شان کمال صمیمت و ادب را دارد.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" },
            { name: "مقدس ناصری", role: "استاد پوهنتون (کابل)", comment: "آیفون ۱۵ پرو خریدم، پشتیبانی و مشاوره هوش مصنوعی سایت شان که مثل یک انسان با حوصله راهنمایی میکرد واقعا کار خارق‌العاده و نویی است. تشکر کریمی شاپ!", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150" }
          ].map((t, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col gap-4">
              <div className="flex items-center gap-3 justify-start">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-sky-100 shadow-inner" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <span className="text-slate-400 text-[10px] font-medium">{t.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                «{t.comment}»
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
