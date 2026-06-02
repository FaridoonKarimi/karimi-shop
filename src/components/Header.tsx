import React from 'react';
import { ShoppingBag, Bot, Store, Search, Truck, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
}

export default function Header({ currentPage, setCurrentPage, cartCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs" id="nav-header">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-brand-600 to-sky-700 text-white text-xs py-2 px-4 text-center font-medium select-none flex items-center justify-center gap-2">
        <Sparkles size={14} className="animate-pulse" />
        <span>تخفیفات بهاری آغاز شد! کود تخفیف <strong className="bg-white/20 px-1.5 py-0.5 rounded font-mono">KARIMI10</strong> برای دریافت ۱۰٪ تخفیف ویژه!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand area */}
          <div 
            onClick={() => setCurrentPage('home')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag size={22} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-right">
              <span className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight">کریمی <span className="text-sky-600">شاپ</span></span>
              <span className="block text-[10px] sm:text-xs text-slate-400 font-medium">نماد اصالت و نوآوری دیجیتال</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'home' 
                  ? 'bg-sky-50 text-sky-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'shop' || currentPage === 'detail'
                  ? 'bg-sky-50 text-sky-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              فروشگاه محصولات
            </button>
            <button
              onClick={() => setCurrentPage('smart-center')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentPage === 'smart-center'
                  ? 'bg-sky-50 text-sky-600 shadow-xs' 
                  : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/50'
              }`}
            >
              <Bot size={16} />
              <span>دستیار هوشمند AI & رهگیری</span>
            </button>
          </nav>

          {/* Left Icons (Cart, FAQ bot trigger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Shortcut Button */}
            <button
              onClick={() => setCurrentPage('smart-center')}
              className="p-2 sm:px-3 sm:py-2 bg-slate-50 text-slate-700 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all border border-slate-100 flex items-center gap-1.5 text-xs font-semibold"
              title="دستیار هوشمند و مشاوره"
            >
              <Bot size={16} className="text-sky-500 animate-bounce" />
              <span className="hidden sm:inline">مشاوره هوشمند</span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setCurrentPage('cart')}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                currentPage === 'cart'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100'
                  : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
              }`}
              id="cart-trigger"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-scale">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Sub header for Mobile Navigation Bar */}
      <div className="md:hidden flex border-t border-slate-100 bg-slate-50/80">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex-1 py-3 text-center text-xs font-semibold transition-all ${
            currentPage === 'home' ? 'text-sky-600 border-b-2 border-sky-600 bg-white' : 'text-slate-600'
          }`}
        >
          صفحه اصلی
        </button>
        <button
          onClick={() => setCurrentPage('shop')}
          className={`flex-1 py-3 text-center text-xs font-semibold transition-all ${
            currentPage === 'shop' || currentPage === 'detail' ? 'text-sky-600 border-b-2 border-sky-600 bg-white' : 'text-slate-600'
          }`}
        >
          محصولات
        </button>
        <button
          onClick={() => setCurrentPage('smart-center')}
          className={`flex-1 py-3 text-center text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            currentPage === 'smart-center' ? 'text-sky-600 border-b-2 border-sky-600 bg-white' : 'text-slate-700'
          }`}
        >
          <Bot size={14} />
          <span>دستیار AI & رهگیری</span>
        </button>
      </div>
    </header>
  );
}
