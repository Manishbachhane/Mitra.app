import { Link } from "react-router-dom";



// Define the Post type if not imported from elsewhere
type Post = {
  id: any;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
};

// PostItem.tsx
export const PostItem = ({ post }: { post: Post }) => {
  return (
  <div className="rounded-2xl w-60 overflow-hidden transform transition duration-300 
                  hover:scale-105 shadow-lg shadow-purple-500/50 hover:shadow-2xl hover:shadow-white-600/70">
    {/* Image */}
    <Link to={`/posts/${post.id}`}>
    {post.image_url && (
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-56 object-cover"
      />
    )}

    {/* Content */}
    <div className="p-4 h-28 bg-black border  text-gray-900">
      <h2 className="text-lg font-bold text-white line-clamp-2">{post.title}</h2>
      <p className="text-sm text-gray-100 line-clamp-3">{post.content}</p>
      <p className="text-xs text-gray-200 mt-2">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
    </div>
    </Link>
  </div>
);  };
