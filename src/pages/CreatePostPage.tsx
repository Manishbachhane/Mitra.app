import CreatePost from "./CreatePost";

const CreatePostPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-white">Create New Post</h1>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
