"use server";

import { prisma } from "../../../lib/prisma";
import { ActionResponse, PaginatedResponse } from "../../posts/types/post.types";
import { UserSearchResult } from "../types/user.types";
import { simulateErrorIfEnabled } from "../../../lib/error-simulation";

type SearchUsersParams = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export async function searchUsers({
  query = "",
  page = 1,
  pageSize = 10,
}: SearchUsersParams = {}): Promise<ActionResponse<PaginatedResponse<UserSearchResult>>> {
  try {
    simulateErrorIfEnabled("search_users", "search users");

    const validPage = Math.max(1, page);
    const validPageSize = Math.min(Math.max(1, pageSize), 50);

    const where = query
      ? {
          OR: [
            { name: { contains: query } },
            { username: { contains: query } },
          ],
        }
      : {};

    const skip = (validPage - 1) * validPageSize;

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: validPageSize,
        select: {
          id: true,
          name: true,
          username: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    const transformedUsers: UserSearchResult[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      postsCount: user._count.posts,
    }));

    const totalPages = Math.ceil(totalItems / validPageSize);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    return {
      success: true,
      data: {
        data: transformedUsers,
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
    console.error("Error searching users:", error);

    return {
      success: false,
      error: "Failed to search users. Please try again later.",
    };
  }
}
