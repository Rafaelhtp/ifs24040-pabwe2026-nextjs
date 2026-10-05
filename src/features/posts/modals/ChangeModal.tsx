"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncChangePost } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconX, IconLoader2 } from "@tabler/icons-react";

interface ChangeModalProps {
  isOpen: boolean;
  postId: number | string;
  initialDescription: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ChangeModal({
  isOpen,
  postId,
  initialDescription,
  onClose,
  onSuccess,
}: ChangeModalProps) {
  const dispatch = useAppDispatch();
  const isPostChange = useAppSelector((state) => state.posts.isPostChange);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showErrorDialog("Konten postingan tidak boleh kosong");
      return;
    }

    const res = await dispatch(
      asyncChangePost(postId, { description: description.trim() })
    );

    if (res.success) {
      await showSuccessDialog("Postingan berhasil diperbarui!");
      onSuccess?.();
      onClose();
    } else {
      showErrorDialog(res.message || "Gagal memperbarui postingan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Postingan</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edit-post-description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Deskripsi Postingan
            </label>
            <textarea
              id="edit-post-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPostChange}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPostChange || !description.trim()}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isPostChange ? (
                <>
                  <IconLoader2 className="animate-spin mr-2" size={16} />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeModal;
