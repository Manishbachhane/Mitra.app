import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";
import { PostItem } from "./PostItem";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string | undefined;
}

const fetchPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase.from("post").select("*").order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    // Convert null image_url to undefined for compatibility
    return (data as Post[]).map(post => ({
      ...post,
      image_url: post.image_url === null ? undefined : post.image_url
    }));
} 

export const PostList = () => {
  const { data,error,isLoading } = useQuery<Post[]>({
    queryKey: ["post"],
    queryFn: fetchPosts
  });


  if(isLoading) <div>Loading...</div>

  if(error){
    return <div>Error loading posts: {error.message}</div>
  }

  console.log(data);

return (
  <div className="my-4 mx-auto max-w-7xl">
    <div className="text-4xl font-bold text-purple-600 text-center mb-6">
      Recent Posts
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 place-items-center">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  </div>
);

};
