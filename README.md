# phonX-backend

## نظرة عامة

Backend لــ PhoneX: متجر إلكتروني مع نظام حجوزات وصلاحيات أدمن.

- **البيئة**: Node.js + Express + MongoDB (Mongoose)
- **الأمان**: JWT, Rate Limiting, Validation, CORS
- **الملفات**: رفع صور عبر Cloudinary و Multer

## روابط مهمة

- Base URL: `https://phonex-backend-abdlrhmansaid-abdelrhmans-projects-6b934fd9.vercel.app/`
- Health: `GET /health`
- Docs: `GET /docs` أو `GET /docs.md`

## خريطة الراوتات السريعة

- **Auth `/api/auth`**: `POST /register`, `POST /login`, `POST /refresh-token`, `POST /forgot-password`, `POST /reset-password`
- **Users `/api/users`**: `GET /` (Admin), `GET /:id` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin), `PUT /profile/me` (Auth)
- **Categories `/api/categories`**: `GET /`, `GET /:id`, `POST /` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin)
- **Products `/api/products`**: `GET /`, `GET /:id`, `POST /` (Admin, images), `PUT /:id` (Admin), `DELETE /:id` (Admin), `POST /discount/category/:categoryId` (Admin)
- **Cart `/api/cart`** (Auth): `GET /`, `POST /add`, `PUT /update`, `DELETE /remove/:itemId`, `DELETE /clear`
- **Orders `/api/orders`**: `POST /` (Auth), `GET /my-orders` (Auth), `GET /my-orders/:id` (Auth), `GET /` (Admin), `PUT /:id/status` (Admin), `DELETE /:id` (Admin)
- **Appointments `/api/appointments`**: `POST /` (Auth, images), `GET /my-appointments` (Auth), `GET /my-appointments/:id` (Auth), `PUT /:id/status` (Admin), `DELETE /:id` (Admin)
- **Admin `/api/admin`** (Protected + Admin):
  - Overview: `GET /overview`, Reports: `GET /reports/sales`
  - Users: `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`
  - Categories: `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
  - Products: `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`, `POST /products/discount/category/:categoryId`, `DELETE /products/discount/category/:categoryId`
  - Orders: `GET /orders`, `GET /orders/:id`, `PUT /orders/:id`, `DELETE /orders/:id`
  - Appointments: `GET /appointments`, `GET /appointments/:id`, `PUT /appointments/:id`, `DELETE /appointments/:id`

## التشغيل محليًا

1. انسخ `.env` (راجع `config/db.js` و `config/cloudinary.js`) واضبط المتغيرات:
   - `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `NODE_ENV`
2. تثبيت الحزم:
   ```
   npm install
   ```
3. التشغيل للتطوير:
   ```
   npm run dev
   ```
4. التشغيل للإنتاج:
   ```
   npm start
   ```
