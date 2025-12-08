import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";
import LikeButton from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

interface Prop {
  postId: number;
}

const fetchPostsById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

export const PostDetail = ({ postId }: Prop) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostsById(postId),
  });

  if (isLoading) return <div className="text-white">Loading...</div>;

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="w-full text-white">

      {/* -------------- MAIN GRID LAYOUT -------------- */}
      <div className="flex flex-col md:flex-row p-4 gap-4">

        {/* ---------------- LEFT SIDE (POST) ---------------- */}
        <div className="md:w-1/2 w-full  flex flex-col  p-4 rounded-xl shadow-lg">

          {/* IMAGE */}
          <img
            src={data?.image_url}
            alt={data?.title}
            className=" object-contain h-64 md:h-96 rounded-lg"
          />

          {/* CONTENT */}
          <div className="flex items-center flex-col mt-4">
            {/* TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              {data?.title}
            </h2>

            {/* CONTENT */}
            <p className=" whitespace-pre-wrap 
  break-words 
  overflow-hidden 
  max-w-full text-gray-300 mt-3 leading-relaxed">
              {data?.content}
            </p>

            {/* DATE */}
            <p className="text-gray-400 text-sm mt-2">
              Posted on:{" "}
              {data?.created_at
                ? new Date(data.created_at).toLocaleDateString()
                : "Unknown date"}
            </p>

            {/* LIKE BUTTON */}
            <div className="mt-6">
              <LikeButton postId={postId} />
            </div>
          </div>

        </div>
        {/* ---------------- RIGHT SIDE (COMMENTS) ---------------- */}
        <div className="md:w-1/2 w-full  p-4 rounded-xl ">
          <CommentSection postId={postId} />
        </div>

      </div>

    </div>
  );
};
