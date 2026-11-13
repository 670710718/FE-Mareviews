
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import DormitoryActions from '../components/DormitoryActions';

import { getDormitory, getReviews, postReview } from '../api/backend';
import { useAuth } from '../auth/AuthContext';

function formatPrice(price) {
  if (price == null || price === '') return null;

  return Number(price).toLocaleString('th-TH');
}

function extractItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.reviews)) return data.reviews;
  return [];
}

function DormitoryDetail() {
  const { id } = useParams();

  const [dormitory, setDormitory] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const { isLoggedIn, token, member } = useAuth();

  // โหลดรายละเอียดหอพัก
  // โหลดรายละเอียดหอพัก
useEffect(() => {
  let ignore = false;

  async function loadDormitory() {
    setStatus('loading');
    setError(null);

    try {
      const data = await getDormitory(id);

      // แสดงข้อมูลที่ Backend ส่งกลับมาใน Console
      console.log('========== DORMITORY API ==========');
      console.log('Dormitory API Response:', data);
      console.log('Rating Average:', data?.ratingAverage);
      console.log('Rating Count:', data?.ratingCount);
      console.log('All Keys:', Object.keys(data || {}));
      console.log('===================================');

      if (!ignore) {
        setDormitory(data);
        setStatus('success');
      }
    } catch (err) {
      console.error('Failed to load dormitory:', err);

      if (!ignore) {
        setError(err);
        setStatus('error');
      }
    }
  }

  loadDormitory();

  return () => {
    ignore = true;
  };
}, [id]);
  // โหลดรีวิว
  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      try {
        const data = await getReviews(id);

        if (!ignore) {
          setReviews(extractItems(data));
        }
      } catch (err) {
        console.error('Failed to load dormitory reviews:', err);

        if (!ignore) {
          setReviews([]);
        }
      }
    }

    loadReviews();

    return () => {
      ignore = true;
    };
  }, [id]);

  // ส่งรีวิวใหม่และอัปเดตข้อมูล
  async function handleReviewSubmit(text, rating) {
    // บันทึกรีวิวก่อน
    const saved = await postReview(id, text, rating, token);

    // เพิ่มรีวิวใหม่ทันทีเพื่อให้หน้าอัปเดต
    const newReview = {
      ...saved,
      rating: saved?.rating ?? rating,
      text: saved?.text ?? text,
      member: saved?.member || {
        id: member?.id,
        displayName: member?.displayName,
      },
    };

    setReviews((current) => [
      newReview,
      ...current.filter((item) => item.id !== newReview.id),
    ]);

    // โหลดรีวิวและรายละเอียดหอพักใหม่
    // หากโหลดใหม่ไม่สำเร็จ จะไม่ถือว่าการบันทึกรีวิวล้มเหลว
    try {
      const [reviewData, dormitoryData] = await Promise.all([
        getReviews(id),
        getDormitory(id),
      ]);

      setReviews(extractItems(reviewData));
      setDormitory(dormitoryData);
    } catch (err) {
      console.error('Failed to refresh after review submission:', err);
    }
  }

  // Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-violet-50/30">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 md:px-6 lg:px-8">
          <div className="h-4 w-40 rounded bg-violet-100" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="aspect-[4/3] rounded-3xl bg-violet-100" />

            <div className="space-y-5">
              <div className="h-8 w-3/4 rounded bg-violet-100" />
              <div className="h-4 w-1/2 rounded bg-violet-100" />
              <div className="h-24 rounded-2xl bg-violet-100" />
              <div className="h-16 rounded-2xl bg-violet-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-violet-50/30 px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-4xl">
            🏡
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            ไม่พบข้อมูลหอพักนี้
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}
          </p>

          <Link
            to="/dormitories"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            ← กลับไปหน้าหอพักทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(dormitory?.images)
    ? dormitory.images.filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-violet-50/20">
      {/* Page Header */}
      <section className="border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <Link
            to="/dormitories"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700"
          >
            <span>←</span>
            กลับไปหน้าหอพักทั้งหมด
          </Link>

          <div className="mt-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Dormitory Details
            </span>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {dormitory.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {dormitory.dormType && (
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {dormitory.dormType}
                </span>
              )}

              {dormitory.genderType && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {dormitory.genderType}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Image Gallery */}
          <section>
            {images.length > 0 ? (
              <div className="space-y-3">
                <div className="group relative overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg shadow-violet-100/50">
                  <img
                    src={images[0]}
                    alt={dormitory.name}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/50 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    🏠 ภาพหอพัก
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {images.slice(1, 4).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
                      >
                        <img
                          src={image}
                          alt={`${dormitory.name} รูปที่ ${index + 2}`}
                          loading="lazy"
                          className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-100 to-purple-50 shadow-sm">
                <div className="text-center">
                  <div className="text-7xl">🏠</div>
                  <p className="mt-3 text-sm font-medium text-violet-400">
                    ไม่มีรูปภาพหอพัก
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Dormitory Information */}
          <section className="flex flex-col gap-5">
            {/* Price Card */}
            <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                  💰
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    ค่าเช่าหอพัก
                  </p>
                  <h2 className="text-lg font-bold text-slate-800">
                    ราคาและค่าใช้จ่าย
                  </h2>
                </div>
              </div>

              {(dormitory.minPrice != null || dormitory.maxPrice != null) ? (
                <div className="mt-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-5">
                  <p className="text-xs font-medium text-violet-500">
                    ราคาเช่าต่อเดือน
                  </p>

                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-violet-800">
                    {dormitory.minPrice != null && formatPrice(dormitory.minPrice)}
                    {dormitory.minPrice != null && dormitory.maxPrice != null && (
                      <span className="mx-2 text-violet-400">-</span>
                    )}
                    {dormitory.maxPrice != null && formatPrice(dormitory.maxPrice)}

                    <span className="ml-2 text-sm font-medium text-violet-500">
                      บาท
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-400">
                  ไม่มีข้อมูลราคา
                </p>
              )}
            </div>

            {/* Rating Card */}
            <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  ⭐
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    คะแนนจากสมาชิก
                  </p>
                  <h2 className="text-lg font-bold text-slate-800">
                    คะแนนหอพัก
                  </h2>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-amber-50/70 p-5">
                <div>
                  <p className="text-3xl font-extrabold text-amber-600">
                    {dormitory.ratingAverage != null
                      ? Number(dormitory.ratingAverage).toFixed(1)
                      : '—'}
                    <span className="text-base font-semibold text-amber-400">
                      /5
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    คะแนนเฉลี่ย
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-xl font-bold text-slate-700">
                    {(dormitory.ratingCount || 0).toLocaleString('th-TH')}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    จำนวนรีวิว
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {dormitory.description && (
              <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                    📝
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    รายละเอียดหอพัก
                  </h2>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">
                  {dormitory.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            {(dormitory.googleMapUrl &&
              dormitory.googleMapUrl !== '-') ||
            (dormitory.contactUrl && dormitory.contactUrl !== '-') ? (
              <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
                    📍
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    ช่องทางติดต่อ
                  </h2>
                </div>

                {dormitory.googleMapUrl &&
                  dormitory.googleMapUrl !== '-' &&
                  /^https?:\/\//i.test(dormitory.googleMapUrl) && (
                    <a
                      href={dormitory.googleMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                    >
                      <span>ดูตำแหน่งบน Google Maps</span>
                      <span>↗</span>
                    </a>
                  )}

                {dormitory.contactUrl &&
                  dormitory.contactUrl !== '-' && (
                    <div className="mt-3 rounded-xl bg-purple-50 px-4 py-3">
                      <p className="text-xs text-purple-500">
                        เบอร์ติดต่อ / ช่องทางติดต่อ
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {dormitory.contactUrl}
                      </p>
                    </div>
                  )}
              </div>
            ) : null}

            {/* Dormitory Actions */}
            <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                จัดการหอพัก
              </h2>

              <DormitoryActions dormitoryId={dormitory.id} />
            </div>
          </section>
        </div>

        {/* Reviews Section */}
        <section className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Community Reviews
              </span>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                รีวิวจากสมาชิก
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                ประสบการณ์และความคิดเห็นจากผู้ใช้งาน Mareview
              </p>
            </div>

            <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              {reviews.length} รีวิว
            </span>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm md:p-7">
            <ReviewList items={reviews} />
          </div>
        </section>

        {/* Review Form */}
        <section className="mt-10">
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Write a Review
            </span>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              แสดงความคิดเห็นของคุณ
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              แบ่งปันประสบการณ์เพื่อช่วยให้สมาชิกคนอื่นตัดสินใจเลือกที่พักได้ง่ายขึ้น
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm md:p-7">
            {isLoggedIn ? (
              <ReviewForm
                key={dormitory.id}
                dormitoryName={dormitory.name}
                onSubmit={handleReviewSubmit}
              />
            ) : (
              <div className="rounded-2xl bg-violet-50/70 p-6 text-center">
                <div className="text-3xl">💜</div>

                <p className="mt-3 font-semibold text-slate-800">
                  เข้าสู่ระบบเพื่อเขียนรีวิว
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  ร่วมแบ่งปันความคิดเห็นและประสบการณ์เกี่ยวกับหอพัก
                </p>

                <Link
                  to="/login"
                  className="mt-5 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DormitoryDetail;
