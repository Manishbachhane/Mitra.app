import { useMutation } from "@tanstack/react-query";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";


interface post {
  postId: number;
}

const vote = async (votevalue: number, postId: number, userId: number) => {

  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {

    if (existingVote.vote === votevalue) {
      // User is trying to cast the same vote again, remove the vote
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) {
        throw new Error(error.message);
      }
    }

    const { error } = await supabase
      .from("votes")
      .insert([{ post_id: postId, user_id: userId, vote: votevalue }]);
    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: votevalue });
    if (error) {
      throw new Error(error.message);
    }
  }
};

function LikeButton({ postId }: post) {

  // Replace with actual userId retrieval logic
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (votevalue: number) => {
      if (!user) throw new Error("User not logged in");
      return vote(votevalue, postId, user.id);
    }
  });

  return (
    <div className="flex space-x-4 mt-4 h-10">
      <button
        className="bg-blue-500 text-white w-24 px-4 py-2 rounded"
        onClick={() => mutate(1)}
      >
        Like
      </button>
      <button
        className="bg-red-500 text-white w-24 px-4 py-2 rounded"
        onClick={() => mutate(-1)}
      >
        Dislike
      </button>
    </div>
  );
}
export default LikeButton;