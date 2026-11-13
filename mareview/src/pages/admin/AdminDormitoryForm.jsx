
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import {
  getAdminDormitory,
  getDormitoryTypes,
  getGenderTypes,
  createDormitory,
  updateDormitory,
  deleteDormitory
} from '../../api/backend';
import {
  ErrorBox,
  Loading,
  ConfirmBox,
  btnPrimary,
  btnDanger,
  inputClass
} from '../../pages/admin/AdminStates';

const EMPTY = {
  name: '',
  minPrice: '',
  maxPrice: '',
  dormTypeId: '',
  genderTypeId: '',
  googleMapUrl: '',
  contactUrl: '',
  description: '',
  images: ['', '', '', '']
};

// ตรวจสอบข้อมูลเบื้องต้นก่อนส่งไป Backend
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'กรุณากรอกชื่อหอพัก';
  }

  if (
    form.minPrice === '' ||
    !Number.isFinite(Number(form.minPrice)) ||
    Number(form.minPrice) < 0
  ) {
    errors.minPrice = 'กรุณากรอกราคาเริ่มต้นให้ถูกต้อง';
  }

  if (
    form.maxPrice === '' ||
    !Number.isFinite(Number(form.maxPrice)) ||
    Number(form.maxPrice) < 0
  ) {
    errors.maxPrice = 'กรุณากรอกราคาสูงสุดให้ถูกต้อง';
  }

  if (
    form.minPrice !== '' &&
    form.maxPrice !== '' &&
    Number(form.minPrice) > Number(form.maxPrice)
  ) {
    errors.maxPrice = 'ราคาสูงสุดต้องไม่น้อยกว่าราคาเริ่มต้น';
  }

  if (!form.dormTypeId) {
    errors.dormTypeId = 'กรุณาเลือกประเภทหอพัก';
  }

  if (!form.genderTypeId) {
    errors.genderTypeId = 'กรุณาเลือกประเภทผู้พัก';
  }

  form.images.forEach((image, index) => {
    const value = image.trim();

    if (
      value &&
      !/^(https?:\/\/|\/)/i.test(value)
    ) {
      errors[`image${index}`] = 'กรุณากรอก URL หรือ path รูปภาพให้ถูกต้อง';
    }
  });

  return errors;
}

// แปลงค่าจากฟอร์มเป็น JSON สำหรับ Backend
function toPayload(form) {
  const nullable = value =>
    value.trim() ? value.trim() : null;

  return {
    name: form.name.trim(),
    minPrice: Number(form.minPrice),
    maxPrice: Number(form.maxPrice),
    dormTypeId: Number(form.dormTypeId),
    genderTypeId: Number(form.genderTypeId),
    googleMapUrl: nullable(form.googleMapUrl),
    contactUrl: nullable(form.contactUrl),
    description: nullable(form.description),
    images: form.images
      .map(image => image.trim())
      .filter(Boolean)
  };
}

function AdminDormitoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [dormTypes, setDormTypes] = useState([]);
  const [genderTypes, setGenderTypes] = useState([]);
  const [impact, setImpact] = useState(null);

  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // โหลดประเภทหอพัก ประเภทผู้พัก และข้อมูลเดิมกรณีแก้ไข
  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      setLoadError(null);

      try {
        const [types, genders, dormitory] = await Promise.all([
          getDormitoryTypes(),
          getGenderTypes(),
          isEdit ? getAdminDormitory(id, token) : null
        ]);

        if (ignore) return;

        setDormTypes(types);
        setGenderTypes(genders);

        if (dormitory) {
          setForm({
            name: dormitory.name ?? '',
            minPrice: String(dormitory.minPrice ?? ''),
            maxPrice: String(dormitory.maxPrice ?? ''),
            dormTypeId: String(dormitory.dormTypeId ?? ''),
            genderTypeId: String(dormitory.genderTypeId ?? ''),
            googleMapUrl: dormitory.googleMapUrl ?? '',
            contactUrl: dormitory.contactUrl ?? '',
            description: dormitory.description ?? '',
            images: Array.from(
              { length: 4 },
              (_, index) => dormitory.images?.[index] ?? ''
            )
          });

          setImpact(dormitory.impact ?? null);
        }

        setStatus('ready');
      } catch (err) {
        if (!ignore) {
          setLoadError(err);
          setStatus('error');
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [id, isEdit, token]);

  function set(field) {
    return e => {
      setForm(current => ({
        ...current,
        [field]: e.target.value
      }));

      setSaved(false);
      setServerError(null);
    };
  }

  function setImage(index, value) {
    setForm(current => ({
      ...current,
      images: current.images.map((image, i) =>
        i === index ? value : image
      )
    }));

    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setServerError(null);

    try {
      const payload = toPayload(form);

      if (isEdit) {
        const updated = await updateDormitory(id, payload, token);
        setImpact(updated.impact ?? null);
        setSaved(true);
      } else {
        const created = await createDormitory(payload, token);

        navigate(`/admin/dormitories/${created.id}`, {
          replace: true
        });
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setServerError(null);

    try {
      await deleteDormitory(id, token);

      navigate('/admin/dormitories', {
        replace: true
      });
    } catch (err) {
      setServerError(err.message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (status === 'loading') return <Loading />;

  if (status === 'error') {
    return <ErrorBox error={loadError} />;
  }

  const label =
    'mb-2 block text-sm font-semibold text-slate-700';

  const fieldErr = key =>
    errors[key] && (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
        <span>⚠</span>
        {errors[key]}
      </p>
    );

  const previewImage = form.images.find(image => image.trim());

  const fieldClass =
    inputClass +
    ' w-full rounded-xl border-violet-100 bg-violet-50/30 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100';

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              Mareview Administration
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              {isEdit ? 'แก้ไขข้อมูลหอพัก' : 'เพิ่มหอพักใหม่'}
            </h2>

            <p className="mt-2 text-sm text-violet-100">
              {isEdit
                ? `จัดการรายละเอียดของหอพัก ID #${id}`
                : 'กรอกข้อมูลเพื่อเพิ่มหอพักเข้าสู่ระบบ Mareview'}
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            {isEdit ? '✏️' : '🏠'}
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dormitories"
          className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
        >
          <span>←</span>
          กลับรายการหอพัก
        </Link>

        {isEdit && (
          <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
            ID: #{id}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[1fr_280px]"
      >
        {/* Main Form */}
        <div className="space-y-6">

          {/* Basic Information */}
          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-violet-50 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
                📝
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  ข้อมูลทั่วไป
                </h3>
                <p className="text-xs text-slate-400">
                  ชื่อ ราคา และประเภทของหอพัก
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={label}>
                  ชื่อหอพัก <span className="text-red-500">*</span>
                </label>

                <input
                  value={form.name}
                  onChange={set('name')}
                  className={fieldClass}
                  placeholder="กรอกชื่อหอพัก"
                />

                {fieldErr('name')}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={label}>
                    ราคาเริ่มต้น (บาท/เดือน) <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.minPrice}
                    onChange={set('minPrice')}
                    className={fieldClass}
                    placeholder="เช่น 2500"
                  />

                  {fieldErr('minPrice')}
                </div>

                <div>
                  <label className={label}>
                    ราคาสูงสุด (บาท/เดือน) <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.maxPrice}
                    onChange={set('maxPrice')}
                    className={fieldClass}
                    placeholder="เช่น 5000"
                  />

                  {fieldErr('maxPrice')}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={label}>
                    ประเภทหอพัก <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.dormTypeId}
                    onChange={set('dormTypeId')}
                    className={fieldClass}
                  >
                    <option value="">เลือกประเภทหอพัก</option>

                    {dormTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {fieldErr('dormTypeId')}
                </div>

                <div>
                  <label className={label}>
                    ประเภทผู้พัก <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.genderTypeId}
                    onChange={set('genderTypeId')}
                    className={fieldClass}
                  >
                    <option value="">เลือกประเภทผู้พัก</option>

                    {genderTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {fieldErr('genderTypeId')}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-violet-50 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
                📍
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  ข้อมูลติดต่อและสถานที่
                </h3>
                <p className="text-xs text-slate-400">
                  ช่องทางติดต่อและตำแหน่งที่ตั้งหอพัก
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={label}>
                  Google Maps URL
                </label>

                <input
                  value={form.googleMapUrl}
                  onChange={set('googleMapUrl')}
                  className={fieldClass}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className={label}>
                  ช่องทางติดต่อ
                </label>

                <input
                  value={form.contactUrl}
                  onChange={set('contactUrl')}
                  className={fieldClass}
                  placeholder="เบอร์โทรศัพท์ หรือ URL ติดต่อ"
                />
              </div>

              <div>
                <label className={label}>
                  รายละเอียดหอพัก
                </label>

                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={5}
                  className={fieldClass}
                  placeholder="รายละเอียด สิ่งอำนวยความสะดวก และเงื่อนไขการเข้าพัก"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-violet-50 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
                🖼️
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  รูปภาพหอพัก
                </h3>
                <p className="text-xs text-slate-400">
                  เพิ่ม URL หรือ path รูปภาพได้สูงสุด 4 รูป
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {form.images.map((image, index) => (
                <div key={index}>
                  <label className={label}>
                    รูปภาพที่ {index + 1}
                  </label>

                  <input
                    value={image}
                    onChange={e => setImage(index, e.target.value)}
                    className={fieldClass}
                    placeholder="https://example.com/dorm.jpg"
                  />

                  {fieldErr(`image${index}`)}
                </div>
              ))}
            </div>
          </section>

          {/* Submit Actions */}
          <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            {serverError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {saved && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <span>✓</span>
                บันทึกข้อมูลเรียบร้อยแล้ว
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className={
                  btnPrimary +
                  ' inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
                }
              >
                {saving
                  ? 'กำลังบันทึก...'
                  : isEdit
                    ? 'บันทึกการแก้ไข'
                    : '＋ เพิ่มหอพัก'}
              </button>

              {isEdit && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={
                    btnDanger +
                    ' inline-flex items-center justify-center rounded-xl px-6 py-3'
                  }
                >
                  🗑️ ลบหอพักนี้
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">

          {/* Image Preview */}
          <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
            <div className="border-b border-violet-50 p-4">
              <h3 className="font-bold text-slate-800">
                ตัวอย่างรูปภาพ
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                ภาพแรกที่กรอกจะแสดงเป็นภาพตัวอย่าง
              </p>
            </div>

            {previewImage ? (
              <img
                src={previewImage}
                alt="ตัวอย่างรูปภาพหอพัก"
                className="aspect-[4/3] w-full bg-violet-50 object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center bg-violet-50 text-5xl">
                🏠
              </div>
            )}

            <div className="p-4">
              <p className="text-center text-xs text-slate-400">
                {previewImage ? 'Preview รูปภาพหอพัก' : 'ยังไม่มีรูปภาพ'}
              </p>
            </div>
          </section>

          {/* Impact Information */}
          {impact && (
            <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  📊
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    ข้อมูลที่เกี่ยวข้อง
                  </h3>

                  <p className="text-xs text-slate-400">
                    ข้อมูลที่ผูกกับหอพักนี้
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-violet-50/70 px-3 py-2.5">
                  <span className="text-sm text-slate-600">
                    รีวิว
                  </span>

                  <span className="font-bold text-violet-700">
                    {impact.reviews ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-violet-50/70 px-3 py-2.5">
                  <span className="text-sm text-slate-600">
                    คะแนน
                  </span>

                  <span className="font-bold text-violet-700">
                    {impact.ratings ?? impact.votes ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-violet-50/70 px-3 py-2.5">
                  <span className="text-sm text-slate-600">
                    รายการที่บันทึกไว้
                  </span>

                  <span className="font-bold text-violet-700">
                    {impact.wishlist ?? 0}
                  </span>
                </div>
              </div>
            </section>
          )}
        </aside>
      </form>

      {/* Delete Confirmation */}
      <ConfirmBox
        open={confirmDelete}
        title={`ลบ "${form.name}" ?`}
        confirmText="ลบถาวร"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setConfirmDelete(false);
        }}
      >
        {impact &&
        ((impact.reviews ?? 0) +
          (impact.ratings ?? impact.votes ?? 0) +
          (impact.wishlist ?? 0) > 0) ? (
          <p>
            รีวิว {impact.reviews ?? 0} รายการ คะแนน{' '}
            {impact.ratings ?? impact.votes ?? 0} รายการ และรายการที่บันทึกไว้{' '}
            {impact.wishlist ?? 0} รายการจะถูกลบตามไปด้วย
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
        ) : (
          <p>
            ยืนยันการลบหอพักนี้หรือไม่
            ข้อมูลที่เกี่ยวข้องอาจถูกลบตามเงื่อนไข Foreign Key ของฐานข้อมูล
          </p>
        )}
      </ConfirmBox>
    </div>
  );
}

export default AdminDormitoryForm;
