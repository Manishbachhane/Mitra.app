import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";


interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {

  const { error, data } = await supabase.from("communities").insert({
    name: community.name,
    description: community.description,
  });

  if (error) throw new Error(error.message);
  return data;
};



export const CreateCommunity = () => {

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const QueryClient = useQueryClient();



  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ name, description });
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-white">Create a New Community</h1>
      <div>
        <label htmlFor="communityName" className="block text-white mb-2">Community Name:</label>
        <input type="text" id="communityName" className="w-full p-2 rounded bg-gray-700 text-white mb-4" required onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description" className="block text-white mb-2">Description:</label>
        <textarea id="description" className="w-full p-2 rounded bg-gray-700 text-white mb-4" rows={4} required onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={isPending}>
        {isPending ? "Creating..." : "Create Community"}
      </button>
      {isError && <p className="text-red-500 mt-2">Failed to create community. Please try again.</p>}
    </form>
  );
};  