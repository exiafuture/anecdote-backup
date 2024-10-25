// app/pool/[id]/page.tsx
"use client"; // Mark as a client component if required by other dependencies

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Importing useParams from next/navigation
import axios from 'axios';
import './detail.css';

interface ContentPost {
  id: string;
  title: string;
  createdAt: string;
  tags: { name: string }[];
  medias: { url: string }[];
  author: { username: string };
}

const ContentDetailPage = () => {
  const { id } = useParams(); // Access the post ID from the URL
  const [contentPost, setContentPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchContentPost();
    }
  }, [id]);

  const fetchContentPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/post/fetch/${id}`);
      if (response.status === 200) {
        setContentPost(response.data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading content post...</p>;
  }

  if (!contentPost) {
    return <p>Content post not found.</p>;
  }

  return (
    <div className="content-detail-container">
      <h1>{contentPost.title}</h1>
      <p>By {contentPost.author.username} on {new Date(contentPost.createdAt).toLocaleDateString()}</p>
      {contentPost.medias.length > 0 && (
        <img src={contentPost.medias[0].url} alt={contentPost.title} className="content-main-image" />
      )}
      <div className="content-tags">
        <h3>Tags:</h3>
        <ul>
          {contentPost.tags.map((tag) => (
            <li key={tag.name}>{tag.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentDetailPage;
