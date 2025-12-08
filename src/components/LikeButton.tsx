import { useMutation, useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface post {
  postId: number;
}

interface vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const voteFn = async (votevalue: number, postId: number, userId: string) => {

  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === votevalue) {
      await supabase.from("votes").delete().eq("id", existingVote.id);
      return;
    }

    await supabase
      .from("votes")
      .update({ vote: votevalue })
      .eq("id", existingVote.id);
    return;
  }

  await supabase.from("votes").insert({
    post_id: postId,
    user_id: userId,
    vote: votevalue
  });
};


function LikeButton({ postId }: post) {

  const { user } = useAuth();
  const userId = user?.id || user?.id;

  const fetchVotes = async (postId: number) => {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("post_id", postId);

    if (error) throw new Error(error.message);
    return data as vote[];
  };

  const { data: votes, isLoading, error } = useQuery<vote[]>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 1000,
  });

  const { mutate } = useMutation({
    mutationFn: (votevalue: number) => {
      if (!userId) throw new Error("User not logged in");
      return voteFn(votevalue, postId, userId);
    }
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const likes = votes?.filter(v => v.vote === 1).length ?? 0;
  const dislikes = votes?.filter(v => v.vote === -1).length ?? 0;

  return (
    <div className="flex space-x-4 mt-4 h-10">
      <button className="bg-blue-500 text-white w-24 px-4 py-2 rounded" onClick={() => mutate(1)}>
        Like ({likes})
      </button>
      <button className="bg-red-500 text-white w-30 px-4 py-2 rounded" onClick={() => mutate(-1)}>
        Dislike ({dislikes})
      </button>
    </div>
  );
}

export default LikeButton;
