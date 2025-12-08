import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import supabase from "../supabase-client";

interface Props {
  postId: number;
}

interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

interface NewComment {
  content: string;
  parent_comment_id: number | null;
}

/* -------- API -------- */

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("Login required");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

/* -------- Component -------- */

export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (c: NewComment) =>
      createComment(c, postId, user?.id, user?.user_metadata?.user_name),
    onSuccess: () => {
      setNewCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    mutate({ content: newCommentText, parent_comment_id: null });
  };

  return (
    <div className="h-full bg-black  p-4 rounded-lg">

      <h1 className="text-xl font-bold text-white mb-3">Comments</h1>

      {/* ---------- Comments List (Scrollable) ---------- */}
      <div className="h-90 overflow-y-auto pr-2 space-y-3 mb-4">
        {isLoading && <p className="text-gray-400">Loading comments...</p>}
        {error && <p className="text-red-400">Failed to load comments</p>}

        {comments?.map((c) => (
          <div
            key={c.id}
            className="border border-gray-700 flex gap-2 p-3 rounded text-gray-200 shadow"
          >
            <div>
              <p className="text-blue-400 font-semibold">@{c.author}</p>
              <span className="text-xs text-gray-400 ">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <p className=" whitespace-pre-wrap break-words overflow-hidden max-w-full">{c.content}</p>
          </div>
        ))}
      </div>

      {/* ---------- Input FIXED at Bottom ---------- */}
      <div className="sticky  pt-4">
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full p-2 border border-gray-500 rounded bg-gray-900 text-white"
            ></textarea>

            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="text-gray-300 text-center">
            Please login to write a comment
          </p>
        )}
      </div>
    </div>
  );
};
