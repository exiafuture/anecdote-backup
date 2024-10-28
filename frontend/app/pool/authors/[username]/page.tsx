"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentCard from "@/app/components/contentCard";
import { useParams } from "next/navigation";
import { PreviewPost } from "@/types/Posts";
import './author.css';

const CreatorCollectionPage = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof username === 'string') { // Type guard ensures authorName is a string
      fetchThatAuthorsPosts(username);
    }
  }, [username]);

  const fetchThatAuthorsPosts = async (username: string) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/post/fetch/author", {
        params: { username },
      });
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.error("Failed to fetch authorged posts:", response.status);
      }
    } catch (error) {
      console.error("Error fetching authorged posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-collection-container">
      <h1>Posts From: {username}</h1>
      {loading ? (
        <p className="author-expanding">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="author-collection-grid">
          {posts.map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="author-expanding">No posts found with this creator.</p>
      )}
    </div>
  );
};

export default CreatorCollectionPage;
