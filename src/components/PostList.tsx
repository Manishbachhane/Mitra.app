import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";
import { PostItem } from "./PostItem";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Convert null image_url to undefined for compatibility
  return (data as Post[]).map((post) => ({
    ...post,
    image_url: post.image_url ?? undefined,
  }));
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[]>({
    queryKey: ["post"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-10">
        Error loading posts: {error.message}
      </div>
    );
  }

  return (
    <div className="my-8 mx-auto max-w-7xl px-4">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 text-center mb-10">
        Recent Posts
      </h2>

      {/* Posts Grid */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-10">
          No posts available. Be the first to create one! 🚀
        </div>
      )}
    </div>
  );
};
