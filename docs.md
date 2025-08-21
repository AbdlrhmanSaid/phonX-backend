# Link

https://phonex-backend-5w2z9tjlt-abdelrhmans-projects-6b934fd9.vercel.app/
https://phonex-backend.vercel.app/

## 🗺️ فهرس سريع للراوتات (Quick Route Index)

- **Auth `/api/auth`**:
  - `POST /register`, `POST /login`, `POST /refresh-token`, `POST /forgot-password`, `POST /reset-password`
- **Users `/api/users`**:
  - `GET /` (Admin), `GET /:id` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin), `PUT /profile/me` (Auth)
- **Categories `/api/categories`**:
  - `GET /`, `GET /:id`, `POST /` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin)
- **Products `/api/products`**:
  - `GET /`, `GET /:id`, `POST /` (Admin, images) `PUT /:id` (Admin), `DELETE /:id` (Admin), `POST /discount/category/:categoryId` (Admin)
- **Cart `/api/cart`** (Auth):
  - `GET /`, `POST /add`, `PUT /update`, `DELETE /remove/:itemId`, `DELETE /clear`
- **Orders `/api/orders`**:
  - `POST /` (Auth), `GET /my-orders` (Auth), `GET /my-orders/:id` (Auth), `GET /` (Admin), `PUT /:id/status` (Admin), `DELETE /:id` (Admin)
- **Appointments `/api/appointments`**:
  - `POST /` (Auth, images), `GET /my-appointments` (Auth), `GET /my-appointments/:id` (Auth), `PUT /:id/status` (Admin), `DELETE /:id` (Admin)
- **Admin `/api/admin`** (protect + admin):
  - Overview: `GET /overview`, Reports: `GET /reports/sales`
  - Users: `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`
  - Categories: `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
  - Products: `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`, `POST /products/discount/category/:categoryId`, `DELETE /products/discount/category/:categoryId`
  - Orders: `GET /orders`, `GET /orders/:id`, `PUT /orders/:id`, `DELETE /orders/:id`
  - Appointments: `GET /appointments`, `GET /appointments/:id`, `PUT /appointments/:id`, `DELETE /appointments/:id`

---

# 📚 وثائق API - مشروع PhoneX Backend

## 🚀 نظرة عامة

هذا المشروع عبارة عن API للبيع عبر الإنترنت مع نظام حجوزات. يدعم تسجيل المستخدمين، إدارة المنتجات، الكارت، الطلبات، والحجوزات.

### ✨ الميزات الجديدة

- **لوحة تحكم الأدمن:** إدارة شاملة للنظام مع إحصائيات وتقارير
- **نظام الخصومات:** دعم خصومات على المنتجات والكاتيجوريات
- **تصفية وبحث متقدم:** في جميع القوائم مع دعم الصفحات والترتيب
- **إدارة متقدمة للمنتجات:** مع خصائص الخصم والحالة
- **تقارير المبيعات:** تحليلات مفصلة للمبيعات والإحصائيات

---

## 🔐 المصادقة (Authentication)

### تسجيل مستخدم جديد

- **الطريقة:** `POST`
- **المسار:** `/api/auth/register`
- **الوصف:** إنشاء حساب مستخدم جديد
- **Headers:** `Content-Type: application/json`

#### Request Body:

| الحقل    | النوع  | مطلوب | الوصف                          |
| -------- | ------ | ----- | ------------------------------ |
| name     | String | ✅    | اسم المستخدم (3-50 حرف)        |
| email    | String | ✅    | البريد الإلكتروني              |
| password | String | ✅    | كلمة المرور (6 أحرف على الأقل) |

#### مثال للطلب:

```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "123456"
}
```

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### تسجيل الدخول

- **الطريقة:** `POST`
- **المسار:** `/api/auth/login`
- **الوصف:** تسجيل دخول المستخدم
- **Headers:** `Content-Type: application/json`

#### Request Body:

| الحقل    | النوع  | مطلوب | الوصف             |
| -------- | ------ | ----- | ----------------- |
| email    | String | ✅    | البريد الإلكتروني |
| password | String | ✅    | كلمة المرور       |

#### مثال للطلب:

```json
{
  "email": "ahmed@example.com",
  "password": "123456"
}
```

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### تحديث التوكن

- **الطريقة:** `POST`
- **المسار:** `/api/auth/refresh-token`
- **الوصف:** تحديث توكن المصادقة
- **Headers:** `Content-Type: application/json`

#### Request Body:

| الحقل        | النوع  | مطلوب | الوصف        |
| ------------ | ------ | ----- | ------------ |
| refreshToken | String | ✅    | توكن التحديث |

---

### نسيان كلمة المرور

- **الطريقة:** `POST`
- **المسار:** `/api/auth/forgot-password`
- **الوصف:** إرسال رابط إعادة تعيين كلمة المرور
- **Headers:** `Content-Type: application/json`

#### Request Body:

| الحقل | النوع  | مطلوب | الوصف             |
| ----- | ------ | ----- | ----------------- |
| email | String | ✅    | البريد الإلكتروني |

---

### إعادة تعيين كلمة المرور

- **الطريقة:** `POST`
- **المسار:** `/api/auth/reset-password`
- **الوصف:** إعادة تعيين كلمة المرور باستخدام التوكن
- **Headers:** `Content-Type: application/json`

#### Request Body:

| الحقل    | النوع  | مطلوب | الوصف               |
| -------- | ------ | ----- | ------------------- |
| token    | String | ✅    | توكن إعادة التعيين  |
| password | String | ✅    | كلمة المرور الجديدة |

---

## 👥 المستخدمين (Users)

### جلب جميع المستخدمين (Admin Only)

- **الطريقة:** `GET`
- **المسار:** `/api/users`
- **الوصف:** جلب قائمة جميع المستخدمين
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "01234567890",
      "role": "user",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

---

### جلب مستخدم محدد (Admin Only)

- **الطريقة:** `GET`
- **المسار:** `/api/users/:id`
- **الوصف:** جلب بيانات مستخدم محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "01234567890",
    "address": "شارع النيل، القاهرة",
    "region": "وسط البلد",
    "governorate": "القاهرة",
    "role": "user",
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

---

### تحديث بيانات المستخدم (Admin Only)

- **الطريقة:** `PUT`
- **المسار:** `/api/users/:id`
- **الوصف:** تحديث بيانات مستخدم محدد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف              |
| ----------- | ------ | ----- | ------------------ |
| name        | String | ❌    | اسم المستخدم       |
| email       | String | ❌    | البريد الإلكتروني  |
| phone       | String | ❌    | رقم الهاتف         |
| address     | String | ❌    | العنوان            |
| region      | String | ❌    | المنطقة            |
| governorate | String | ❌    | المحافظة           |
| role        | String | ❌    | الدور (user/admin) |

---

### حذف مستخدم (Admin Only)

- **الطريقة:** `DELETE`
- **المسار:** `/api/users/:id`
- **الوصف:** حذف مستخدم محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

### تحديث الملف الشخصي

- **الطريقة:** `PUT`
- **المسار:** `/api/users/profile/me`
- **الوصف:** تحديث بيانات الملف الشخصي للمستخدم الحالي
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف        |
| ----------- | ------ | ----- | ------------ |
| name        | String | ❌    | اسم المستخدم |
| phone       | String | ❌    | رقم الهاتف   |
| address     | String | ❌    | العنوان      |
| region      | String | ❌    | المنطقة      |
| governorate | String | ❌    | المحافظة     |

---

## 📦 المنتجات (Products)

### جلب جميع المنتجات

- **الطريقة:** `GET`
- **المسار:** `/api/products`
- **الوصف:** جلب قائمة جميع المنتجات المتاحة
- **Headers:** لا يحتاج مصادقة

#### Query Parameters:

| المعامل  | النوع  | مطلوب | الوصف                               |
| -------- | ------ | ----- | ----------------------------------- |
| category | String | ❌    | تصفية حسب الكاتيجوري                |
| search   | String | ❌    | البحث في اسم المنتج                 |
| minPrice | Number | ❌    | الحد الأدنى للسعر                   |
| maxPrice | Number | ❌    | الحد الأقصى للسعر                   |
| page     | Number | ❌    | رقم الصفحة (افتراضي: 1)             |
| limit    | Number | ❌    | عدد العناصر في الصفحة (افتراضي: 10) |

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "هاتف ذكي",
      "description": "هاتف ذكي حديث",
      "price": 5000,
      "stock": 10,
      "category": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "الهواتف"
      },
      "images": [
        {
          "url": "https://res.cloudinary.com/example/image/upload/v1/phone1.jpg",
          "public_id": "phone1"
        }
      ],
      "isActive": true,
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### جلب منتج محدد

- **الطريقة:** `GET`
- **المسار:** `/api/products/:id`
- **الوصف:** جلب بيانات منتج محدد
- **Headers:** لا يحتاج مصادقة

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "هاتف ذكي",
    "description": "هاتف ذكي حديث",
    "price": 5000,
    "stock": 10,
    "category": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "الهواتف"
    },
    "images": [
      {
        "url": "https://res.cloudinary.com/example/image/upload/v1/phone1.jpg",
        "public_id": "phone1"
      }
    ],
    "isActive": true,
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

---

### إنشاء منتج جديد (Admin Only)

- **الطريقة:** `POST`
- **المسار:** `/api/products`
- **الوصف:** إنشاء منتج جديد مع رفع الصور
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **الصلاحيات:** Admin Only
- **ملاحظة:** يدعم رفع صور متعددة (Cloudinary)

#### Request Body (Form Data):

| الحقل       | النوع  | مطلوب | الوصف                  |
| ----------- | ------ | ----- | ---------------------- |
| name        | String | ✅    | اسم المنتج             |
| description | String | ❌    | وصف المنتج             |
| price       | Number | ✅    | سعر المنتج             |
| stock       | Number | ✅    | الكمية المتوفرة        |
| category    | String | ✅    | معرف الكاتيجوري        |
| images      | File[] | ❌    | صور المنتج (حد أقصى 5) |

#### مثال للطلب:

```
Form Data:
- name: "هاتف ذكي جديد"
- description: "هاتف ذكي بمواصفات عالية"
- price: 5000
- stock: 10
- category: "64f1a2b3c4d5e6f7g8h9i0j2"
- images: [file1.jpg, file2.jpg]
```

---

### تحديث منتج (Admin Only)

- **الطريقة:** `PUT`
- **المسار:** `/api/products/:id`
- **الوصف:** تحديث بيانات منتج محدد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع   | مطلوب | الوصف           |
| ----------- | ------- | ----- | --------------- |
| name        | String  | ❌    | اسم المنتج      |
| description | String  | ❌    | وصف المنتج      |
| price       | Number  | ❌    | سعر المنتج      |
| stock       | Number  | ❌    | الكمية المتوفرة |
| category    | String  | ❌    | معرف الكاتيجوري |
| isActive    | Boolean | ❌    | حالة المنتج     |

---

### حذف منتج (Admin Only)

- **الطريقة:** `DELETE`
- **المسار:** `/api/products/:id`
- **الوصف:** حذف منتج محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📂 الكاتيجوريات (Categories)

### جلب جميع الكاتيجوريات

- **الطريقة:** `GET`
- **المسار:** `/api/categories`
- **الوصف:** جلب قائمة جميع الكاتيجوريات
- **Headers:** لا يحتاج مصادقة

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "الهواتف",
      "description": "جميع أنواع الهواتف الذكية",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

---

### جلب كاتيجوري محدد

- **الطريقة:** `GET`
- **المسار:** `/api/categories/:id`
- **الوصف:** جلب بيانات كاتيجوري محدد
- **Headers:** لا يحتاج مصادقة

---

### إنشاء كاتيجوري جديد (Admin Only)

- **الطريقة:** `POST`
- **المسار:** `/api/categories`
- **الوصف:** إنشاء كاتيجوري جديد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف          |
| ----------- | ------ | ----- | -------------- |
| name        | String | ✅    | اسم الكاتيجوري |
| description | String | ❌    | وصف الكاتيجوري |

---

### تحديث كاتيجوري (Admin Only)

- **الطريقة:** `PUT`
- **المسار:** `/api/categories/:id`
- **الوصف:** تحديث بيانات كاتيجوري محدد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف          |
| ----------- | ------ | ----- | -------------- |
| name        | String | ❌    | اسم الكاتيجوري |
| description | String | ❌    | وصف الكاتيجوري |

---

### حذف كاتيجوري (Admin Only)

- **الطريقة:** `DELETE`
- **المسار:** `/api/categories/:id`
- **الوصف:** حذف كاتيجوري محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 🛒 الكارت (Cart)

### جلب الكارت

- **الطريقة:** `GET`
- **المسار:** `/api/cart`
- **الوصف:** جلب محتويات كارت المستخدم
- **Headers:** `Authorization: Bearer <token>`

#### الاستجابة الناجحة (200):

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "items": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
        "product": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "هاتف ذكي",
          "price": 5000,
          "images": [
            {
              "url": "https://res.cloudinary.com/example/image/upload/v1/phone1.jpg"
            }
          ]
        },
        "quantity": 2
      }
    ],
    "totalPrice": 10000,
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

---

### إضافة منتج للكارت

- **الطريقة:** `POST`
- **المسار:** `/api/cart/add`
- **الوصف:** إضافة منتج إلى كارت المستخدم
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

#### Request Body:

| الحقل     | النوع  | مطلوب | الوصف               |
| --------- | ------ | ----- | ------------------- |
| productId | String | ✅    | معرف المنتج         |
| quantity  | Number | ✅    | الكمية (افتراضي: 1) |

#### مثال للطلب:

```json
{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "quantity": 2
}
```

---

### تحديث كمية منتج في الكارت

- **الطريقة:** `PUT`
- **المسار:** `/api/cart/update`
- **الوصف:** تحديث كمية منتج في الكارت
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

#### Request Body:

| الحقل    | النوع  | مطلوب | الوصف                 |
| -------- | ------ | ----- | --------------------- |
| itemId   | String | ✅    | معرف العنصر في الكارت |
| quantity | Number | ✅    | الكمية الجديدة        |

---

### حذف منتج من الكارت

- **الطريقة:** `DELETE`
- **المسار:** `/api/cart/remove/:itemId`
- **الوصف:** حذف منتج من الكارت
- **Headers:** `Authorization: Bearer <token>`

---

### تفريغ الكارت

- **الطريقة:** `DELETE`
- **المسار:** `/api/cart/clear`
- **الوصف:** حذف جميع المنتجات من الكارت
- **Headers:** `Authorization: Bearer <token>`

---

## 📦 الطلبات (Orders)

### إنشاء طلب جديد

- **الطريقة:** `POST`
- **المسار:** `/api/orders`
- **الوصف:** إنشاء طلب جديد من الكارت أو شراء سريع
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

#### Request Body:

| الحقل         | النوع  | مطلوب | الوصف                                 |
| ------------- | ------ | ----- | ------------------------------------- |
| items         | Array  | ❌    | قائمة المنتجات (إذا كان شراء سريع)    |
| address       | String | ✅    | عنوان التوصيل                         |
| paymentMethod | String | ❌    | طريقة الدفع (cash/credit_card/paypal) |

#### مثال للطلب (من الكارت):

```json
{
  "address": "شارع النيل، القاهرة",
  "paymentMethod": "cash"
}
```

#### مثال للطلب (شراء سريع):

```json
{
  "items": [
    {
      "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "quantity": 2
    }
  ],
  "address": "شارع النيل، القاهرة",
  "paymentMethod": "cash"
}
```

#### الاستجابة الناجحة (201):

```json
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "items": [
      {
        "product": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "هاتف ذكي",
          "price": 5000
        },
        "quantity": 2,
        "price": 5000
      }
    ],
    "totalPrice": 10000,
    "status": "pending",
    "paymentMethod": "cash",
    "address": "شارع النيل، القاهرة",
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

---

### جلب طلبات المستخدم

- **الطريقة:** `GET`
- **المسار:** `/api/orders/my-orders`
- **الوصف:** جلب جميع طلبات المستخدم الحالي
- **Headers:** `Authorization: Bearer <token>`

#### Query Parameters:

| المعامل | النوع  | مطلوب | الوصف                 |
| ------- | ------ | ----- | --------------------- |
| status  | String | ❌    | تصفية حسب الحالة      |
| page    | Number | ❌    | رقم الصفحة            |
| limit   | Number | ❌    | عدد العناصر في الصفحة |

---

### جلب طلب محدد للمستخدم

- **الطريقة:** `GET`
- **المسار:** `/api/orders/my-orders/:id`
- **الوصف:** جلب تفاصيل طلب محدد للمستخدم
- **Headers:** `Authorization: Bearer <token>`

---

### جلب جميع الطلبات (Admin Only)

- **الطريقة:** `GET`
- **المسار:** `/api/orders`
- **الوصف:** جلب جميع الطلبات في النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل | النوع  | مطلوب | الوصف                 |
| ------- | ------ | ----- | --------------------- |
| status  | String | ❌    | تصفية حسب الحالة      |
| userId  | String | ❌    | تصفية حسب المستخدم    |
| page    | Number | ❌    | رقم الصفحة            |
| limit   | Number | ❌    | عدد العناصر في الصفحة |

---

### تحديث حالة الطلب (Admin Only)

- **الطريقة:** `PUT`
- **المسار:** `/api/orders/:id/status`
- **الوصف:** تحديث حالة طلب محدد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل  | النوع  | مطلوب | الوصف                                                           |
| ------ | ------ | ----- | --------------------------------------------------------------- |
| status | String | ✅    | الحالة الجديدة (pending/processing/shipped/delivered/cancelled) |

---

### حذف طلب (Admin Only)

- **الطريقة:** `DELETE`
- **المسار:** `/api/orders/:id`
- **الوصف:** حذف طلب محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📅 الحجوزات (Appointments)

### إنشاء حجز جديد

- **الطريقة:** `POST`
- **المسار:** `/api/appointments`
- **الوصف:** إنشاء حجز جديد مع رفع صور
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **ملاحظة:** يدعم رفع صور متعددة

#### Request Body (Form Data):

| الحقل       | النوع  | مطلوب | الوصف                  |
| ----------- | ------ | ----- | ---------------------- |
| serviceType | String | ✅    | نوع الخدمة             |
| date        | String | ✅    | تاريخ الحجز (ISO Date) |
| notes       | String | ❌    | ملاحظات إضافية         |
| images      | File[] | ❌    | صور متعلقة بالحجز      |

#### مثال للطلب:

```
Form Data:
- serviceType: "صيانة هاتف"
- date: "2023-09-15T10:00:00.000Z"
- notes: "مشكلة في الشاشة"
- images: [image1.jpg, image2.jpg]
```

#### الاستجابة الناجحة (201):

```json
{
  "success": true,
  "message": "تم إنشاء الحجز بنجاح",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "serviceType": "صيانة هاتف",
    "date": "2023-09-15T10:00:00.000Z",
    "status": "pending",
    "notes": "مشكلة في الشاشة",
    "images": [
      {
        "url": "https://res.cloudinary.com/example/image/upload/v1/appointment1.jpg",
        "public_id": "appointment1"
      }
    ],
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

---

### جلب حجوزات المستخدم

- **الطريقة:** `GET`
- **المسار:** `/api/appointments/my-appointments`
- **الوصف:** جلب جميع حجوزات المستخدم الحالي
- **Headers:** `Authorization: Bearer <token>`

#### Query Parameters:

| المعامل | النوع  | مطلوب | الوصف                 |
| ------- | ------ | ----- | --------------------- |
| status  | String | ❌    | تصفية حسب الحالة      |
| page    | Number | ❌    | رقم الصفحة            |
| limit   | Number | ❌    | عدد العناصر في الصفحة |

---

### جلب حجز محدد للمستخدم

- **الطريقة:** `GET`
- **المسار:** `/api/appointments/my-appointments/:id`
- **الوصف:** جلب تفاصيل حجز محدد للمستخدم
- **Headers:** `Authorization: Bearer <token>`

---

### تحديث حالة الحجز (Admin Only)

- **الطريقة:** `PUT`
- **المسار:** `/api/appointments/:id/status`
- **الوصف:** تحديث حالة حجز محدد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل  | النوع  | مطلوب | الوصف                                                  |
| ------ | ------ | ----- | ------------------------------------------------------ |
| status | String | ✅    | الحالة الجديدة (pending/confirmed/completed/cancelled) |

---

### حذف حجز (Admin Only)

- **الطريقة:** `DELETE`
- **المسار:** `/api/appointments/:id`
- **الوصف:** حذف حجز محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📊 نماذج البيانات (Data Models)

### نموذج المستخدم (User)

| الحقل               | النوع    | مطلوب | الوصف                        |
| ------------------- | -------- | ----- | ---------------------------- |
| \_id                | ObjectId | ✅    | معرف فريد                    |
| name                | String   | ✅    | اسم المستخدم                 |
| email               | String   | ✅    | البريد الإلكتروني            |
| password            | String   | ✅    | كلمة المرور (مشفرة)          |
| phone               | String   | ❌    | رقم الهاتف                   |
| address             | String   | ❌    | العنوان                      |
| region              | String   | ❌    | المنطقة                      |
| governorate         | String   | ❌    | المحافظة                     |
| role                | String   | ❌    | الدور (user/admin)           |
| provider            | String   | ❌    | مزود المصادقة (local/google) |
| googleId            | String   | ❌    | معرف جوجل                    |
| resetPasswordToken  | String   | ❌    | توكن إعادة تعيين كلمة المرور |
| resetPasswordExpire | Date     | ❌    | تاريخ انتهاء التوكن          |
| refreshTokens       | Array    | ❌    | قائمة توكنات التحديث         |
| createdAt           | Date     | ✅    | تاريخ الإنشاء                |
| updatedAt           | Date     | ✅    | تاريخ التحديث                |

### نموذج المنتج (Product)

| الحقل         | النوع    | مطلوب | الوصف           |
| ------------- | -------- | ----- | --------------- |
| \_id          | ObjectId | ✅    | معرف فريد       |
| name          | String   | ✅    | اسم المنتج      |
| description   | String   | ❌    | وصف المنتج      |
| price         | Number   | ✅    | السعر الأصلي    |
| stock         | Number   | ✅    | الكمية المتوفرة |
| category      | ObjectId | ✅    | معرف الكاتيجوري |
| images        | Array    | ❌    | قائمة الصور     |
| hasDiscount   | Boolean  | ❌    | هل يوجد خصم     |
| discountPrice | Number   | ❌    | سعر الخصم       |
| isActive      | Boolean  | ❌    | حالة المنتج     |
| createdAt     | Date     | ✅    | تاريخ الإنشاء   |
| updatedAt     | Date     | ✅    | تاريخ التحديث   |

### نموذج الكاتيجوري (Category)

| الحقل       | النوع    | مطلوب | الوصف          |
| ----------- | -------- | ----- | -------------- |
| \_id        | ObjectId | ✅    | معرف فريد      |
| name        | String   | ✅    | اسم الكاتيجوري |
| description | String   | ❌    | وصف الكاتيجوري |
| createdAt   | Date     | ✅    | تاريخ الإنشاء  |
| updatedAt   | Date     | ✅    | تاريخ التحديث  |

### نموذج الكارت (Cart)

| الحقل      | النوع    | مطلوب | الوصف          |
| ---------- | -------- | ----- | -------------- |
| \_id       | ObjectId | ✅    | معرف فريد      |
| user       | ObjectId | ✅    | معرف المستخدم  |
| items      | Array    | ❌    | قائمة العناصر  |
| totalPrice | Number   | ✅    | السعر الإجمالي |
| createdAt  | Date     | ✅    | تاريخ الإنشاء  |
| updatedAt  | Date     | ✅    | تاريخ التحديث  |

### نموذج الطلب (Order)

| الحقل         | النوع    | مطلوب | الوصف          |
| ------------- | -------- | ----- | -------------- |
| \_id          | ObjectId | ✅    | معرف فريد      |
| user          | ObjectId | ✅    | معرف المستخدم  |
| items         | Array    | ✅    | قائمة المنتجات |
| totalPrice    | Number   | ✅    | السعر الإجمالي |
| status        | String   | ❌    | حالة الطلب     |
| paymentMethod | String   | ❌    | طريقة الدفع    |
| address       | String   | ✅    | عنوان التوصيل  |
| createdAt     | Date     | ✅    | تاريخ الإنشاء  |
| updatedAt     | Date     | ✅    | تاريخ التحديث  |

### نموذج الحجز (Appointment)

| الحقل       | النوع    | مطلوب | الوصف         |
| ----------- | -------- | ----- | ------------- |
| \_id        | ObjectId | ✅    | معرف فريد     |
| user        | ObjectId | ✅    | معرف المستخدم |
| serviceType | String   | ✅    | نوع الخدمة    |
| date        | Date     | ✅    | تاريخ الحجز   |
| status      | String   | ❌    | حالة الحجز    |
| notes       | String   | ❌    | ملاحظات       |
| images      | Array    | ❌    | قائمة الصور   |
| createdAt   | Date     | ✅    | تاريخ الإنشاء |
| updatedAt   | Date     | ✅    | تاريخ التحديث |

---

## ⚠️ رموز الأخطاء (Error Codes)

| الكود | الوصف                                            |
| ----- | ------------------------------------------------ |
| 400   | Bad Request - بيانات غير صحيحة                   |
| 401   | Unauthorized - غير مصرح                          |
| 403   | Forbidden - محظور                                |
| 404   | Not Found - غير موجود                            |
| 409   | Conflict - تعارض في البيانات                     |
| 422   | Unprocessable Entity - بيانات غير قابلة للمعالجة |
| 429   | Too Many Requests - طلبات كثيرة                  |
| 500   | Internal Server Error - خطأ في الخادم            |

---

## 🔧 ملاحظات تقنية

### المصادقة

- جميع الطلبات المحمية تتطلب `Authorization: Bearer <token>` في الهيدر
- التوكن صالح لمدة محددة ويجب تحديثه
- بعض الطلبات تتطلب صلاحيات Admin

### رفع الملفات

- يدعم رفع صور متعددة للمنتجات والحجوزات
- يتم رفع الصور إلى Cloudinary
- الحد الأقصى للملفات: 5 ملفات للمنتجات

### التصفية والبحث

- معظم قوائم البيانات تدعم التصفية والبحث
- تدعم الصفحات (Pagination) للقوائم الطويلة
- يمكن تصفية النتائج حسب الحالة والتاريخ

### التحقق من البيانات

- جميع المدخلات يتم التحقق منها
- رسائل خطأ واضحة باللغة العربية
- تحقق من صحة البريد الإلكتروني وأرقام الهواتف

### نظام الخصومات

- دعم خصومات على المنتجات الفردية
- خصومات جماعية على الكاتيجوريات
- التحقق من صحة أسعار الخصم (أقل من السعر الأصلي)
- إمكانية إلغاء الخصومات

### لوحة تحكم الأدمن

- إحصائيات شاملة عن النظام
- تقارير مبيعات مفصلة
- إدارة متقدمة لجميع الكيانات
- تصفية وبحث متقدم في جميع القوائم

---

## 🚀 بدء الاستخدام

1. **تسجيل حساب جديد:**

   ```
   POST /api/auth/register
   ```

2. **تسجيل الدخول:**

   ```
   POST /api/auth/login
   ```

3. **استخدام التوكن في الطلبات:**

   ```
   Authorization: Bearer <your-token>
   ```

4. **استكشاف المنتجات:**

   ```
   GET /api/products
   ```

5. **إضافة منتج للكارت:**

   ```
   POST /api/cart/add
   ```

6. **إنشاء طلب:**

   ```
   POST /api/orders
   ```

7. **حجز موعد:**
   ```
   POST /api/appointments
   ```

---

## 👨‍💼 لوحة تحكم الأدمن (Admin Dashboard)

### نظرة عامة على النظام

- **الطريقة:** `GET`
- **المسار:** `/api/admin/overview`
- **الوصف:** إحصائيات عامة عن النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### الاستجابة الناجحة (200):

```json
{
  "counts": {
    "users": 150,
    "products": 45,
    "orders": 89,
    "appointments": 23
  },
  "salesTotal": 125000,
  "last7Days": [
    {
      "_id": "2023-09-01",
      "total": 15000,
      "orders": 12
    },
    {
      "_id": "2023-09-02",
      "total": 18000,
      "orders": 15
    }
  ]
}
```

---

### تقرير المبيعات

- **الطريقة:** `GET`
- **المسار:** `/api/admin/reports/sales`
- **الوصف:** تقرير مفصل عن المبيعات
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل  | النوع  | مطلوب | الوصف                           |
| -------- | ------ | ----- | ------------------------------- |
| dateFrom | String | ❌    | تاريخ البداية (ISO)             |
| dateTo   | String | ❌    | تاريخ النهاية (ISO)             |
| groupBy  | String | ❌    | تجميع البيانات (day/month/year) |

#### الاستجابة الناجحة (200):

```json
{
  "groupBy": "day",
  "data": [
    {
      "_id": "2023-09-01",
      "total": 15000,
      "orders": 12
    }
  ]
}
```

---

## 👥 إدارة المستخدمين (Admin)

### قائمة المستخدمين

- **الطريقة:** `GET`
- **المسار:** `/api/admin/users`
- **الوصف:** جلب قائمة المستخدمين مع تصفية وبحث
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل | النوع  | مطلوب | الوصف                        |
| ------- | ------ | ----- | ---------------------------- |
| search  | String | ❌    | البحث في الاسم/البريد/الهاتف |
| role    | String | ❌    | تصفية حسب الدور (user/admin) |
| page    | Number | ❌    | رقم الصفحة                   |
| limit   | Number | ❌    | عدد العناصر                  |
| sort    | String | ❌    | ترتيب النتائج                |

#### الاستجابة الناجحة (200):

```json
{
  "items": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "01234567890",
      "role": "user",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 5,
  "total": 150
}
```

---

### تفاصيل مستخدم محدد

- **الطريقة:** `GET`
- **المسار:** `/api/admin/users/:id`
- **الوصف:** جلب تفاصيل كاملة لمستخدم مع كارت وطلباته
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### الاستجابة الناجحة (200):

```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "01234567890",
  "address": "شارع النيل، القاهرة",
  "role": "user",
  "cart": {
    "items": [
      {
        "product": {
          "name": "هاتف ذكي",
          "price": 5000
        },
        "quantity": 2
      }
    ]
  },
  "orders": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "totalPrice": 10000,
      "status": "delivered"
    }
  ],
  "appointments": []
}
```

---

### تحديث بيانات المستخدم

- **الطريقة:** `PUT`
- **المسار:** `/api/admin/users/:id`
- **الوصف:** تحديث بيانات المستخدم
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف              |
| ----------- | ------ | ----- | ------------------ |
| name        | String | ❌    | اسم المستخدم       |
| email       | String | ❌    | البريد الإلكتروني  |
| phone       | String | ❌    | رقم الهاتف         |
| address     | String | ❌    | العنوان            |
| region      | String | ❌    | المنطقة            |
| governorate | String | ❌    | المحافظة           |
| role        | String | ❌    | الدور (user/admin) |

---

### حذف مستخدم

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/users/:id`
- **الوصف:** حذف مستخدم من النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📂 إدارة الكاتيجوريات (Admin)

### قائمة الكاتيجوريات

- **الطريقة:** `GET`
- **المسار:** `/api/admin/categories`
- **الوصف:** جلب قائمة الكاتيجوريات
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل | النوع  | مطلوب | الوصف         |
| ------- | ------ | ----- | ------------- |
| sort    | String | ❌    | ترتيب النتائج |

---

### إنشاء كاتيجوري جديد

- **الطريقة:** `POST`
- **المسار:** `/api/admin/categories`
- **الوصف:** إنشاء كاتيجوري جديد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف          |
| ----------- | ------ | ----- | -------------- |
| name        | String | ✅    | اسم الكاتيجوري |
| description | String | ❌    | وصف الكاتيجوري |

---

### تحديث كاتيجوري

- **الطريقة:** `PUT`
- **المسار:** `/api/admin/categories/:id`
- **الوصف:** تحديث بيانات كاتيجوري
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف          |
| ----------- | ------ | ----- | -------------- |
| name        | String | ❌    | اسم الكاتيجوري |
| description | String | ❌    | وصف الكاتيجوري |

---

### حذف كاتيجوري

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/categories/:id`
- **الوصف:** حذف كاتيجوري (إذا لم يكن مستخدماً)
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📦 إدارة المنتجات (Admin)

### قائمة المنتجات

- **الطريقة:** `GET`
- **المسار:** `/api/admin/products`
- **الوصف:** جلب قائمة المنتجات مع تصفية متقدمة
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل     | النوع   | مطلوب | الوصف                 |
| ----------- | ------- | ----- | --------------------- |
| search      | String  | ❌    | البحث في الاسم والوصف |
| category    | String  | ❌    | تصفية حسب الكاتيجوري  |
| isActive    | Boolean | ❌    | تصفية حسب الحالة      |
| hasDiscount | Boolean | ❌    | تصفية حسب وجود خصم    |
| minPrice    | Number  | ❌    | الحد الأدنى للسعر     |
| maxPrice    | Number  | ❌    | الحد الأقصى للسعر     |
| page        | Number  | ❌    | رقم الصفحة            |
| limit       | Number  | ❌    | عدد العناصر           |
| sort        | String  | ❌    | ترتيب النتائج         |

#### الاستجابة الناجحة (200):

```json
{
  "items": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "هاتف ذكي",
      "description": "هاتف ذكي حديث",
      "price": 5000,
      "discountPrice": 4500,
      "hasDiscount": true,
      "stock": 10,
      "isActive": true,
      "category": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "الهواتف"
      }
    }
  ],
  "page": 1,
  "totalPages": 3,
  "total": 45
}
```

---

### تفاصيل منتج محدد

- **الطريقة:** `GET`
- **المسار:** `/api/admin/products/:id`
- **الوصف:** جلب تفاصيل منتج محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

### إنشاء منتج جديد

- **الطريقة:** `POST`
- **المسار:** `/api/admin/products`
- **الوصف:** إنشاء منتج جديد
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل         | النوع   | مطلوب | الوصف           |
| ------------- | ------- | ----- | --------------- |
| name          | String  | ✅    | اسم المنتج      |
| description   | String  | ❌    | وصف المنتج      |
| price         | Number  | ✅    | السعر الأصلي    |
| discountPrice | Number  | ❌    | سعر الخصم       |
| hasDiscount   | Boolean | ❌    | هل يوجد خصم     |
| stock         | Number  | ✅    | الكمية المتوفرة |
| category      | String  | ✅    | معرف الكاتيجوري |
| isActive      | Boolean | ❌    | حالة المنتج     |

#### مثال للطلب:

```json
{
  "name": "هاتف ذكي جديد",
  "description": "هاتف ذكي بمواصفات عالية",
  "price": 5000,
  "discountPrice": 4500,
  "hasDiscount": true,
  "stock": 10,
  "category": "64f1a2b3c4d5e6f7g8h9i0j2",
  "isActive": true
}
```

---

### تحديث منتج

- **الطريقة:** `PUT`
- **المسار:** `/api/admin/products/:id`
- **الوصف:** تحديث بيانات منتج
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل         | النوع   | مطلوب | الوصف           |
| ------------- | ------- | ----- | --------------- |
| name          | String  | ❌    | اسم المنتج      |
| description   | String  | ❌    | وصف المنتج      |
| price         | Number  | ❌    | السعر الأصلي    |
| discountPrice | Number  | ❌    | سعر الخصم       |
| hasDiscount   | Boolean | ❌    | هل يوجد خصم     |
| stock         | Number  | ❌    | الكمية المتوفرة |
| category      | String  | ❌    | معرف الكاتيجوري |
| isActive      | Boolean | ❌    | حالة المنتج     |

---

### حذف منتج

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/products/:id`
- **الوصف:** حذف منتج من النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

### تطبيق خصم على كاتيجوري

- **الطريقة:** `POST`
- **المسار:** `/api/admin/products/discount/category/:categoryId`
- **الوصف:** تطبيق خصم على جميع منتجات كاتيجوري معينة
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل         | النوع  | مطلوب | الوصف            |
| ------------- | ------ | ----- | ---------------- |
| discountPrice | Number | ✅    | سعر الخصم الجديد |

#### مثال للطلب:

```json
{
  "discountPrice": 4500
}
```

#### الاستجابة الناجحة (200):

```json
{
  "message": "Discount applied to 15 products in الهواتف",
  "modifiedCount": 15
}
```

---

### إلغاء الخصم من كاتيجوري

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/products/discount/category/:categoryId`
- **الوصف:** إلغاء الخصم من جميع منتجات كاتيجوري معينة
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### الاستجابة الناجحة (200):

```json
{
  "message": "Discount removed from 15 products",
  "modifiedCount": 15
}
```

---

## 📦 إدارة الطلبات (Admin)

### قائمة الطلبات

- **الطريقة:** `GET`
- **المسار:** `/api/admin/orders`
- **الوصف:** جلب قائمة الطلبات مع تصفية متقدمة
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل  | النوع  | مطلوب | الوصف              |
| -------- | ------ | ----- | ------------------ |
| status   | String | ❌    | تصفية حسب الحالة   |
| userId   | String | ❌    | تصفية حسب المستخدم |
| dateFrom | String | ❌    | تاريخ البداية      |
| dateTo   | String | ❌    | تاريخ النهاية      |
| minTotal | Number | ❌    | الحد الأدنى للمبلغ |
| maxTotal | Number | ❌    | الحد الأقصى للمبلغ |
| page     | Number | ❌    | رقم الصفحة         |
| limit    | Number | ❌    | عدد العناصر        |
| sort     | String | ❌    | ترتيب النتائج      |

#### الاستجابة الناجحة (200):

```json
{
  "items": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "user": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "01234567890"
      },
      "items": [
        {
          "product": {
            "name": "هاتف ذكي",
            "price": 5000,
            "discountPrice": 4500,
            "hasDiscount": true
          },
          "quantity": 2,
          "price": 4500
        }
      ],
      "totalPrice": 9000,
      "status": "delivered",
      "paymentMethod": "cash",
      "address": "شارع النيل، القاهرة",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 5,
  "total": 89
}
```

---

### تفاصيل طلب محدد

- **الطريقة:** `GET`
- **المسار:** `/api/admin/orders/:id`
- **الوصف:** جلب تفاصيل طلب محدد مع بيانات المستخدم
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

### تحديث طلب

- **الطريقة:** `PUT`
- **المسار:** `/api/admin/orders/:id`
- **الوصف:** تحديث بيانات طلب
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل         | النوع  | مطلوب | الوصف         |
| ------------- | ------ | ----- | ------------- |
| status        | String | ❌    | حالة الطلب    |
| address       | String | ❌    | عنوان التوصيل |
| paymentMethod | String | ❌    | طريقة الدفع   |

---

### حذف طلب

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/orders/:id`
- **الوصف:** حذف طلب من النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

## 📅 إدارة الحجوزات (Admin)

### قائمة الحجوزات

- **الطريقة:** `GET`
- **المسار:** `/api/admin/appointments`
- **الوصف:** جلب قائمة الحجوزات مع تصفية متقدمة
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

#### Query Parameters:

| المعامل     | النوع  | مطلوب | الوصف                |
| ----------- | ------ | ----- | -------------------- |
| status      | String | ❌    | تصفية حسب الحالة     |
| userId      | String | ❌    | تصفية حسب المستخدم   |
| serviceType | String | ❌    | تصفية حسب نوع الخدمة |
| dateFrom    | String | ❌    | تاريخ البداية        |
| dateTo      | String | ❌    | تاريخ النهاية        |
| page        | Number | ❌    | رقم الصفحة           |
| limit       | Number | ❌    | عدد العناصر          |
| sort        | String | ❌    | ترتيب النتائج        |

#### الاستجابة الناجحة (200):

```json
{
  "items": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "user": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "01234567890"
      },
      "serviceType": "صيانة هاتف",
      "date": "2023-09-15T10:00:00.000Z",
      "status": "confirmed",
      "notes": "مشكلة في الشاشة",
      "images": [
        {
          "url": "https://res.cloudinary.com/example/image/upload/v1/appointment1.jpg"
        }
      ],
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 2,
  "total": 23
}
```

---

### تفاصيل حجز محدد

- **الطريقة:** `GET`
- **المسار:** `/api/admin/appointments/:id`
- **الوصف:** جلب تفاصيل حجز محدد
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

### تحديث حجز

- **الطريقة:** `PUT`
- **المسار:** `/api/admin/appointments/:id`
- **الوصف:** تحديث بيانات حجز
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **الصلاحيات:** Admin Only

#### Request Body:

| الحقل       | النوع  | مطلوب | الوصف       |
| ----------- | ------ | ----- | ----------- |
| serviceType | String | ❌    | نوع الخدمة  |
| date        | String | ❌    | تاريخ الحجز |
| status      | String | ❌    | حالة الحجز  |
| notes       | String | ❌    | ملاحظات     |
| images      | Array  | ❌    | قائمة الصور |

---

### حذف حجز

- **الطريقة:** `DELETE`
- **المسار:** `/api/admin/appointments/:id`
- **الوصف:** حذف حجز من النظام
- **Headers:** `Authorization: Bearer <token>`
- **الصلاحيات:** Admin Only

---

8. **لوحة تحكم الأدمن:**
   ```
   GET /api/admin/overview
   ```
