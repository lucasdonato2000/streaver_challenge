import "dotenv/config";
import { prisma } from "../lib/prisma";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

/**
 * Fisher-Yates shuffle algorithm to randomize array order
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function main(): Promise<void> {
  const usersResponse = await fetch(`${process.env.API_URL}/users`);
  const users: User[] = await usersResponse.json();

  const postsResponse = await fetch(`${process.env.API_URL}/posts`);
  const posts: Post[] = await postsResponse.json();

  console.log(`Seeding ${users.length} users...`);
  const userIdMap = new Map<number, number>();

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
    userIdMap.set(user.id, createdUser.id);
  }
  console.log(`✓ ${users.length} users created`);

  const shuffledPosts = shuffleArray(posts);
  console.log(`Seeding ${shuffledPosts.length} posts (shuffled)...`);

  for (const post of shuffledPosts) {
    const newUserId = userIdMap.get(post.userId);
    if (!newUserId) {
      console.warn(`Warning: User ID ${post.userId} not found, skipping post ${post.id}`);
      continue;
    }

    await prisma.post.create({
      data: {
        title: post.title,
        body: post.body,
        userId: newUserId,
      },
    });
  }
  console.log(`✓ ${shuffledPosts.length} posts created`);

  console.log("\n✓ Database seeded successfully!");
}

main()
  .catch((error: unknown) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
