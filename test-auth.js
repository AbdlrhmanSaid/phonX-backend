// ملف اختبار شامل لنظام المصادقة
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// بيانات الاختبار
const testUser = {
  name: "Test User",
  email: "test@example.com",
  phone: "01234567890",
  password: "123456",
};

const googleUser = {
  name: "Google User",
  email: "google@example.com",
  googleId: "google123",
  image: "https://example.com/image.jpg",
};

let authToken = "";

// اختبار التسجيل
async function testRegister() {
  console.log("🧪 اختبار التسجيل...");
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log("✅ التسجيل نجح:", response.data.message || "تم التسجيل بنجاح");
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log("⚠️ المستخدم موجود بالفعل، جاري تسجيل الدخول...");
      return await testLogin();
    }
    console.error(
      "❌ فشل التسجيل:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تسجيل الدخول
async function testLogin() {
  console.log("🧪 اختبار تسجيل الدخول...");
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log("✅ تسجيل الدخول نجح");
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ فشل تسجيل الدخول:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تحديث الملف الشخصي
async function testUpdateProfile(token) {
  console.log("🧪 اختبار تحديث الملف الشخصي...");
  try {
    const updateData = {
      phone: "01123456789",
      governorate: "القاهرة",
      region: "المعادي",
      address: "شارع النيل",
    };

    const response = await axios.put(
      `${API_URL}/users/profile/me`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ تحديث الملف الشخصي نجح");
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل تحديث الملف الشخصي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار إضافة كلمة مرور لمستخدم جوجل
async function testAddPasswordToGoogleUser(token) {
  console.log("🧪 اختبار إضافة كلمة مرور لمستخدم جوجل...");
  try {
    const updateData = {
      password: "newpassword123",
    };

    const response = await axios.put(
      `${API_URL}/users/profile/me`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ إضافة كلمة المرور نجحت");
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل إضافة كلمة المرور:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار جوجل أوث
async function testGoogleAuth() {
  console.log("🧪 اختبار جوجل أوث...");
  try {
    const response = await axios.post(`${API_URL}/auth/google`, googleUser);
    console.log("✅ جوجل أوث نجح");
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ فشل جوجل أوث:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار منع دمج الحسابات
async function testPreventAccountMerge() {
  console.log("🧪 اختبار منع دمج الحسابات...");
  try {
    // محاولة إنشاء حساب جديد بنفس البريد الإلكتروني
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: "Another User",
      email: testUser.email, // نفس البريد الإلكتروني
      phone: "01234567891",
      password: "123456",
    });
    console.log("❌ يجب أن يفشل هذا الاختبار");
  } catch (error) {
    if (error.response?.status === 400) {
      console.log("✅ منع دمج الحسابات يعمل بشكل صحيح");
    } else {
      console.error(
        "❌ خطأ غير متوقع:",
        error.response?.data?.message || error.message
      );
    }
  }
}

// اختبار جلب الملف الشخصي
async function testGetProfile(token) {
  console.log("🧪 اختبار جلب الملف الشخصي...");
  try {
    const response = await axios.get(`${API_URL}/users/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ جلب الملف الشخصي نجح");
    console.log("📋 بيانات المستخدم:", {
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      provider: response.data.provider,
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل جلب الملف الشخصي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  console.log("🚀 بدء اختبارات نظام المصادقة...\n");

  // اختبار التسجيل وتسجيل الدخول
  authToken = await testRegister();
  if (!authToken) {
    console.log("❌ فشل في الحصول على توكن المصادقة");
    return;
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // اختبار تحديث الملف الشخصي
  await testUpdateProfile(authToken);

  console.log("\n" + "=".repeat(50) + "\n");

  // اختبار جلب الملف الشخصي
  await testGetProfile(authToken);

  console.log("\n" + "=".repeat(50) + "\n");

  // اختبار منع دمج الحسابات
  await testPreventAccountMerge();

  console.log("\n" + "=".repeat(50) + "\n");

  // اختبار جوجل أوث
  const googleToken = await testGoogleAuth();
  if (googleToken) {
    await testAddPasswordToGoogleUser(googleToken);
  }

  console.log("\n✅ انتهت جميع الاختبارات");
}

// تشغيل الاختبارات إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testRegister,
  testLogin,
  testUpdateProfile,
  testGoogleAuth,
  testPreventAccountMerge,
  testGetProfile,
};
