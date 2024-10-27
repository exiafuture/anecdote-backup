// app/pool/[id]/page.tsx
"use client"; // Mark as a client component if required by other dependencies

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Importing useParams from next/navigation
import axios from 'axios';
import './detail.css';
import Link from "next/link";
import { useAuth } from '@/app/context/authContext';

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
  const {user} = useAuth();

  useEffect(() => {
    if (id) {
      fetchContentPost();
      // const currentRole = localStorage.getItem("role") as "financer" | "creator";
      // setProfileRole(currentRole);
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
    return <h3>Loading content post...</h3>;
  }

  if (!contentPost) {
    return <p>Content post not found.</p>;
  }

  return (
    <div className="content-detail-container">
      <h1>{contentPost.title}</h1>
      <p>By <Link className="author-in-detail" href={`/pool/authors/${contentPost.author.username}`}>{contentPost.author.username}</Link> on {new Date(contentPost.createdAt).toLocaleDateString()}</p>
      {contentPost.medias.length > 0 && (
        <img src={contentPost.medias[0].url} alt={contentPost.title} className="content-main-image" />
      )}
      <div className="content-tags">
        <ul>
          {contentPost.tags.map((tag, index) => (
            <li key={index}>
              <Link href={`/pool/tags/${tag.name}`}>
              {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {!user && (<button className='liquidate'>purchase</button>)}
    </div>
  );
};

export default ContentDetailPage;
