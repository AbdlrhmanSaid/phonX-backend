# إعداد نظام المصادقة - PhoneX Backend

## المتغيرات المطلوبة في ملف .env

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-jwt-secret-key-here

# Server
PORT=5000
NODE_ENV=development

# CORS (Optional)
CORS_ORIGIN=http://localhost:3000
```

## نقاط النهاية المتاحة (API Endpoints)

### 1. التسجيل التقليدي

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "01234567890",
  "password": "123456"
}
```

**الاستجابة:**

```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "01234567890",
  "role": "user",
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### 2. تسجيل الدخول التقليدي

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

**الاستجابة:**

```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "01234567890",
  "role": "user",
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### 3. تسجيل الدخول بجوجل

```http
POST /api/auth/google
Content-Type: application/json

{
  "email": "user@gmail.com",
  "name": "User Name",
  "googleId": "google_user_id",
  "image": "profile_image_url"
}
```

**الاستجابة:**

```json
{
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@gmail.com",
    "phone": null,
    "role": "user",
    "image": "profile_image_url"
  },
  "token": "jwt_token"
}
```

### 4. تحديث التوكن

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "token": "refresh_token"
}
```

### 5. نسيان كلمة المرور

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 6. إعادة تعيين كلمة المرور

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password"
}
```

## الملفات الرئيسية

### 1. Auth Controller

- **الملف**: `controllers/authController.js`
- **المسؤولية**: معالجة عمليات المصادقة التقليدية

### 2. Google Auth Controller

- **الملف**: `controllers/googleAuthController.js`
- **المسؤولية**: معالجة تسجيل الدخول بجوجل

### 3. User Model

- **الملف**: `models/User.js`
- **المسؤولية**: تعريف نموذج المستخدم

### 4. Auth Middleware

- **الملف**: `middleware/authMiddleware.js`
- **المسؤولية**: حماية المسارات والتحقق من التوكن

### 5. Auth Routes

- **الملف**: `routes/authRoutes.js`
- **المسؤولية**: تعريف مسارات المصادقة

## الميزات

### ✅ تم إصلاحها

- [x] التسجيل التقليدي مع حقل الهاتف
- [x] تسجيل الدخول التقليدي
- [x] تسجيل الدخول بجوجل
- [x] ربط الحسابات الموجودة بجوجل
- [x] إدارة التوكنات (JWT)
- [x] Refresh Token
- [x] نسيان كلمة المرور
- [x] إعادة تعيين كلمة المرور
- [x] حماية المسارات
- [x] التحقق من المدخلات
- [x] Rate Limiting
- [x] معالجة الأخطاء

### 🔧 التحسينات المضافة

- [x] تحسين منطق التحقق من التوكن
- [x] إضافة حقل الهاتف في الاستجابات
- [x] تحسين التعامل مع Google Auth
- [x] إصلاح مشكلة البحث عن المستخدمين

## اختبار النظام

### 1. اختبار التسجيل

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "01234567890",
    "password": "123456"
  }'
```

### 2. اختبار تسجيل الدخول

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. اختبار Google Auth

```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@gmail.com",
    "name": "User Name",
    "googleId": "google_user_id",
    "image": "profile_image_url"
  }'
```

### 4. اختبار المسار المحمي

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## نموذج المستخدم (User Schema)

```javascript
{
  name: String (required, 3-50 chars),
  phone: String (unique, Egyptian format),
  email: String (required, unique, lowercase),
  password: String (min 6 chars, hashed),
  role: String (enum: "user", "admin", default: "user"),
  provider: String (enum: "local", "google", default: "local"),
  googleId: String (sparse),
  image: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshTokens: Array,
  timestamps: true
}
```

## الأمان

### 1. تشفير كلمات المرور

- استخدام bcryptjs مع salt rounds = 10

### 2. JWT Tokens

- Access Token: 30 دقيقة
- Refresh Token: 7 أيام

### 3. Rate Limiting

- 5 محاولات لكل دقيقة للمصادقة

### 4. التحقق من المدخلات

- استخدام express-validator
- التحقق من صحة البريد الإلكتروني
- التحقق من طول كلمة المرور

### 5. CORS Protection

- إعداد CORS للفرونت إند فقط

## ملاحظات مهمة

1. **تأكد من إعداد MongoDB** قبل تشغيل التطبيق
2. **JWT_SECRET** يجب أن يكون قوياً وفريداً
3. **حقل الهاتف** اختياري ولكن يجب أن يكون بتنسيق مصري صحيح
4. **Google Auth** يدعم ربط الحسابات الموجودة
5. **Refresh Token** يستخدم لتجديد Access Token

## استكشاف الأخطاء

### مشكلة: "User already exists"

- البريد الإلكتروني مستخدم مسبقاً
- جرب تسجيل الدخول بدلاً من التسجيل

### مشكلة: "Invalid credentials"

- تأكد من صحة البريد الإلكتروني وكلمة المرور
- تأكد من أن الحساب موجود

### مشكلة: "Not authorized, token failed"

- التوكن منتهي الصلاحية
- استخدم Refresh Token لتجديد التوكن

### مشكلة: "MongoDB connection failed"

- تأكد من صحة MONGODB_URI
- تأكد من أن MongoDB يعمل
