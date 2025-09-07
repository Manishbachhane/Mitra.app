import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import supabase from "../supabase-client";

interface PostInput {
  title: string;
  content: string;
  image_url?: string;
}

// Upload + Insert into "post" table
const createPost = async ({ post, imageFile }: { post: PostInput; imageFile: File | null }) => {
  let imageUrl: string | null = null;

  if (imageFile) {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

    // Upload image
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    // Get Public URL
    const { data: PublicUrlData } = supabase.storage.from("post-images").getPublicUrl(filePath);
    imageUrl = PublicUrlData.publicUrl;
  }

  // Insert into post table
  const { data, error } = await supabase
    .from("post")
    .insert({ ...post, image_url: imageUrl })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { mutate, status } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setMessage({ type: "success", text: "✅ Post created successfully!" });
      setTitle("");
      setContent("");
      setImageFile(null);
    },
    onError: (err: Error) => {
      setMessage({ type: "error", text: `❌  ${err.message}` });
    },
  });

  // Auto clear messages after 3 sec
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setMessage({ type: "error", text: "❌ Title is required" });
      return;
    }
    mutate({ post: { title, content }, imageFile }); // ✅ sahi call
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] mx-auto bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-1">
          Content
        </label>
        <textarea
          id="content"
          rows={5}
          className="w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-200 mb-1">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="w-full text-gray-300"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "pending"}
        className="w-full rounded-lg bg-blue-600 py-2 px-4 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "pending" ? "Creating..." : "Create Post"}
      </button>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
  