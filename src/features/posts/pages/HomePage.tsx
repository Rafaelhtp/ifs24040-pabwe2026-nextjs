"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  asyncSetPosts,
  asyncLikePost,
  asyncDeleteAllPosts,
} from "../states/action";
import { formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";
import AddModal from "../modals/AddModal";
import {
  IconSearch,
  IconPlus,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconTrash,
  IconLoader2,
  IconNews,
} from "@tabler/icons-react";

export function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const { posts, isPost, isPostDeleteAll } = useAppSelector(
    (state) => state.posts
  );

  const initialTab = searchParams?.get("filter") === "my" ? "my" : "all";
  const [activeTab, setActiveTab] = useState<"all" | "my">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams?.get("filter") === "my" ? "my" : "all";
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    dispatch(asyncSetPosts(activeTab === "my" ? { is_me: 1 } : undefined));
  }, [dispatch, activeTab]);

  const handleTabChange = (tab: "all" | "my") => {
    setActiveTab(tab);
    if (tab === "my") {
      router.push("/?filter=my");
    } else {
      router.push("/");
    }
  };

  const handleLike = async (postId: number, isCurrentlyLiked: boolean) => {
    await dispatch(
      asyncLikePost(postId, { like: isCurrentlyLiked ? 0 : 1 })
    );
    // Refresh posts to keep counts and likes up to date
    dispatch(asyncSetPosts(activeTab === "my" ? { is_me: 1 } : undefined));
  };

  const handleDeleteAll = async () => {
    const confirmed = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus SEMUA postingan Anda? Tindakan ini tidak dapat dibatalkan.",
      "Hapus Semua Postingan"
    );
    if (confirmed) {
      const res = await dispatch(asyncDeleteAllPosts());
      if (res.success) {
        await showSuccessDialog("Semua postingan berhasil dihapus");
        dispatch(asyncSetPosts({ is_me: 1 }));
      } else {
        showErrorDialog(res.message || "Gagal menghapus postingan");
      }
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.description.toLowerCase().includes(q) ||
        p.author?.name?.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {activeTab === "my" ? "Postingan Saya" : "Linimasa Postingan"}
          </h1>
          <p className="text-sm text-slate-500">
            {activeTab === "my"
              ? "Kelola semua postingan yang telah Anda publikasikan"
              : "Jelajahi ide dan berita terbaru dari rekan-rekan Delcom"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === "my" && posts.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isPostDeleteAll}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
            >
              <IconTrash size={16} />
              <span>Hapus Semua</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
          >
            <IconPlus size={18} />
            <span>Buat Postingan</span>
          </button>
        </div>
      </div>

      {/* Tabs and search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua Postingan
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("my")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === "my"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Postingan Saya
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari postingan atau penulis..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Posts list */}
      {isPost && posts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400" data-testid="posts-loading">
          <IconLoader2 size={36} className="animate-spin text-blue-600 mb-2" />
          <p className="text-sm font-medium">Memuat postingan...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <IconNews size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Tidak ada postingan</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan postingan yang cocok dengan "${searchQuery}".`
              : activeTab === "my"
              ? "Anda belum membagikan postingan apa pun."
              : "Belum ada postingan dari komunitas saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const isLiked = Boolean(
              user?.id && post.likes && post.likes.includes(user.id)
            );
            const likesCount = post.likes ? post.likes.length : 0;
            const commentsCount = post.comments ? post.comments.length : 0;

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden"
              >
                {post.cover && (
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover}
                      alt={`Sampul postingan ${post.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author identity */}
                    <div className="flex items-center space-x-3 mb-3">
                      {post.author?.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.author.photo}
                          alt={post.author.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
                          {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {post.author?.name || "Anonim"}
                        </p>
                        <time className="text-xs text-slate-400">
                          {formatDate(post.created_at)}
                        </time>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-700 whitespace-pre-line mb-4 line-clamp-4">
                      {post.description}
                    </p>
                  </div>

                  {/* Actions & stats */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => handleLike(post.id, isLiked)}
                        aria-label={isLiked ? "Batal suka" : "Sukai"}
                        className={`flex items-center space-x-1.5 text-xs font-medium transition ${
                          isLiked
                            ? "text-red-600 hover:text-red-700"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {isLiked ? (
                          <IconHeartFilled size={18} className="text-red-500" />
                        ) : (
                          <IconHeart size={18} />
                        )}
                        <span>{likesCount}</span>
                      </button>

                      <Link
                        href={`/posts/${post.id}`}
                        className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition"
                      >
                        <IconMessageCircle size={18} />
                        <span>{commentsCount}</span>
                      </Link>
                    </div>

                    <Link
                      href={`/posts/${post.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Detail Selengkapnya →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          dispatch(asyncSetPosts(activeTab === "my" ? { is_me: 1 } : undefined));
        }}
      />
    </div>
  );
}

export default HomePage;
