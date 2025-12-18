"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../types/post.types";
import { simulateErrorIfEnabled } from "../../../lib/error-simulation";

export async function deletePost(postId: number): Promise<ActionResponse> {
  try {
    simulateErrorIfEnabled("delete_post", "delete post");

    if (!postId || postId < 1) {
      return {
        success: false,
        error: "Invalid post ID",
      };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/posts");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);

    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        return {
          success: false,
          error: "Post not found or already deleted",
        };
      }

      if (error.message.includes("Foreign key constraint")) {
        return {
          success: false,
          error: "Cannot delete post due to related data",
        };
      }
    }

    return {
      success: false,
      error: "Failed to delete post. Please try again later.",
    };
  }
}
