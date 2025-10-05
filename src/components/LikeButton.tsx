import { useMutation } from "@tanstack/react-query";
import supabase from "../supabase-client";


interface post {
  postId: number;
}

  const vote = async (votevalue: number, postId: number, userId: number) => {
   const {error } = await supabase
      .from("votes")
      .insert([{ post_id: postId, user_id: userId, vote: votevalue }]);
    if (error) {
      throw new Error(error.message);
    }
  }

function LikeButton({ postId }: post) {

  // Replace with actual userId retrieval logic
  const userId = 1;

  const { mutate } = useMutation({
    mutationFn: ({ votevalue, postId, userId }: { votevalue: number; postId: number; userId: number }) => {
      if (!userId) throw new Error("User not logged in");
      return vote(votevalue, postId, userId);
    }
  });

  return (
    <div className="flex space-x-4 mt-4 h-10">
      <button
        className="bg-blue-500 text-white w-24 px-4 py-2 rounded"
        onClick={() => mutate({ votevalue: 1, postId, userId })}
      >
        Like
      </button>
      <button
        className="bg-red-500 text-white w-24 px-4 py-2 rounded"
        onClick={() => mutate({ votevalue: -1, postId, userId })}
      >
        Dislike
      </button>
    </div>
  );
}
export default LikeButton;