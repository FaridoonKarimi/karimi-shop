import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./src/productsData"; // Clean TypeScript/Bundler import
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory simple storage to demonstrate full-stack persistence for user orders and simulated database
const ordersDb: Record<string, any> = {
  "KR-4012": {
    orderId: "KR-4012",
    fullName: "فریدون کریمی",
    email: "faridoonkarimi2018@gmail.com",
    phone: "0799887766",
    address: "شهر نو، کابل، افغانستان",
    items: [
      { productId: 1, name: "آیفون ۱۵ پرو مکس (256GB)", price: 94000, quantity: 1 }
    ],
    totalAmount: 94000,
    status: "processing",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  },
  "KR-1090": {
    orderId: "KR-1090",
    fullName: "احمد جاوید",
    email: "javid@test.com",
    phone: "0788223344",
    address: "کارته چهار، کابل، افغانستان",
    items: [
      { productId: 15, name: "دستگاه قهوه‌ساز اسپرسو بارنی", price: 13500, quantity: 1 },
      { productId: 16, name: "ست ماگ سرامیکی دست‌ساز (۳ تایی)", price: 1900, quantity: 2 }
    ],
    totalAmount: 17300,
    status: "shipped",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  }
};

// Initialize Gemini Client Lazily to prevent crash if key is missing/unconfigured
let aiClient: any = null;
function getAi() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ هشدار: کلید GEMINI_API_KEY تعریف نشده است. قابلیت‌های دستیار هوشمند کار نخواهد کرد.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// ================= API ENDPOINTS =================

// 1. Get all products (20 Products)
app.get("/api/products", (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

// 2. Get single product by id
app.get("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, error: "محصول پیدا نشد" });
  }
  res.json({ success: true, data: product });
});

// 3. Simulated Full-Stack Checkout (Order Creation)
app.post("/api/checkout", (req, res) => {
  const { fullName, email, phone, address, items, discountCode } = req.body;

  if (!fullName || !email || !phone || !address || !items || !items.length) {
    return res.status(400).json({ success: false, error: "تمامی معلومات مورد نیاز برای ثبت سفارش را تکمیل نمائید." });
  }

  // Calculate prices
  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ success: false, error: `محصول با آی‌دی ${item.productId} پیدا نشد.` });
    }
    const qty = Math.max(1, parseInt(item.quantity) || 1);
    totalAmount += product.price * qty;
    processedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty
    });
  }

  // Handle simulated coupons
  if (discountCode === "KARIMI10") {
    totalAmount = Math.round(totalAmount * 0.9); // 10% discount
  } else if (discountCode === "WELCOME") {
    totalAmount = Math.round(totalAmount - 500); // 500 AFN discount
  }

  const orderId = `KRFa-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = new Date().toISOString();
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days later

  const newOrder = {
    orderId,
    fullName,
    email,
    phone,
    address,
    items: processedItems,
    totalAmount,
    status: "processing",
    createdAt: orderDate,
    estimatedDelivery: deliveryDate
  };

  // Persist to simulated orders database
  ordersDb[orderId] = newOrder;

  res.status(201).json({
    success: true,
    message: "سفارش شما با موفقیت ثبت گردید.",
    data: newOrder
  });
});

// 4. Track order in real-time
app.get("/api/order/track/:id", (req, res) => {
  const id = req.params.id.trim().toUpperCase();
  const order = ordersDb[id];
  if (!order) {
    return res.status(404).json({ success: false, error: "سفارش مورد نظر پیدا نشد. لطفاً کد پیگیری را بررسی نمائید." });
  }
  res.json({ success: true, data: order });
});

// 5. Store-wide Reviews
app.get("/api/reviews/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const mockupReviews = [
    { id: 1, userName: "حسیب احمدی", rating: 5, comment: "بسیار محصول عالی و باکیفیت بود. تشکر از کریمی شاپ بابت ارسال به موقع!", date: "۱۴۰۵/۰۲/۱۵" },
    { id: 2, userName: "سهیلا غفوری", rating: 4, comment: "جنس اصل و کیفیت دوخت بی‌نظیر است. فقط اگر قیمتش کمی ارزانتر بود عالی میشد.", date: "۱۴۰۵/۰۳/۰۱" },
    { id: 3, userName: "حامد ناصری", rating: 5, comment: "باورم نمیشد چارجدهی بسیار فوق‌العاده‌ای داشته باشد. دقیقاً مشابه توضیحات است.", date: "۱۴۰۵/۰۳/۰۴" }
  ];
  res.json({ success: true, data: mockupReviews });
});

// 6. Gemini-powered chat assistant for Karimi Shop FAQ & Recommender
app.post("/api/assistant", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: "پیام‌ها ارسال نشده است." });
  }

  const ai = getAi();
  if (!ai) {
    return res.json({
      success: true,
      text: "سلام! من دستیار هوشمند کریمی شاپ هستم. در حال حاضر کلید API هوش مصنوعی در سرور فعال نیست، اما من می‌توانم پیشنهاد کنم که حتماً از محصولات ما دیدن کنید! ما ۲۰ محصول برتر تکنالوژی، مد و لوازم خانه با کیفیت عالی داریم."
    });
  }

  // Format the catalog for system instructions
  const catalogText = PRODUCTS.map(p => {
    return `- [آی‌دی: ${p.id}] ${p.name} - قیمت: ${p.price} افغانی - دسته‌بندی: ${p.categoryFa}. توضیحات: ${p.description}`;
  }).join("\n");

  const systemInstruction = `
شما دستیار هوش مصنوعی هوشمند و بسیار مودب برای فروشگاه آنلاین "کریمی شاپ" (Karimi Shop) هستید. 
نام شما "دستیار کریمی شاپ" است و باید صمیمی، بسیار مهربان و با لهجه گرم فارسی/درّی افغانستانی صحبت کنید.

وظایف اصلی شما:
۱. مشتریان را به خوبی راهنمایی کنید تا محصولات مورد نیازشان را بخرند.
۲. لیست کاتالوگ محصولات واقعی کریمی شاپ همین لیست پائین است. فقط و فقط محصولات موجود در این کاتالوگ را به مشتری معرفی و پیشنهاد کنید. از خودتان محصولات خیالی نسازید.
۳. قیمت‌ها را به واحد پول افغانی (AFN) ذکر فرمائید.
۴. همواره لحن مثبت و ترغیب‌کننده برای خرید داشته باشید و کدهای تخفیف فعال مانند (KARIMI10 برای ۱۰٪ تخفیف و WELCOME برای ۵۰۰ افغانی تخفیف) را در صحبت‌هایتان پیشنهاد کنید.

لیست محصولات واقعی فروشگاه کریمی شاپ:
${catalogText}

مثالی از لهجه درّی گرم: "سلام وعلیکم! به فروشگاه کریمی شاپ خوش آمدید. جان تان جور است؟ چطور می‌توانم امروز برایتان خدمت کنم؟"
به عنوان یک مشاور دلسوز، ویژگی‌های متمایز کننده را به خریدار بگویید.
پاسخ‌های شما باید کاربردی، آموزنده و نه چندان طولانی باشد. قالب‌بندی مرتب با استفاده از مارک‌داون (مانند بولت پوینت‌ها) بسیار عالی است.
`.trim();

  try {
    // Map conversation array to Gemini contents parameter
    const formattedContents = messages.map((msg: any) => {
      return {
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const assistantText = response.text || "ببخشید، نتوانستم پاسخ مناسبی تولید کنم. لطفاً دوباره بپرسید.";
    res.json({ success: true, text: assistantText });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ success: false, error: "خطا در برقراری ارتباط با مدل هوش مصنوعی کریمی شاپ.", details: error.message });
  }
});

// ================= VITE DEV / PRODUCTION FALLBACK =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK SERVER] Running on host 0.0.0.0 and port ${PORT}`);
  });
}

startServer();
