import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase-client";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}


const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase.from("communities").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Community[];
}


export const CommunityList = () => {

  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading) {
    return <div>Loading communities...</div>;
  }

  if (error) {
    return <div>Error{error.message} loading communities.</div>;
  }
  return (
    <div>
      {""}
      {data?.map((community, key) => (
        <div key={key} className="bg-gray-800 p-4 mb-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white">{community.name}</h2>
          <p className="text-gray-300">{community.description}</p>
        </div>
      ))}
    </div>
  )
};