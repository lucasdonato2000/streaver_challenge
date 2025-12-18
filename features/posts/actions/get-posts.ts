"use server";

import { prisma } from "../../../lib/prisma";
import { ActionResponse, PaginatedResponse, Post } from "../types/post.types";
import { simulateErrorIfEnabled } from "../../../lib/error-simulation";

type GetPostsParams = {
  page?: number;
  pageSize?: number;
  userId?: number;
};

export async function getPosts({
  page = 1,
  pageSize = 8,
  userId,
}: GetPostsParams = {}): Promise<ActionResponse<PaginatedResponse<Post>>> {
  try {
    simulateErrorIfEnabled("load_posts", "load posts");

    const validPage = Math.max(1, page);
    const validPageSize = Math.min(Math.max(1, pageSize), 100); 

    const where = userId ? { userId } : {};

    const skip = (validPage - 1) * validPageSize;

    const [posts, totalItems] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: validPageSize,
        include: {
          user: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return {
      success: true,
      data: {
        data: posts,
        pagination: {
          page: validPage,
          pageSize: validPageSize,
          totalItems,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      success: false,
      error: "Failed to load posts. Please try again later.",
    };
  }
}
