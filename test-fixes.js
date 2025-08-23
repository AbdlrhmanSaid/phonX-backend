// ملف اختبار الإصلاحات الجديدة
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// بيانات الاختبار
const testUser = {
  name: "Test User Manual",
  email: "test-manual@example.com",
  phone: "01234567890",
  password: "123456",
};

const googleUser = {
  name: "Google User",
  email: "google-test@example.com",
  googleId: "google123",
  image: "https://example.com/image.jpg",
  phone: "01123456789", // إضافة رقم هاتف
  password: "googlepass123", // إضافة كلمة مرور
};

let authToken = "";

// اختبار التسجيل اليدوي
async function testManualRegister() {
  console.log("🧪 اختبار التسجيل اليدوي...");
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log(
      "✅ التسجيل اليدوي نجح:",
      response.data.message || "تم التسجيل بنجاح"
    );
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log("⚠️ المستخدم موجود بالفعل، جاري تسجيل الدخول...");
      return await testManualLogin();
    }
    console.error(
      "❌ فشل التسجيل اليدوي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تسجيل الدخول اليدوي
async function testManualLogin() {
  console.log("🧪 اختبار تسجيل الدخول اليدوي...");
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log("✅ تسجيل الدخول اليدوي نجح");
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ فشل تسجيل الدخول اليدوي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تحديث رقم الهاتف للمستخدم اليدوي
async function testUpdatePhoneManual(token) {
  console.log("🧪 اختبار تحديث رقم الهاتف للمستخدم اليدوي...");
  try {
    const updateData = {
      phone: "01987654321", // رقم هاتف جديد
    };

    const response = await axios.put(
      `${API_URL}/users/profile/me`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ تحديث رقم الهاتف للمستخدم اليدوي نجح");
    console.log("البيانات المحدثة:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل تحديث رقم الهاتف للمستخدم اليدوي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تسجيل الدخول بجوجل مع بيانات إضافية
async function testGoogleAuthWithData() {
  console.log("🧪 اختبار تسجيل الدخول بجوجل مع بيانات إضافية...");
  try {
    const response = await axios.post(`${API_URL}/auth/google`, googleUser);
    console.log("✅ تسجيل الدخول بجوجل مع بيانات إضافية نجح");
    console.log("بيانات المستخدم:", response.data.user);
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ فشل تسجيل الدخول بجوجل مع بيانات إضافية:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تحديث بيانات مستخدم جوجل
async function testUpdateGoogleUser(token) {
  console.log("🧪 اختبار تحديث بيانات مستخدم جوجل...");
  try {
    const updateData = {
      phone: "01555123456",
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
    console.log("✅ تحديث بيانات مستخدم جوجل نجح");
    console.log("البيانات المحدثة:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل تحديث بيانات مستخدم جوجل:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار فحص إكمال الملف الشخصي
async function testProfileCompletion(token) {
  console.log("🧪 اختبار فحص إكمال الملف الشخصي...");
  try {
    const response = await axios.get(`${API_URL}/users/profile/completion`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ فحص إكمال الملف الشخصي نجح");
    console.log("حالة الإكمال:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل فحص إكمال الملف الشخصي:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  console.log("🚀 بدء اختبار الإصلاحات الجديدة...\n");

  // اختبار المستخدم اليدوي
  console.log("=== اختبار المستخدم اليدوي ===");
  const manualToken = await testManualRegister();
  if (manualToken) {
    await testUpdatePhoneManual(manualToken);
  }

  console.log("\n=== اختبار مستخدم جوجل ===");
  const googleToken = await testGoogleAuthWithData();
  if (googleToken) {
    await testUpdateGoogleUser(googleToken);
    await testProfileCompletion(googleToken);
  }

  console.log("\n✅ تم الانتهاء من جميع الاختبارات!");
}

// تشغيل الاختبارات
runAllTests().catch(console.error);
