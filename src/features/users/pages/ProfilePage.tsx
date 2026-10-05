"use client";

import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetProfile,
  asyncUpdateProfile,
  asyncUpdatePhoto,
  asyncUpdatePassword,
} from "../states/action";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";
import {
  IconUser,
  IconMail,
  IconLock,
  IconCamera,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.users.profile);
  const { isUpdateProfile, isUpdatePhoto, isUpdatePassword } = useAppSelector(
    (state) => state.users
  );

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    } else {
      dispatch(asyncSetProfile());
    }
  }, [profile, dispatch]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showErrorDialog("Nama lengkap tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      showErrorDialog("Email tidak boleh kosong");
      return;
    }

    const res = await dispatch(
      asyncUpdateProfile({ name: name.trim(), email: email.trim() })
    );

    if (res.success) {
      await showSuccessDialog("Profil berhasil diperbarui!");
    } else {
      showErrorDialog(res.message || "Gagal memperbarui profil");
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    const res = await dispatch(asyncUpdatePhoto(file));
    if (res.success) {
      await showSuccessDialog("Foto profil berhasil diperbarui!");
    } else {
      showErrorDialog(res.message || "Gagal memperbarui foto profil");
      setPhotoPreview(null);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showErrorDialog("Kata sandi saat ini wajib diisi");
      return;
    }
    if (!newPassword) {
      showErrorDialog("Kata sandi baru wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      showErrorDialog("Kata sandi baru minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorDialog("Konfirmasi kata sandi baru tidak cocok");
      return;
    }

    const res = await dispatch(
      asyncUpdatePassword({
        password: currentPassword,
        new_password: newPassword,
      })
    );

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await showSuccessDialog("Kata sandi berhasil diubah!");
    } else {
      showErrorDialog(res.message || "Gagal mengubah kata sandi");
    }
  };

  const displayPhoto = photoPreview || profile?.photo;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Pengaturan Profil
        </h1>
        <p className="text-sm text-slate-500">
          Kelola informasi identitas pribadi, avatar, dan keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Avatar card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4 shadow-xs">
            <div className="relative inline-block mx-auto">
              {displayPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayPhoto}
                  alt={profile?.name || "Foto Profil"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-sm mx-auto"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-3xl mx-auto border-4 border-slate-100">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              )}

              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 cursor-pointer transition"
                title="Ubah Foto"
              >
                {isUpdatePhoto ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconCamera size={16} />
                )}
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={isUpdatePhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">
                {profile?.name || "Memuat..."}
              </h2>
              <p className="text-xs text-slate-500">{profile?.email}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              Format: PNG, JPG, WEBP. Maks 2MB.
            </div>
          </div>
        </div>

        {/* Right column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Identity Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Informasi Pribadi
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="profile-name-input"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IconUser size={18} />
                  </div>
                  <input
                    id="profile-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-email-input"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IconMail size={18} />
                  </div>
                  <input
                    id="profile-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdateProfile}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 shadow-sm"
                >
                  {isUpdateProfile ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck size={16} />
                      <span>Simpan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Ganti Kata Sandi
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="current-password-input"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IconLock size={18} />
                  </div>
                  <input
                    id="current-password-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password-input"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IconLock size={18} />
                  </div>
                  <input
                    id="new-password-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password-input"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IconLock size={18} />
                  </div>
                  <input
                    id="confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatePassword}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 shadow-sm"
                >
                  {isUpdatePassword ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      <span>Mengubah...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck size={16} />
                      <span>Ubah Kata Sandi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
