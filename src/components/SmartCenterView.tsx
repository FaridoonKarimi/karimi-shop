import React, { useState, useEffect, useRef } from 'react';
import { Bot, Search, Send, MapPin, Truck, ShieldCheck, CheckCircle, Package, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage, Order } from '../types';

export default function SmartCenterView() {
  const [activeTab, setActiveTab] = useState<'ai-chat' | 'order-tracker'>('ai-chat');

  // --- AI CHAT WORKSPACE STATES ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'سلام و رحمت‌الله! جان تان جور است؟ من دستیار هوشمند فروشگاه کریمی شاپ هستم. چطور می‌توانم امروز در انتخاب بهترین محصولات تکنالوژی، لباس‌های لوکس یا قهوه‌سازهای باکیفیت برای تان کمک کنم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- ORDER TRACKER WORKSPACE STATES ---
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Pre-configured AI helper chips
  const suggestionChips = [
    "گوشی‌های هوشمند دارای هوش مصنوعی کدامند؟",
    "برترین ساعت‌های لوکس کریمی شاپ را معرفی کن",
    "چطور می‌توانم کود تخفیف WELCOME را استفاده کنم؟",
    "یک هدیه شیک برای خانم‌ها چی پیشنهاد میکنی؟"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiTyping(true);

    try {
      // Accumulate previous conversational turn details
      const conversationPayload = [...messages, userMsg].map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationPayload })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'model',
            text: data.text,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'خطا در بارگذاری پاسخ هوشمند.');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'model',
          text: 'ببخشید، خطای اتصال اینترنتی در برقراری ارتباط با مغز هوش مصنوعی رخ داده است. لطفاً چند لحظه بعد مجدداً تلاش ورزید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTracking(true);
    setTrackingError(null);
    setTrackedOrder(null);

    try {
      const res = await fetch(`/api/order/track/${trackingId.trim()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTrackedOrder(data.data);
      } else {
        setTrackingError(data.error || 'سفارش مورد نظر یافت نشد. لطفاً شماره فاکتور را دوباره بررسی نمایید.');
      }
    } catch (err) {
      console.error(err);
      setTrackingError('امکان دریافت معلومات وجود ندارد. بررسی کنید که اینترنت متصل است.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none" id="smart-center">
      
      {/* Title area */}
      <div className="text-right border-b border-slate-100 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pr-1">مرکز خدمات دیجیتال و هوش مصنوعی</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">با هوش مکرر مشورت کنید و بسته‌های کدهای خود را پیگیری نمائید.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 gap-1 justify-start">
        <button
          onClick={() => setActiveTab('ai-chat')}
          className={`px-5 py-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ai-chat'
              ? 'border-sky-600 text-sky-600 font-bold bg-sky-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot size={16} />
          <span>مشاوره و دستیار خرید هوشمند AI</span>
        </button>
        <button
          onClick={() => setActiveTab('order-tracker')}
          className={`px-5 py-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'order-tracker'
              ? 'border-sky-600 text-sky-600 font-bold bg-sky-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck size={16} />
          <span>رهگیری و استعلام سفارشات</span>
        </button>
      </div>

      {/* Dynamic Tab Panel Display */}
      {activeTab === 'ai-chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick FAQ info panel (4 grid parts) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 text-right space-y-4 shadow-2xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <MessageSquare size={16} className="text-sky-500" />
              <span>درباره دستیار کریمی شاپ</span>
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              این دستیار مجهز به مدل پیشرفته هوش مصنوعی <strong className="text-sky-600">Gemini 3.5-flash</strong> است. او کاملاً بر لیست تمام ۲۰ محصول واقعی ما، مشخصات و قیمت‌هایشان مسلط است.
            </p>
            <div className="bg-amber-50 text-amber-800 p-3 rounded-2xl border border-amber-100 space-y-1.5 text-xs">
              <span className="block font-bold">💡 پیشنهادهای ویژه او:</span>
              <p className="text-slate-600 leading-normal">می‌توانید کدهای تخفیف با ارزش مانند <strong className="bg-white/70 px-1 py-0.5 rounded font-mono">KARIMI10</strong> را بپرسید تا او راه‌های بهینه کاهش هزینه‌ها را برای شما استعلام کند!</p>
            </div>
            
            {/* Suggestions Quick Buttons */}
            <div className="space-y-2 pt-2">
              <span className="block text-slate-400 text-xs font-bold">بپرسید از هوش مصنوعی:</span>
              <div className="flex flex-col gap-1.5">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="w-full text-right bg-slate-50 hover:bg-sky-50 hover:text-sky-700 transition-all p-2.5 rounded-xl text-xs text-slate-650 cursor-pointer border border-slate-100/50 leading-relaxed font-semibold truncate"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Chat Box (8 grid parts) */}
          <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs h-[500px]">
            
            {/* Header chat room */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 text-right flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-100">
                  <Bot size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-none">پشتیبان هوشمند کریمی شاپ</h4>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">&bull; آماده مشاوره آنلاین (فعال)</span>
                </div>
              </div>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full font-mono">GEMINI-3.5</span>
            </div>

            {/* Conversation text lists */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} text-right`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm shadow-2xs ${
                      m.role === 'user'
                        ? 'bg-sky-650 text-white rounded-tr-none font-medium'
                        : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none leading-relaxed'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                    <span className={`block text-[10px] text-left font-mono ${m.role === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start text-right">
                  <div className="bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl rounded-tl-none p-4 shadow-2xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-slate-400 text-xs font-semibold pr-1">دستیار کاریمی در حال نوشتن پاسخ...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input field actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }}
                className="flex gap-2"
              >
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiTyping}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    inputMessage.trim() && !isAiTyping
                      ? 'bg-sky-600 text-white shadow-md hover:bg-sky-505'
                      : 'bg-slate-205 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="سوال یا پیام خود را بنویسید..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 text-right"
                />
              </form>
            </div>

          </div>

        </div>
      ) : (
        /* TRACKER TAB PANEL */
        <div className="max-w-3xl mx-auto space-y-8 text-right bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base">پیگیری آنی کدهای مرسوله</h3>
            <p className="text-slate-400 text-xs">برای مشاهده وضعیت کنونی بسته‌ گجت‌ها، شماره پیگیری خرید (مثلاً <span className="font-mono bg-slate-50 text-sky-600 font-bold px-1.5 py-0.5 rounded">KR-4012</span> یا <span className="font-mono bg-slate-50 text-sky-600 font-bold px-1.5 py-0.5 rounded">KR-1090</span> یا فرآیند تسویه تان) را وارد کنید.</p>
          </div>

          {/* Form tracks entry */}
          <form onSubmit={handleTrackingSubmit} className="flex gap-2.5">
            <button
              type="submit"
              disabled={isTracking || !trackingId.trim()}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isTracking ? 'در حال ردگیری...' : 'استعلام وضعیت فاکتور'}
            </button>
            <input
              type="text"
              required
              placeholder="مثال: KR-4012"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-505 font-mono text-center tracking-widest uppercase"
            />
          </form>

          {trackingError && (
            <p className="text-xs text-red-500 font-semibold">{trackingError}</p>
          )}

          {/* Order results timeline track */}
          {trackedOrder && (
            <div className="space-y-6 pt-4 border-t border-slate-50 animation-fade">
              
              {/* Recipient summary info box */}
              <div className="p-4 bg-slate-50 border rounded-2xl grid grid-cols-2 gap-y-2.5 text-xs sm:text-sm text-slate-600">
                <span>تحویل گیرنده:</span>
                <span className="font-bold text-slate-805 text-left">{trackedOrder.fullName}</span>
                
                <span>آدرس تحویل:</span>
                <span className="font-bold text-slate-805 text-left text-xs">{trackedOrder.address}</span>

                <span>هزینه نهایی فاکتور:</span>
                <span className="font-bold text-slate-805 text-left font-mono">{trackedOrder.totalAmount.toLocaleString('fa-IR')} افغانی</span>
              </div>

              {/* STYLISH VERTICAL TIMELINE MILESTONE */}
              <div className="space-y-6 relative mr-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:right-3.5 before:w-0.5 before:bg-slate-100">
                
                {[
                  { key: 'pending', title: 'سفارش ثبت گردید', desc: 'پیش فاکتور مکتوب شما با تایید درگاه به سرور منتقل شد.' },
                  { key: 'processing', title: 'در حال آماده‌سازی و بسته‌بندی', desc: 'کالای انتخابی از قفسه انبار برگزیده شده و در حال قرار گرفتن در پک صادراتی است.' },
                  { key: 'shipped', title: 'تحویل باربری و مرسولات ولایت', desc: 'ساک سفارش به مامور پست کریمی لیدر واگذار شد.' },
                  { key: 'delivered', title: 'بسته با موفقیت تحویل داده شد', desc: 'کارت گارانتی طلایی ممهور شد و کالا به دستان شما تقدیم شد!' }
                ].map((step, idx) => {
                  
                  // Simple check for completed statuses
                  const statusPriorityMap: Record<string, number> = {
                    'pending': 1,
                    'processing': 2,
                    'shipped': 3,
                    'delivered': 4
                  };

                  const currentPriority = statusPriorityMap[trackedOrder.status] || 1;
                  const stepPriority = statusPriorityMap[step.key];
                  const isCompleted = stepPriority <= currentPriority;
                  const isActive = step.key === trackedOrder.status;

                  return (
                    <div key={idx} className="flex gap-4 relative justify-start items-start">
                      
                      {/* Milestone Badge Point */}
                      <div className={`w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-sky-650 border-sky-650 text-white'
                          : 'bg-white border-slate-200 text-slate-350'
                      }`}>
                        {step.key === 'delivered' ? (
                          <CheckCircle size={14} />
                        ) : step.key === 'shipped' ? (
                          <Truck size={12} />
                        ) : step.key === 'processing' ? (
                          <Package size={12} />
                        ) : (
                          <CheckCircle size={12} />
                        )}
                      </div>

                      {/* Details descriptions */}
                      <div className="space-y-1">
                        <h4 className={`text-xs sm:text-sm font-bold ${isActive ? 'text-sky-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                          {isActive && <span className="mr-2 bg-sky-100 text-sky-800 text-[9px] font-black px-2 py-0.5 rounded-full">میلان هم‌اکنون</span>}
                        </h4>
                        <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed max-w-md">{step.desc}</p>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
