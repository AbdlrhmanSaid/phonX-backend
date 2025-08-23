// ملف اختبار نهائي للإصلاحات
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// بيانات الاختبار
const testUser = {
  name: "Test User Final",
  email: "test-final@example.com",
  phone: "01234567890",
  password: "123456",
};

const googleUser = {
  name: "Google User Final",
  email: "google-final@example.com",
  googleId: "google456",
  image: "https://example.com/image.jpg",
};

let manualToken = "";
let googleToken = "";

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

// اختبار تسجيل الدخول بجوجل
async function testGoogleAuth() {
  console.log("🧪 اختبار تسجيل الدخول بجوجل...");
  try {
    const response = await axios.post(`${API_URL}/auth/google`, googleUser);
    console.log("✅ تسجيل الدخول بجوجل نجح");
    console.log("بيانات المستخدم:", response.data.user);
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ فشل تسجيل الدخول بجوجل:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار إضافة كلمة مرور لمستخدم جوجل
async function testAddPasswordToGoogle(token) {
  console.log("🧪 اختبار إضافة كلمة مرور لمستخدم جوجل...");
  try {
    const updateData = {
      password: "googlepass123",
    };

    const response = await axios.put(
      `${API_URL}/users/profile/me`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ إضافة كلمة مرور لمستخدم جوجل نجح");
    console.log("البيانات المحدثة:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل إضافة كلمة مرور لمستخدم جوجل:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// اختبار تحديث رقم الهاتف لمستخدم جوجل
async function testUpdatePhoneGoogle(token) {
  console.log("🧪 اختبار تحديث رقم الهاتف لمستخدم جوجل...");
  try {
    const updateData = {
      phone: "01555123456",
    };

    const response = await axios.put(
      `${API_URL}/users/profile/me`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ تحديث رقم الهاتف لمستخدم جوجل نجح");
    console.log("البيانات المحدثة:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل تحديث رقم الهاتف لمستخدم جوجل:",
      error.response?.data?.message || error.message
    );
    return null;
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
    console.log("بيانات المستخدم:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ فشل جلب الملف الشخصي:",
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
  console.log("🚀 بدء اختبار الإصلاحات النهائية...\n");

  // اختبار المستخدم اليدوي
  console.log("=== اختبار المستخدم اليدوي ===");
  manualToken = await testManualRegister();
  if (manualToken) {
    await testGetProfile(manualToken);
    await testUpdatePhoneManual(manualToken);
    await testGetProfile(manualToken); // تأكيد التحديث
  }

  console.log("\n=== اختبار مستخدم جوجل ===");
  googleToken = await testGoogleAuth();
  if (googleToken) {
    await testGetProfile(googleToken);
    await testUpdatePhoneGoogle(googleToken);
    await testAddPasswordToGoogle(googleToken);
    await testGetProfile(googleToken); // تأكيد التحديث
    await testProfileCompletion(googleToken);
  }

  console.log("\n✅ تم الانتهاء من جميع الاختبارات!");
  console.log("\n📊 ملخص النتائج:");
  console.log(`- المستخدم اليدوي: ${manualToken ? "✅ نجح" : "❌ فشل"}`);
  console.log(`- مستخدم جوجل: ${googleToken ? "✅ نجح" : "❌ فشل"}`);
}

// تشغيل الاختبارات
runAllTests().catch(console.error);
