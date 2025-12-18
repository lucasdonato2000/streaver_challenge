"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PostCard } from "./PostCard";
import { Pagination } from "../ui/Pagination";
import { UserFilter } from "../users/UserFilter";
import { PostsListSkeleton } from "../ui/Skeleton";
import { getPosts } from "../../features/posts/actions/get-posts";
import { Post, PaginatedResponse } from "../../features/posts/types/post.types";
import { UserSearchResult } from "../../features/users/types/user.types";

type PostsListProps = {
  initialData: PaginatedResponse<Post>;
};

export function PostsList({ initialData }: PostsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", currentPage, selectedUser?.id],
    queryFn: async () => {
      const result = await getPosts({
        page: currentPage,
        pageSize: 8,
        userId: selectedUser?.id,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    placeholderData: initialData,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/posts?${params.toString()}`);
  };

  const handleUserSelect = (user: UserSearchResult | null) => {
    setSelectedUser(user);

    if (user && currentPage !== 1) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.push(`/posts?${params.toString()}`);
    }
  };

  const postsData = data ?? initialData;

  return (
    <>
      <div className="mb-6">
        <UserFilter selectedUser={selectedUser} onUserSelect={handleUserSelect} />
      </div>

      {isLoading ? (
        <PostsListSkeleton count={3} />
      ) : (
        <>
          <div className="space-y-6">
            {postsData.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={postsData.pagination.page}
            totalPages={postsData.pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={postsData.pagination.hasNextPage}
            hasPreviousPage={postsData.pagination.hasPreviousPage}
          />
        </>
      )}
    </>
  );
}
