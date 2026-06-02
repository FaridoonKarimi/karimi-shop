/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import SmartCenterView from './components/SmartCenterView';
import { CartItem, Product } from './types';
import { Check } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Custom alert feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial cart count or elements if any from localStorage for durability
  useEffect(() => {
    const saved = localStorage.getItem('karimi_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save changes to cart dynamically
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('karimi_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      
      if (existing) {
        updated = prev.map((item) => {
          if (item.product.id === product.id) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        updated = [...prev, { product, quantity }];
      }
      
      localStorage.setItem('karimi_cart', JSON.stringify(updated));
      return updated;
    });

    // Trigger visual toast feedback
    setToastMessage(`کالا «${product.name}» به تعداد ${quantity} عدد با موفقیت به سبد خرید افزوده شد.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-sky-100 selection:text-sky-850" dir="rtl" id="app-root">
      
      {/* Header element */}
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        cartCount={cartCount} 
      />

      {/* Floating alert feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-in max-w-sm text-right">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={16} />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-bold">سبد خرید بروزرسانی شد</span>
            <p className="text-xs text-slate-200 mt-0.5 leading-normal">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Page Area Views */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentPage === 'home' && (
          <HomeView 
            setCurrentPage={setCurrentPage} 
            setSelectedProductId={setSelectedProductId} 
            addToCart={addToCart} 
          />
        )}
        
        {currentPage === 'shop' && (
          <ShopView 
            setSelectedProductId={setSelectedProductId} 
            setCurrentPage={setCurrentPage} 
            addToCart={addToCart} 
          />
        )}

        {currentPage === 'detail' && (
          <ProductDetailView 
            productId={selectedProductId} 
            setSelectedProductId={setSelectedProductId} 
            addToCart={addToCart} 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {currentPage === 'cart' && (
          <CartView 
            cartItems={cartItems} 
            setCartItems={saveCart} 
            setCurrentPage={setCurrentPage} 
            setSelectedProductId={setSelectedProductId} 
          />
        )}

        {currentPage === 'smart-center' && (
          <SmartCenterView />
        )}
      </main>

      {/* Footer element */}
      <Footer setCurrentPage={setCurrentPage} />
      
    </div>
  );
}
