
import { createContext, useContext, useState } from 'react';
import * as api from '../api/backend';

// Context กลางสำหรับจัดการสถานะสมาชิกของ Mareview
const AuthContext = createContext(null);

const TOKEN_KEY = 'mareview.token';
const MEMBER_KEY = 'mareview.member';

export function AuthProvider({ children }) {
  // อ่านข้อมูล Login เดิมจาก localStorage เมื่อเปิดหรือ Refresh แอป
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [member, setMember] = useState(() =>
    JSON.parse(localStorage.getItem(MEMBER_KEY) || 'null')
  );

  function remember({ token, member }) {
    setToken(token);
    setMember(member);

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    remember(data);
  }

  async function register(email, password, displayName) {
    await api.register(email, password, displayName);

    // สมัครสมาชิกสำเร็จแล้ว Login ให้อัตโนมัติ
    await login(email, password);
  }

  function logout() {
    setToken(null);
    setMember(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBER_KEY);
  }

  const isAdmin = member?.role === 'admin';

  const value = {
    token,
    member,
    isLoggedIn: Boolean(token),
    isAdmin,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับเรียกใช้งาน AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
