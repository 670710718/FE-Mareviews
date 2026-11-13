
// ==========================================
// Mareview - Backend API
// ชั้นกลางสำหรับติดต่อ Backend
// รองรับ GET / POST / PUT / DELETE และ JWT
// ==========================================

// Backend URL จากไฟล์ .env
const BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// ==========================================
// ฟังก์ชันกลางสำหรับเรียก API
// ==========================================

export async function apiFetch(
  path,
  { method = 'GET', body, token } = {}
) {
  const url = `${BASE}/${path.replace(/^\/+/, '')}`;

  const headers = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;

  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const err = new Error(
      'ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือสถานะ Server'
    );

    err.cause = error;
    throw err;
  }

  // กรณีลบสำเร็จ ไม่มี Response Body
  if (res.status === 204) {
    return null;
  }

  // อ่าน Response
  const data = await res.json().catch(() => null);

  // กรณี Server ตอบกลับด้วย Error
  if (!res.ok) {
    const message =
      data?.error?.message ??
      data?.error ??
      data?.message ??
      `Server ตอบกลับ ${res.status}`;

    const err = new Error(
      typeof message === 'string'
        ? message
        : 'เกิดข้อผิดพลาดจาก Server'
    );

    err.status = res.status;
    err.data = data;

    throw err;
  }

  // กรณี Server ไม่ได้ตอบ JSON
  if (data === null) {
    throw new Error('Server ไม่ได้ตอบกลับเป็น JSON');
  }

  return data;
}

// ==========================================
// สมาชิก (Authentication)
// ==========================================

// สมัครสมาชิก
export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: {
      email,
      password,
      displayName,
    },
  });
}

// เข้าสู่ระบบ
export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: {
      email,
      password,
    },
  });
}

// ดึงข้อมูลสมาชิกที่เข้าสู่ระบบ
export function getMe(token) {
  return apiFetch('/api/me', { token });
}

// ==========================================
// หอพัก (Dormitories)
// ==========================================

// ดึงรายการหอพัก
// รองรับการค้นหาผ่าน ?q=คำค้น
export function getDormitories(query = '') {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set('q', query.trim());
  }

  const suffix = params.toString()
    ? `?${params.toString()}`
    : '';

  return apiFetch(`/api/dormitories${suffix}`);
}

// ดึงรายการหอพักพร้อมตัวกรอง
// Backend ต้องรองรับ Query Parameters ก่อน
export function filterDormitories({
  query = '',
  dormType = '',
  genderType = '',
} = {}) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set('q', query.trim());
  }

  if (dormType && dormType !== 'all') {
    params.set('dormType', dormType);
  }

  if (genderType && genderType !== 'all') {
    params.set('genderType', genderType);
  }

  const suffix = params.toString()
    ? `?${params.toString()}`
    : '';

  return apiFetch(`/api/dormitories${suffix}`);
}

// ดึงรายละเอียดหอพัก
export function getDormitory(dormitoryId) {
  return apiFetch(`/api/dormitories/${dormitoryId}`);
}

// ==========================================
// รีวิว (Reviews)
// ==========================================

// ดึงรีวิวของหอพัก
export function getReviews(dormitoryId) {
  return apiFetch(`/api/dormitories/${dormitoryId}/reviews`);
}

// เพิ่มรีวิว
// คะแนนรีวิวใช้ระบบ 1-10
export function postReview(dormitoryId, text, rating, token) {
  return apiFetch(`/api/dormitories/${dormitoryId}/reviews`, {
    method: 'POST',
    body: {
      text,
      rating,
    },
    token,
  });
}

// ลบรีวิวของสมาชิก
export function deleteReview(reviewId, token) {
  return apiFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    token,
  });
}

// ==========================================
// คะแนนหอพัก (Dormitory Rating)
// ==========================================

// คะแนนหอพักระบบเดิม 1-10
export function putDormitoryRating(dormitoryId, score, token) {
  return apiFetch(`/api/dormitories/${dormitoryId}/rating`, {
    method: 'PUT',
    body: {
      score,
    },
    token,
  });
}

// ==========================================
// Wishlist
// ==========================================

// ดึงรายการหอพักที่บันทึกไว้
export async function getWishlist(token) {
  const data = await apiFetch('/api/me/wishlist', { token });

  return Array.isArray(data)
    ? data
    : data?.items ?? [];
}

// เพิ่มหอพักในรายการที่บันทึก
export function addToWishlist(dormitoryId, token) {
  return apiFetch(`/api/dormitories/${dormitoryId}/wishlist`, {
    method: 'POST',
    token,
  });
}

// ลบหอพักออกจากรายการที่บันทึก
export function removeFromWishlist(dormitoryId, token) {
  return apiFetch(`/api/dormitories/${dormitoryId}/wishlist`, {
    method: 'DELETE',
    token,
  });
}

// ==========================================
// ประเภทหอพัก
// ==========================================

// ดึงประเภทหอพัก เช่น หอใน / หอนอก
export async function getDormitoryTypes() {
  const data = await apiFetch('/api/dormitory-types');

  return Array.isArray(data)
    ? data
    : data?.items ?? [];
}

// ดึงประเภทเพศ เช่น ชาย / หญิง / รวม
export async function getGenderTypes() {
  const data = await apiFetch('/api/gender-types');

  return Array.isArray(data)
    ? data
    : data?.items ?? [];
}

// ==========================================
// Admin
// ==========================================

// สถิติ Dashboard
export function getAdminStats(token) {
  return apiFetch('/api/admin/stats', { token });
}

// ==========================================
// Admin - Reviews
// Admin ดูและลบรีวิวได้เท่านั้น
// ไม่มีฟังก์ชันแก้ไขข้อความหรือคะแนน
// ==========================================

// ดึงรีวิวทั้งหมดสำหรับ Admin
export async function getAdminReviews(token) {
  const data = await apiFetch('/api/admin/reviews', { token });

  return Array.isArray(data)
    ? data
    : data?.items ?? data?.reviews ?? [];
}

// ลบรีวิวโดย Admin
export function deleteAdminReview(reviewId, token) {
  return apiFetch(`/api/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    token,
  });
}

// ==========================================
// Admin - Members
// ==========================================

// รายชื่อสมาชิก
export async function getAdminMembers(token) {
  const data = await apiFetch('/api/admin/members', { token });

  return Array.isArray(data)
    ? data
    : data?.items ?? [];
}

// เปลี่ยน Role สมาชิก
export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, {
    method: 'PUT',
    body: {
      role,
    },
    token,
  });
}

// ==========================================
// Admin - Dormitories
// ==========================================

// ดึงข้อมูลหอพักสำหรับหน้า Admin
export function getAdminDormitory(dormitoryId, token) {
  return apiFetch(`/api/admin/dormitories/${dormitoryId}`, {
    token,
  });
}

// เพิ่มหอพัก
export function createDormitory(fields, token) {
  return apiFetch('/api/admin/dormitories', {
    method: 'POST',
    body: fields,
    token,
  });
}

// แก้ไขหอพัก
export function updateDormitory(dormitoryId, fields, token) {
  return apiFetch(`/api/admin/dormitories/${dormitoryId}`, {
    method: 'PUT',
    body: fields,
    token,
  });
}

// ลบหอพัก
export function deleteDormitory(dormitoryId, token) {
  return apiFetch(`/api/admin/dormitories/${dormitoryId}`, {
    method: 'DELETE',
    token,
  });
}
