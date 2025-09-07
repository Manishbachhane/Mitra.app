import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  // Add other fields as needed
}

interface Prop {
  postId: number;
}
const fetchPostsById = async (id: number): Promise<Post > => {
    const { data, error } = await supabase.from("post").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);

    return data as Post;
}

export const PostDetail = ({ postId }: Prop) => {

  const { data,error,isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostsById(postId)
  });

  if(isLoading) <div>Loading...</div>

  if(error){
    return <div>Error loading posts: {error.message}</div>
  }

  return (
    <div className="bg-gray-800 p-6 flex h-64 rounded-lg shadow-lg">
      <div className="mr-6 flex-shrink-0 bg-black rounded-lg overflow-hidden">
        <img src={data?.image_url} alt={data?.title} className="w-full h-full object-cover mb-4" />
      </div>
      <div>
          <h2 className="text-2xl font-bold text-white mb-4">{data?.title}</h2>
      <p className="text-gray-300 mb-4">{data?.content}</p>
      <p className="text-gray-500">
        Posted on: {data?.created_at ? new Date(data.created_at).toLocaleDateString() : "Unknown date"}
      </p>
      </div>
    </div>
  );
};

