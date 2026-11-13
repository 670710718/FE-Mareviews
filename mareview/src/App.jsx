
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KeyBanner from './components/KeyBanner';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';

import Home from './pages/Home';
import Dormitories from './pages/Dormitories';
import DormitoryDetail from './pages/DormitoryDetail';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDormitories from './pages/admin/AdminDormitories';
import AdminDormitoryForm from './pages/admin/AdminDormitoryForm';
import AdminMembers from './pages/admin/AdminMembers';
import AdminReviews from './pages/admin/AdminReviews';

function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <KeyBanner />

        <main className="flex-1">
          <Routes>
            {/* หน้าหลัก */}
            <Route path="/" element={<Home />} />

            {/* รายการหอพัก */}
            <Route path="/dormitories" element={<Dormitories />} />

            {/* รายละเอียดหอพัก */}
            <Route path="/dormitories/:id" element={<DormitoryDetail />} />

            {/* ระบบสมาชิก */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* หอพักที่บันทึกไว้ */}
            <Route
              path="/me/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* หลังบ้านสำหรับ Admin */}
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <AdminLayout />
                </RequireRole>
              }
            >
              <Route index element={<AdminDashboard />} />

              <Route
                path="dormitories"
                element={<AdminDormitories />}
              />

              <Route
                path="dormitories/new"
                element={<AdminDormitoryForm />}
              />

              <Route
                path="dormitories/:id"
                element={<AdminDormitoryForm />}
              />

              <Route
                path="members"
                element={<AdminMembers />}
              />

              <Route
                path="reviews"
                element={<AdminReviews />}
              />
            </Route>

            {/* หน้าอื่น ๆ */}
            {/* <Route path="/lab" element={<ApiLab />} /> */}
            <Route path="/about" element={<About />} />

            {/* ไม่พบหน้า */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
