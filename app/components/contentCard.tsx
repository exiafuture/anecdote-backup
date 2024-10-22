// components/ContentCard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import "./contentCard.css";

type Post = {
  id: number;
  title: string;
  createdAt: string;
  tags: string[];
  image: string;  // Assuming images is an array of objects with a 'url' field
};

interface ContentCardProps {
  post: Post;
}

const ContentCard: React.FC<ContentCardProps> = ({ post }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`); // Navigate to post detail page
  };

  return (
    <div className="content-card" onClick={handleCardClick}>
      <div className="content-card-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="content-card-details">
        <h2>{post.title}</h2>
        <p>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
        <div className="content-card-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
