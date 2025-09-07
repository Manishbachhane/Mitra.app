import { useParams } from 'react-router-dom';
import { PostDetail } from '../components/PostDetail';

export const PostPages = () => {

  const { id } = useParams<{ id: string }>();

  return (
    <div className="my-4 mx-auto max-w-7xl">
      <PostDetail postId={Number(id)} />
    </div>
  );
}