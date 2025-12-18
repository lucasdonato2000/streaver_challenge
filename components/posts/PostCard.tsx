"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { deletePost } from "../../features/posts/actions";
import { Post } from "../../features/posts/types/post.types";
import { Dropdown } from "../ui/Dropdown";
import { ConfirmModal } from "../ui/Modal";
import { ErrorBanner } from "../ui/ErrorBanner";

export function PostCard({ post }: { post: Post }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deletePost(post.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete post. Please try again."
      );
    }
    setIsModalOpen(false);
    setIsDeleting(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="rounded overflow-hidden shadow-lg bg-surface rounded-md">
        {error && (
          <div className="p-4">
            <ErrorBanner message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-teal rounded-full flex items-center justify-center text-white font-bold">
              {post.user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-light">{post.user.name}</h3>
              <span className="text-muted text-sm">@{post.user.username}</span>
            </div>

            <Dropdown
              trigger={
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-muted hover:text-light transition-colors p-2"
                  aria-label="Post options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              }
              options={[
                {
                  label: "Delete Post",
                  onClick: () => setIsModalOpen(true),
                  variant: "danger",
                },
              ]}
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-light">{post.title}</div>
          <p className="text-muted leading-relaxed">{post.body}</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsDropdownOpen(false);
        }}
        onConfirm={handleDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete Post"}
        cancelLabel="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
