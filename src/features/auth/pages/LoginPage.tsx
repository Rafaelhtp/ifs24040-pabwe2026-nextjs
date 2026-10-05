"use client";

import React, { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetIsAuthLogin } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconLock, IconMail, IconLoader2 } from "@tabler/icons-react";

export function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthLogin = useAppSelector((state) => state.auth.isAuthLogin);

  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

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

    const result = await dispatch(
      asyncSetIsAuthLogin({
        email: email.trim(),
        password,
      })
    );

    if (result.success) {
      router.push("/");
      showSuccessDialog("Berhasil masuk ke Delcom Posts!");
    } else {
      const msg = result.message || "Gagal masuk. Periksa email dan kata sandi Anda.";
      setErrorMessage(msg);
      showErrorDialog(msg);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Masuk Akun</h2>
        <p className="text-sm text-slate-500 mt-1">
          Masukkan email dan kata sandi untuk melanjutkan
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

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="login-email-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconMail size={18} aria-hidden="true" />
            </div>
            <input
              id="login-email-input"
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
            htmlFor="login-password-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconLock size={18} aria-hidden="true" />
            </div>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              required
              aria-required="true"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <button
          id="login-submit-button"
          type="submit"
          disabled={isAuthLogin}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isAuthLogin ? (
            <>
              <IconLoader2 className="animate-spin mr-2" size={18} aria-hidden="true" />
              Memproses...
            </>
          ) : (
            "Masuk Sekarang"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
        >
          Daftar di sini
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
