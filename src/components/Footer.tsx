import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800" id="footer">
      
      {/* Advantage Badges */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 text-right">
              <div className="p-3 bg-slate-700 rounded-2xl text-sky-400">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">ارسال رایگان و سریع</h4>
                <p className="text-slate-400 text-xs mt-1">ارسال فوری در کابل و تحویل ۴۸ ساعته در سایر ولایات</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-right">
              <div className="p-3 bg-slate-700 rounded-2xl text-sky-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">تضمین اصالت کالا</h4>
                <p className="text-slate-400 text-xs mt-1">تضمین صددرصدی بازگشت کل هزینه‌ها در صورت عدم اصالت</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="p-3 bg-slate-700 rounded-2xl text-sky-400">
                <RotateCcw size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">۷ روز ضمانت بازگشت</h4>
                <p className="text-slate-400 text-xs mt-1">مرجوع کردن و تعویض آسان بدون هیچ قید و شرطی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="p-3 bg-slate-700 rounded-2xl text-sky-400">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">پشتیبانی ۲۴ ساعته</h4>
                <p className="text-slate-400 text-xs mt-1">ملاءمت و همیاری متعهدانه در هفت روز هفته با شما</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="text-right flex flex-col gap-4">
            <h3 className="text-xl sm:text-2xl font-black text-white">کریمی <span className="text-sky-400">شاپ</span></h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              کریمی شاپ یکی از پیشگامان تجاری در حوزه فناوری دیجیتال، لباس و آراستنی‌های شیک و تزئینات اداری و خانگی در افغانستان است. تلاش بی وقفه ما ارایه محصولات لوکس جهانی با قیمتی مناسب و عادلانه است.
            </p>
            <div className="mt-2 text-[11px] text-slate-500 font-medium">
              * این پلتفرم نمونه کار جامع تمام عیار (Full-Stack Showcase) ساخته شده با React، Express و هوش مصنوعی پیشرفته Gemini است.
            </div>
          </div>

          {/* Column 2: Fast access */}
          <div className="text-right">
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-sky-500 pr-2">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="text-slate-400 hover:text-white transition-colors duration-200">
                  صفحه اصلی سایت
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="text-slate-400 hover:text-white transition-colors duration-200">
                  همه محصولات فروشگاه
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('smart-center')} className="text-slate-400 hover:text-white transition-colors duration-200">
                  دستیار هوش مصنوعی و پیگیری کالاها
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('cart')} className="text-slate-400 hover:text-white transition-colors duration-200">
                  مشاهده سبد خرید مشتری
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div className="text-right flex flex-col gap-4">
            <h4 className="text-white font-bold text-base border-r-4 border-sky-500 pr-2">دفتر مرکزی کریمی شاپ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 justify-start">
                <MapPin size={18} className="text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs sm:text-sm">کابل، شهرنو، کابل سنتر، طبقه سوم، فروشگاه ۱۰۲</span>
              </div>
              <div className="flex items-center gap-3 justify-start">
                <Phone size={18} className="text-sky-400 shrink-0" />
                <span className="text-slate-400 text-xs sm:text-sm dir-ltr text-right font-mono">+93 (0) 799 456 789</span>
              </div>
              <div className="flex items-center gap-3 justify-start">
                <Mail size={18} className="text-sky-400 shrink-0" />
                <span className="text-slate-400 text-xs sm:text-sm font-mono">faridoonkarimi2018@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80 my-8"></div>

        {/* Copy or design labels */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center">
          <div>
            &copy; {new Date().getFullYear()} کریمی شاپ. تمامی حقوق مادی و معنوی این اثر محفوظ است.
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Powered by</span>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">Express + Node + React 19</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
