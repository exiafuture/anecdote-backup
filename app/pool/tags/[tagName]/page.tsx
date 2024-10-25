// app/pool/tags/[tagName]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentCard from "@/app/components/contentCard";
import { useParams } from "next/navigation";
import { PreviewPost } from "@/types/Posts";
import './tag.css';

const TagCollectionPage = () => {
  const { tagName } = useParams();
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof tagName === 'string') { // Type guard ensures tagName is a string
      fetchTaggedPosts(tagName);
    }
  }, [tagName]);

  const fetchTaggedPosts = async (tag: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/post/fetch/tag`, {
        params: { tag },
      });
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.error("Failed to fetch tagged posts:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tagged posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tag-collection-container">
      <h1>Posts Tagged With: {tagName}</h1>
      {loading ? (
        <p className="tag-expanding">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="tag-collection-grid">
          {posts.map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="tag-expanding">No posts found with this tag.</p>
      )}
    </div>
  );
};

export default TagCollectionPage;
