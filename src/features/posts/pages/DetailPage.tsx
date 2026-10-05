"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPostDetail,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeletePost,
} from "../states/action";
import {
  formatDate,
  showConfirmDialog,
  showSuccessDialog,
  showErrorDialog,
} from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import {
  IconArrowLeft,
  IconHeart,
  IconHeartFilled,
  IconEdit,
  IconPhoto,
  IconTrash,
  IconSend,
  IconLoader2,
  IconMessageCircle,
} from "@tabler/icons-react";

export function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const postId = params?.postId as string;
  const user = useAppSelector((state) => state.auth.user);
  const { post, isPost, isPostAddComment, isPostDeleteComment, isPostDelete } =
    useAppSelector((state) => state.posts);

  const [commentText, setCommentText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPostDetail(postId));
    }
  }, [dispatch, postId]);

  if (isPost && !post) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-600" data-testid="detail-loading">
        <IconLoader2 size={36} className="animate-spin text-blue-600 mb-2" />
        <p className="text-sm font-medium">Memuat detail postingan...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <h1 className="text-lg font-bold text-slate-800">Postingan Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Postingan mungkin telah dihapus atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          <IconArrowLeft size={16} className="mr-1" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(user?.id && user.id === post.user_id);
  const isLiked = Boolean(user?.id && post.likes && post.likes.includes(user.id));
  const likesCount = post.likes ? post.likes.length : 0;
  const commentsCount = post.comments ? post.comments.length : 0;

  const handleLike = async () => {
    await dispatch(asyncLikePost(post.id, { like: isLiked ? 0 : 1 }));
    dispatch(asyncSetPostDetail(postId));
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showErrorDialog("Komentar tidak boleh kosong");
      return;
    }

    const res = await dispatch(
      asyncAddComment(post.id, { comment: commentText.trim() })
    );

    if (res.success) {
      setCommentText("");
      await showSuccessDialog("Komentar berhasil ditambahkan!");
      dispatch(asyncSetPostDetail(postId));
    } else {
      showErrorDialog(res.message || "Gagal menambahkan komentar");
    }
  };

  const handleDeleteComment = async () => {
    const confirmed = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus komentar Anda?",
      "Hapus Komentar"
    );
    if (confirmed) {
      const res = await dispatch(asyncDeleteComment(post.id));
      if (res.success) {
        await showSuccessDialog("Komentar berhasil dihapus!");
        dispatch(asyncSetPostDetail(postId));
      } else {
        showErrorDialog(res.message || "Gagal menghapus komentar");
      }
    }
  };

  const handleDeletePost = async () => {
    const confirmed = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus postingan ini?",
      "Hapus Postingan"
    );
    if (confirmed) {
      const res = await dispatch(asyncDeletePost(post.id));
      if (res.success) {
        await showSuccessDialog("Postingan berhasil dihapus!");
        router.push("/");
      } else {
        showErrorDialog(res.message || "Gagal menghapus postingan");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <IconArrowLeft size={18} className="mr-1.5" />
          Kembali ke Linimasa
        </Link>
      </div>

      {/* Main card */}
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover image if available */}
        {post.cover && (
          <div className="w-full max-h-96 bg-slate-100 overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt={`Sampul postingan ${post.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header with author info & owner action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-3">
              {post.author?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.photo}
                  alt=""
                  aria-hidden="true"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h1 className="text-base font-bold text-slate-800">
                  {post.author?.name || "Anonim"}
                </h1>
                <time className="text-xs text-slate-500">
                  {formatDate(post.created_at)}
                </time>
              </div>
            </div>

            {/* Owner buttons */}
            {isOwner && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCoverModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  <IconPhoto size={15} />
                  <span>Sampul</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  <IconEdit size={15} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={isPostDelete}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  <IconTrash size={15} />
                  <span>Hapus Postingan</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="py-6 text-slate-800 text-base leading-relaxed whitespace-pre-line">
            {post.description}
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center space-x-6 pt-4 border-t border-slate-100 text-sm">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center space-x-2 font-medium transition ${
                isLiked ? "text-red-600" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isLiked ? (
                <IconHeartFilled size={20} className="text-red-500" />
              ) : (
                <IconHeart size={20} />
              )}
              <span>{likesCount} Suka</span>
            </button>

            <div className="flex items-center space-x-2 text-slate-600 font-medium">
              <IconMessageCircle size={20} />
              <span>{commentsCount} Komentar</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-800">
          Komentar ({commentsCount})
        </h2>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <label htmlFor="comment-input" className="block text-sm font-medium text-slate-700">
            Tulis Komentar
          </label>
          <div className="relative">
            <textarea
              id="comment-input"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Berikan tanggapan atau opini Anda..."
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPostAddComment}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isPostAddComment ? (
                <>
                  <IconLoader2 className="animate-spin mr-1.5" size={16} />
                  Mengirim...
                </>
              ) : (
                <>
                  <IconSend size={16} />
                  <span>Kirim Komentar</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {!post.comments || post.comments.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4 text-center">
              Belum ada komentar untuk postingan ini. Jadilah yang pertama berkomentar!
            </p>
          ) : (
            post.comments.map((comment) => {
              const isMyComment = Boolean(
                post.my_comment && post.my_comment.id === comment.id
              );

              return (
                <div
                  key={comment.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formatDate(comment.created_at)}
                    </span>
                    {isMyComment && (
                      <button
                        type="button"
                        onClick={handleDeleteComment}
                        disabled={isPostDeleteComment}
                        aria-label="Hapus komentar"
                        className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center space-x-1"
                      >
                        <IconTrash size={14} />
                        <span>Hapus Komentar</span>
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-line">
                    {comment.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <ChangeModal
        isOpen={isEditModalOpen}
        postId={post.id}
        initialDescription={post.description}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => dispatch(asyncSetPostDetail(postId))}
      />

      {/* Change Cover Modal */}
      <ChangeCoverModal
        isOpen={isCoverModalOpen}
        postId={post.id}
        currentCover={post.cover}
        onClose={() => setIsCoverModalOpen(false)}
        onSuccess={() => dispatch(asyncSetPostDetail(postId))}
      />
    </div>
  );
}

export default DetailPage;
