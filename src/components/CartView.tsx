import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, Ticket, Check, Bot, Printer, ShieldCheck } from 'lucide-react';
import { CartItem, Product, Order } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: number) => void;
}

export default function CartView({ cartItems, setCartItems, setCurrentPage, setSelectedProductId }: CartViewProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Response / Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const updateQuantity = (productId: number, val: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + val);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeCartItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Base pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  let discountAmount = 0;
  if (activeCoupon === 'KARIMI10') {
    discountAmount = Math.round(subtotal * 0.1); // 10%
  } else if (activeCoupon === 'WELCOME') {
    discountAmount = Math.min(500, subtotal); // 500 AFN flat
  }

  const grandTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === 'KARIMI10') {
      setActiveCoupon('KARIMI10');
      setCouponFeedback('کد تخفیف KARIMI10 با موفقیت اعمال شد و ۱۰٪ از هزینه کل کسر گردید!');
    } else if (cleanCode === 'WELCOME') {
      setActiveCoupon('WELCOME');
      setCouponFeedback('کد خوش‌آمدگویی WELCOME با موفقیت اعمال شد و ۵۰۰ افغانی کسر شد!');
    } else {
      setCouponFeedback('کد تخفیف وارد شده نامعتبر یا منقضی گردیده است.');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (cartItems.length === 0) {
      setCheckoutError('سبد خرید شما خالی است.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Assemble body properties matching full-stack requirements
      const payload = {
        fullName,
        email,
        phone,
        address,
        discountCode: activeCoupon,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCreatedOrder(result.data);
        setCartItems([]); // On successful order placement, clear the active cart
      } else {
        setCheckoutError(result.error || 'خطا در ثبت نهایی اطلاعات سفارش.');
      }
    } catch (err: any) {
      console.error(err);
      setCheckoutError('خطای سرور در برقراری ارتباط با بخش پرداخت نهایی.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully created, display a glorious success card / printable invoice
  if (createdOrder) {
    return (
      <div className="py-12 max-w-2xl mx-auto space-y-8 text-right bg-white p-8 rounded-3xl border border-slate-100 shadow-md" id="receipt">
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto animate-bounce border border-emerald-100">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">سفارش شما با موفقیت ثبت شد!</h2>
          <p className="text-slate-500 text-sm">رسید الکترونیکی خرید و جزئیات پرداخت تان در زیر تولید گردیده است.</p>
        </div>

        {/* Invoice Area */}
        <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl space-y-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-205 pb-3 font-sans">
            <span className="font-bold text-slate-800">کد پیگیری کالا:</span>
            <span className="bg-sky-50 text-sky-700 font-extrabold px-3 py-1 rounded-md text-sm border border-sky-200 select-all font-mono">{createdOrder.orderId}</span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 pt-1 text-slate-600 font-sans">
            <span>خریدار محترم:</span>
            <span className="font-bold text-slate-800">{createdOrder.fullName}</span>
            
            <span>آدرس تحویل:</span>
            <span className="font-bold text-slate-800 leading-normal">{createdOrder.address}</span>

            <span>شماره تماس:</span>
            <span className="font-bold text-slate-800 tracking-wider text-right">{createdOrder.phone}</span>

            <span>تاریخ ثبت:</span>
            <span className="text-slate-550 text-right">{new Date(createdOrder.createdAt).toLocaleDateString('fa-IR')}</span>
            
            <span>تحویل فرضی:</span>
            <span className="text-slate-550 text-right font-bold text-sky-600">کمتر از ۳ روز کاری</span>
          </div>

          <div className="border-t border-slate-205 my-3"></div>

          {/* Table display item receipts */}
          <div className="space-y-2.5 font-sans">
            <span className="block font-bold text-slate-700 text-xs">اقلام فاکتور شده خرید:</span>
            {createdOrder.items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                <span>{it.name} <strong className="text-sky-600 font-mono">({it.quantity}x)</strong></span>
                <span className="font-bold font-mono text-amber-705">{(it.price * it.quantity).toLocaleString('fa-IR')} افغانی</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-205 my-3"></div>

          <div className="flex items-center justify-between font-sans text-base font-black text-slate-900 pt-1">
            <span>مبلغ پرداختی نهایی (افغانی):</span>
            <span className="text-amber-600 font-mono">{createdOrder.totalAmount.toLocaleString('fa-IR')} AFN</span>
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="bg-sky-50/50 p-4 border border-sky-100 rounded-2xl text-right flex items-start gap-4">
          <Bot size={24} className="text-sky-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">نکته رهگیری هوشمند:</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              شما می‌توانید با کاپی کردن کد پیگیری <strong className="font-mono bg-sky-100 px-1 rounded text-sky-800">{createdOrder.orderId}</strong> و رفتن به صفحه <strong className="text-sky-700 font-bold hover:underline cursor-pointer" onClick={() => setCurrentPage('smart-center')}>"دستیار هوشمند و رهگیری"</strong>، وضعیت ارسال کدهای خود را مکرر در هر زمان رصد بفرمائید!
            </p>
          </div>
        </div>

        {/* Option tools buttons */}
        <div className="flex items-center gap-3 justify-center pt-2">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Printer size={14} />
            <span>پرینت پیش‌فاکتور</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('home')}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>بازگشت به خانه فروشگاه</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 text-right" id="cart-view">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pr-1">سبد خرید و تسویه حساب</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">پیش فاکتور اقلام برگزیده تان و تسویه حساب سریع دیجیتالی.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-slate-50 border border-dashed rounded-3xl p-16 text-center space-y-6">
          <span className="text-5xl block animate-pulse">🛒</span>
          <h3 className="font-black text-slate-800 text-lg">سبد خرید شما خالی است!</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            هیچ کالایی به سبدتان اضافه نکرده‌اید. با مراجعه به ویترین محصولات کریمی شاپ، گجت‌ها و اکسسوری‌های مورد نظرتان را به سرعت به سبد خرید تان بیفزایید.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={16} />
            <span>رفتن به محصولات فروشگاه</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RIGHT PANELS: Items details list (8 grids) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-slate-850 text-sm border-r-4 border-sky-500 pr-2 pb-0.5">اقلام داخل سبد خرید ({cartItems.length})</h3>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-all"
                  id={`cart-item-${item.product.id}`}
                >
                  <div className="flex items-center gap-4 text-right">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 
                        onClick={() => {
                          setSelectedProductId(item.product.id);
                          setCurrentPage('detail');
                        }}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-sky-600 cursor-pointer transition-colors"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-amber-600 font-mono text-xs font-bold leading-none">
                        {item.product.price.toLocaleString('fa-IR')} افغانی
                      </p>
                    </div>
                  </div>

                  {/* Quantity modifiers & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="px-2.5 py-1 text-slate-705 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs text-slate-800 font-bold font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="px-2.5 py-1 text-slate-705 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title="حذف از سبد"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated coupon form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3.5">
              <h4 className="font-bold text-slate-805 text-xs flex items-center gap-1 justify-start">
                <Ticket className="text-sky-505" size={14} />
                <span>کود تخفیف خرید</span>
              </h4>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="کد تخفیف (مانند KARIMI10)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-right"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  اعمال تخفیف
                </button>
              </form>

              {couponFeedback && (
                <p className={`text-[11px] leading-relaxed font-semibold ${
                  couponFeedback.includes('موفقیت') ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {couponFeedback}
                </p>
              )}
            </div>
          </div>

          {/* LEFT PANELS: CHECKOUT CONSOLIDATED (5 grids) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Payment Invoice Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-105 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-r-4 border-amber-500 pr-2">خلاصه پیش فاکتور سبد</h3>
              
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span>مجموع ناخالص اقلام:</span>
                  <span className="font-mono text-slate-800 font-bold">{subtotal.toLocaleString('fa-IR')} افغانی</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold text-xs">
                    <span>کد تخفیف اعمال شده:</span>
                    <span className="font-mono">-{discountAmount.toLocaleString('fa-IR')} افغانی</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-500">
                  <span>قیمت انتقال کالا (ارسال):</span>
                  <span className="text-emerald-600 font-bold">بصورت تحفه (رایگان)</span>
                </div>
                
                <div className="border-t border-slate-100 my-2"></div>
                
                <div className="flex items-center justify-between text-slate-900 font-black text-sm sm:text-base">
                  <span>جمع کل نهایی پرداختی:</span>
                  <span className="font-mono text-amber-605">{grandTotal.toLocaleString('fa-IR')} AFN</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-xl text-[10px] leading-normal flex items-center gap-2 justify-start font-medium">
                <ShieldCheck size={16} className="shrink-0" />
                <span>خرید امن با درگاه صرافی الکترونیک معتبر تضمین شده است.</span>
              </div>
            </div>

            {/* Checkout delivery information submission */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-r-4 border-sky-500 pr-2">معلومات گیرنده جهت ارسال سفارش</h3>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">نام و تخلص کامل:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="مثال: فریدون کریمی"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-sky-550 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">آدرس ایمیل هوشمند:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@yourdomain.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-sky-550 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">شماره تماس (ترجیحاً واتساپ):</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="مثال: 0799123456"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-sky-550 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">آدرس دقیق کوره تحویل گیرنده:</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="مثال: کابل، شهر نو، جاده غضنفر، خانه نمبر ۴۲"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-sky-550 text-right"
                  />
                </div>

                {checkoutError && (
                  <p className="text-xs text-red-500 font-semibold">{checkoutError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm text-white transition-all shadow-md group cursor-pointer ${
                    isSubmitting 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-sky-600 to-sky-750 hover:from-sky-505 hover:to-sky-700 shadow-sky-500/10'
                  }`}
                >
                  <span>{isSubmitting ? 'در حال ثبت سفارش...' : 'پرداخت و تایید نهایی فاکتور'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
