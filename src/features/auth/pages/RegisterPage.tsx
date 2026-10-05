"use client";

import React, { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetIsAuthRegister } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconLock, IconMail, IconUser, IconLoader2 } from "@tabler/icons-react";

export function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthRegister = useAppSelector((state) => state.auth.isAuthRegister);

  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [passwordConfirmation, onPasswordConfirmationChange] = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      const msg = "Nama lengkap wajib diisi";
      setErrorMessage(msg);
      showErrorDialog(msg);
      return;
    }

    if (!email.trim()) {
      const msg = "Email wajib diisi";
      setErrorMessage(msg);
      showErrorDialog(msg);
      return;
    }

    if (!password) {
      const msg = "Kata sandi wajib diisi";
      setErrorMessage(msg);
      showErrorDialog(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Kata sandi minimal 6 karakter";
      setErrorMessage(msg);
      showErrorDialog(msg);
      return;
    }

    if (password !== passwordConfirmation) {
      const msg = "Konfirmasi kata sandi tidak cocok";
      setErrorMessage(msg);
      showErrorDialog(msg);
      return;
    }

    const result = await dispatch(
      asyncSetIsAuthRegister({
        name: name.trim(),
        email: email.trim(),
        password,
      })
    );

    if (result.success) {
      router.push("/auth/login");
      showSuccessDialog("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
    } else {
      const msg = result.message || "Gagal melakukan registrasi.";
      setErrorMessage(msg);
      showErrorDialog(msg);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Daftar Akun</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bergabunglah dengan komunitas Delcom Posts
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="register-name-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconUser size={18} aria-hidden="true" />
            </div>
            <input
              id="register-name-input"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Rafael Hutapea"
              required
              aria-required="true"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-email-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconMail size={18} aria-hidden="true" />
            </div>
            <input
              id="register-email-input"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@delcom.org"
              required
              aria-required="true"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-password-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock size={18} aria-hidden="true" />
            </div>
            <input
              id="register-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Minimal 6 karakter"
              required
              aria-required="true"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-confirm-password-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock size={18} aria-hidden="true" />
            </div>
            <input
              id="register-confirm-password-input"
              type="password"
              value={passwordConfirmation}
              onChange={onPasswordConfirmationChange}
              placeholder="Ulangi kata sandi"
              required
              aria-required="true"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <button
          id="register-submit-button"
          type="submit"
          disabled={isAuthRegister}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
        >
          {isAuthRegister ? (
            <>
              <IconLoader2 className="animate-spin mr-2" size={18} aria-hidden="true" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Sudah memiliki akun?{" "}
        <Link
          href="/auth/login"
          prefetch={false}
          className="font-medium text-blue-700 hover:text-blue-600 underline underline-offset-4"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;