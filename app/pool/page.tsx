// app/pool/page.tsx
"use client"; // Using client components
import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentCard from "../components/contentCard"; // Importing the ContentCard component
import { PreviewPost } from "@/types/Posts";
import './pool.css'; // Import CSS for styling

const PoolPage = () => {
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
    tags: "",
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
        const { name, startDate, endDate, tags } = filters;
        const response = await axios.get('/api/posts', {
            params: {
                name,
                startDate,
                endDate,
                tags,
            },
        });
        if (response.status === 200) {
            setPosts(response.data);
        } else {
            console.error("Failed to fetch posts:", response.status);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
      try {
          const response = await axios.get('/api/post/fetch/common'); // Adjust the endpoint based on your API structure
          if (response.status === 200) {
              setPosts(response.data);
          } else {
              console.error("Failed to fetch posts:", response.status);
          }
      } catch (error) {
          console.error("Error fetching posts:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchAllPosts();
  }, []);

  return (
      <div className="pool-container">
          <div className="pool-left">
              <h2>Filtering</h2>
          </div>
          <div className="pool-right">
              <h2>Content Posts</h2>
              {loading ? (
                  <p>Loading posts...</p>
              ) : (
                  <div className="pool-content-grid">
                      {posts.map((post) => (
                          <ContentCard key={post.id} post={post} />
                      ))}
                  </div>
              )}
          </div>
      </div>
  );
};

export default PoolPage;