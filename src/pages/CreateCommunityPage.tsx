import { CreateCommunity } from "../components/CreateCommunity";

const CreateCommunityPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <CreateCommunity />
      <h1 className="text-2xl font-bold mb-4 text-white">Create a New Community</h1>
    </div>
  );
};

export default CreateCommunityPage;
