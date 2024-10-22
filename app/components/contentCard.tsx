// components/ContentCard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import "./contentCard.css";

type Image = {
    url: string;  // Assuming images is an array of objects with a 'url' field
};

type Post = {
    id: number;
    title: string;
    createdAt: string;
    tags: string[];
    images: Image[]; // Images is now an array of Image objects
};

interface ContentCardProps {
  post: Post;
}

const ContentCard: React.FC<ContentCardProps> = ({ post }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`); // Navigate to post detail page
  };

  const firstImage = post.images.length > 0 
  ? post.images[0].url 
  : 
  'https://wieck-mbusa-production.s3.amazonaws.com/photos/649b91bd0b9f17f65f17ff07630c6e4715681c4b/preview-928x522.jpg';

  return (
    <div className="content-card" onClick={handleCardClick}>
      <div className="content-card-image">
        <img src={firstImage} alt={post.title} />
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
