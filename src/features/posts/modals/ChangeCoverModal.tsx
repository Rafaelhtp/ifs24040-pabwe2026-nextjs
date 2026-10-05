"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncChangeCoverPost } from "../states/action";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { IconX, IconLoader2, IconUpload, IconPhoto } from "@tabler/icons-react";

interface ChangeCoverModalProps {
  isOpen: boolean;
  postId: number | string;
  currentCover?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ChangeCoverModal({
  isOpen,
  postId,
  currentCover,
  onClose,
  onSuccess,
}: ChangeCoverModalProps) {
  const dispatch = useAppDispatch();
  const isPostChangeCover = useAppSelector((state) => state.posts.isPostChangeCover);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showErrorDialog("Silakan pilih gambar sampul terlebih dahulu");
      return;
    }

    const res = await dispatch(asyncChangeCoverPost(postId, selectedFile));
    if (res.success) {
      await showSuccessDialog("Foto sampul berhasil diperbarui!");
      handleClose();
      onSuccess?.();
    } else {
      showErrorDialog(res.message || "Gagal memperbarui foto sampul");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Ubah Sampul Postingan</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <span className="block text-sm font-medium text-slate-700">Preview Sampul</span>
            <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview Sampul Baru"
                  className="w-full h-full object-cover"
                />
              ) : currentCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentCover}
                  alt="Sampul Saat Ini"
                  className="w-full h-full object-cover opacity-75"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <IconPhoto size={40} className="mx-auto mb-1" />
                  <p className="text-xs">Belum ada gambar yang dipilih</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="cover-file-input"
              className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition text-sm font-medium text-slate-700"
            >
              <IconUpload size={18} className="mr-2 text-slate-500" />
              <span>{selectedFile ? selectedFile.name : "Pilih File Gambar Baru..."}</span>
              <input
                id="cover-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPostChangeCover}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPostChangeCover || !selectedFile}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isPostChangeCover ? (
                <>
                  <IconLoader2 className="animate-spin mr-2" size={16} />
                  Mengunggah...
                </>
              ) : (
                "Unggah Sampul"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeCoverModal;
