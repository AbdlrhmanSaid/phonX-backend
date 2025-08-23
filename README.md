# PhoneX Backend - API Server

## 🚀 الإصلاحات والتحسينات الجديدة

### ✅ تم إصلاح المشاكل التالية:

#### 1. مشكلة تحديث رقم الهاتف

- **المشكلة**: المستخدم لم يكن يستطيع تعديل رقم هاتفه بشكل صحيح
- **الحل**:
  - إضافة imports مفقودة في `updateProfile.js`
  - تحسين منطق التحقق من صحة رقم الهاتف
  - إضافة رسائل خطأ واضحة باللغة العربية

#### 2. مشكلة إضافة كلمة سر لمستخدم جوجل

- **المشكلة**: المستخدم من جوجل لم يكن يستطيع إضافة كلمة سر لحسابه
- **الحل**:
  - تحسين منطق تحديث كلمة المرور في `updateProfile.js`
  - إضافة توجيهات واضحة في واجهة المستخدم
  - تمييز نوع الحساب (جوجل/محلي) في واجهة التحديث

#### 3. مشكلة دمج الحسابات غير المرغوب

- **المشكلة**: كان يحدث دمج تلقائي للحسابات عند تسجيل الدخول بجوجل
- **الحل**:
  - تحسين منطق `googleAuthController.js` لمنع الدمج التلقائي
  - إضافة رسائل خطأ واضحة عند وجود تضارب
  - تحسين منطق التسجيل لمنع إنشاء حساب جديد بنفس البريد الإلكتروني

### 🔧 التحسينات المضافة:

#### 1. تحسين معالجة الأخطاء

- رسائل خطأ واضحة باللغة العربية
- معالجة خاصة للحسابات المسجلة عبر جوجل
- تحسين رسائل الخطأ في الفرونت إند

#### 2. تحسين التحقق من البيانات

- التحقق من صحة رقم الهاتف (11 رقم يبدأ بـ 01)
- التحقق من طول كلمة المرور (6 أحرف على الأقل)
- التحقق من طول الاسم (3 أحرف على الأقل)

#### 3. تحسين الأمان

- منع التشفير المزدوج لكلمات المرور
- تحسين منطق التحقق من التوكنات
- إضافة logging للأخطاء

### 📁 الملفات المحدثة:

- `controllers/updateProfile.js` - إصلاح تحديث البيانات
- `controllers/googleAuthController.js` - تحسين منطق جوجل
- `controllers/authController.js` - تحسين التسجيل وتسجيل الدخول
- `models/User.js` - تحسين تشفير كلمات المرور
- `controllers/userController.js` - تحسين استجابات API
- `routes/userRoutes.js` - تحسين مسارات المستخدم

### 🧪 اختبار الإصلاحات:

#### تشغيل الاختبارات:

```bash
# تشغيل اختبارات الباك إند
node test-auth.js

# تشغيل الخادم
npm run dev
```

#### اختبار API Endpoints:

1. **تسجيل مستخدم جديد**:

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

2. **تسجيل الدخول**:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

3. **تحديث الملف الشخصي**:

```bash
curl -X PUT http://localhost:5000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01123456789",
    "governorate": "القاهرة",
    "region": "المعادي",
    "address": "شارع النيل"
  }'
```

4. **إضافة كلمة مرور لمستخدم جوجل**:

```bash
curl -X PUT http://localhost:5000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

5. **جلب الملف الشخصي**:

```bash
curl -X GET http://localhost:5000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 🔒 الأمان:

- جميع كلمات المرور مشفرة باستخدام bcrypt
- التحقق من صحة جميع المدخلات
- حماية من SQL Injection و XSS
- Rate Limiting على مسارات المصادقة
- JWT Tokens محمية ومُحدثة

### 📝 ملاحظات مهمة:

1. **تأكد من إعداد المتغيرات البيئية** قبل تشغيل المشروع
2. **قاعدة البيانات** يجب أن تكون متصلة ومُعدة بشكل صحيح
3. **جميع المسارات** محمية ومُعدة للاستخدام في الإنتاج
4. **Google OAuth** يتطلب إعداد صحيح في Google Cloud Console

### 🚀 تشغيل المشروع:

```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev

# تشغيل في وضع الإنتاج
npm start
```

### 📞 الدعم:

إذا واجهت أي مشاكل، يرجى:

1. التحقق من console logs
2. التأكد من إعداد المتغيرات البيئية
3. التحقق من اتصال قاعدة البيانات
4. مراجعة ملف AUTH_SETUP.md
