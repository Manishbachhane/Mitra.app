import { PostList } from "../components/PostList";

  export default function Home() {
  return (
    <div>
      <h1 className=""> Hello Home!</h1>
      <p className="text-blue-500">Welcome to the Home Page</p>
      <PostList />
    </div>
  )
}
