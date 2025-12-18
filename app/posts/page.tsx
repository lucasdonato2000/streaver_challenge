import { getPosts } from "../../features/posts/actions";
import { ErrorBanner } from "../../components/ui/ErrorBanner";
import { PostsList } from "../../components/posts/PostsList";

type PostsPageProps = {
  searchParams: { page?: string };
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 10;

  const result = await getPosts({ page, pageSize });

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-light mb-3">
            Community Posts
          </h1>
          <p className="text-muted text-lg">
            Discover what our community is sharing
            {result.success &&
              result.data &&
              ` • ${result.data.pagination.totalItems} posts`}
          </p>
        </div>

        {!result.success && <ErrorBanner message={result.error} />}

        {result.success && result.data && result.data.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">
           { `No posts yet. Run "npm run prisma:seed" and reload the page to populate sample posts.`}
            </p>
          </div>
        )}

        {result.success && result.data && result.data.data.length > 0 && (
          <PostsList initialData={result.data} />
        )}
      </div>
    </div>
  );
}
