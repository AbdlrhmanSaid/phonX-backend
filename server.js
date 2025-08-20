import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// الصفحة الرئيسية - توثيق النظام
app.get("/", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhoneX Backend API - توثيق النظام</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 1.2rem;
            margin-bottom: 20px;
        }
        
        .status {
            display: inline-block;
            background: #27ae60;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .main-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3rem;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #ecf0f1;
            position: relative;
            padding-right: 25px;
        }
        
        .feature-list li:before {
            content: "✓";
            position: absolute;
            right: 0;
            color: #27ae60;
            font-weight: bold;
        }
        
        .api-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .api-section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.8rem;
            text-align: center;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
        }
        
        .endpoint h4 {
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }
        
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 5px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
        .put { background: #fca130; color: white; }
        .delete { background: #f93e3e; color: white; }
        
        .tech-stack {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .tech-stack h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .tech-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e9ecef;
        }
        
        .tech-item strong {
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
        }
        
        .footer {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .footer p {
            color: #7f8c8d;
            margin-bottom: 10px;
        }
        
        .link {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
        }
        
        .link:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 PhoneX Backend API</h1>
            <p>نظام متكامل للبيع عبر الإنترنت مع إدارة الحجوزات</p>
            <span class="status">🟢 النظام يعمل بنجاح</span>
        </div>
        
        <div class="main-content">
            <div class="card">
                <h3>🎯 الميزات الأساسية</h3>
                <ul class="feature-list">
                    <li>نظام تسجيل دخول آمن</li>
                    <li>إدارة المنتجات والتصنيفات</li>
                    <li>سلة التسوق المتقدمة</li>
                    <li>نظام الطلبات الشامل</li>
                    <li>حجز المواعيد</li>
                    <li>لوحة تحكم الأدمن</li>
                </ul>
            </div>
            
            <div class="card">
                <h3>🔐 الأمان والحماية</h3>
                <ul class="feature-list">
                    <li>تشفير كلمات المرور</li>
                    <li>JWT للمصادقة</li>
                    <li>Rate Limiting</li>
                    <li>التحقق من المدخلات</li>
                    <li>حماية CORS</li>
                    <li>Middleware للأمان</li>
                </ul>
            </div>
            
            <div class="card">
                <h3>📊 التحليلات والتقارير</h3>
                <ul class="feature-list">
                    <li>إحصائيات المبيعات</li>
                    <li>تقارير المنتجات</li>
                    <li>تحليل الطلبات</li>
                    <li>إحصائيات المستخدمين</li>
                    <li>تقارير الحجوزات</li>
                    <li>لوحة تحكم تفاعلية</li>
                </ul>
            </div>
        </div>
        
        <div class="api-section">
            <h2>🔗 نقاط النهاية المتاحة (API Endpoints)</h2>
            
            <div class="endpoint">
                <h4><span class="method post">POST</span> /api/auth/register</h4>
                <p>تسجيل مستخدم جديد</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method post">POST</span> /api/auth/login</h4>
                <p>تسجيل دخول المستخدم</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method get">GET</span> /api/products</h4>
                <p>عرض جميع المنتجات مع التصفية والبحث</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method post">POST</span> /api/cart/add</h4>
                <p>إضافة منتج إلى سلة التسوق</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method post">POST</span> /api/orders</h4>
                <p>إنشاء طلب جديد</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method post">POST</span> /api/appointments</h4>
                <p>حجز موعد جديد</p>
            </div>
            
            <div class="endpoint">
                <h4><span class="method get">GET</span> /api/admin/dashboard</h4>
                <p>لوحة تحكم الأدمن مع الإحصائيات</p>
            </div>
        </div>
        
        <div class="tech-stack">
            <h2>🛠️ التقنيات المستخدمة</h2>
            <div class="tech-grid">
                <div class="tech-item">
                    <strong>Node.js</strong>
                    <span>Runtime Environment</span>
                </div>
                <div class="tech-item">
                    <strong>Express.js</strong>
                    <span>Web Framework</span>
                </div>
                <div class="tech-item">
                    <strong>MongoDB</strong>
                    <span>Database</span>
                </div>
                <div class="tech-item">
                    <strong>Mongoose</strong>
                    <span>ODM</span>
                </div>
                <div class="tech-item">
                    <strong>JWT</strong>
                    <span>Authentication</span>
                </div>
                <div class="tech-item">
                    <strong>bcryptjs</strong>
                    <span>Password Hashing</span>
                </div>
                <div class="tech-item">
                    <strong>Cloudinary</strong>
                    <span>File Upload</span>
                </div>
                <div class="tech-item">
                    <strong>Multer</strong>
                    <span>File Handling</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>📚 للاطلاع على التوثيق الكامل: <a href="/docs" class="link">وثائق API التفصيلية</a></p>
            <p>🔗 رابط API الأساسي: <a href="https://phonex-backend-kslfjt915-abdelrhmans-projects-6b934fd9.vercel.app/" class="link" target="_blank">PhoneX Backend</a></p>
            <p>📧 للتواصل والدعم التقني</p>
            <p>© 2024 PhoneX Backend - جميع الحقوق محفوظة</p>
        </div>
    </div>
</body>
</html>
  `;

  res.send(html);
});

// صفحة التوثيق التفصيلي
app.get("/docs", (req, res) => {
  res.redirect(
    "https://phonex-backend-kslfjt915-abdelrhmans-projects-6b934fd9.vercel.app/docs.md"
  );
});

// الوصول إلى ملف التوثيق مباشرة
app.get("/docs.md", (req, res) => {
  res.setHeader("Content-Type", "text/markdown");
  res.sendFile("docs.md", { root: "./" });
});

// التحقق من حالة النظام
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "النظام يعمل بنجاح",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

export default app;
