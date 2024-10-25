// app/pool/page.tsx
"use client"; // Using client components
import React, { useEffect, useState } from "react";
import axios from "axios";
import ContentCard from "../components/contentCard"; // Importing the ContentCard component
import { PreviewPost } from "@/types/Posts";
import './pool.css'; // Import CSS for styling

interface FilteredFormData {
  username?: string;
  name?: string;
  after?: string;
  before?: string;
  tags?: string[];
}

const PoolPage = () => {
  const [posts, setPosts] = useState<PreviewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilteredFormData>({
    name: "",
    after:"",
    username:"",
    before:"",
    tags:[],
  });

  const fetchFilteredPosts = async () => {
    setLoading(true);
    try {
      const { 
        name, after,username,
        before, tags 
      } = filters;
      const response = await axios.get('/api/post/filtered', {
        params: {
          name,
          after,
          username,
          before,
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map(tag => tag.trim());
    setFilters(prevFilters => ({
      ...prevFilters,
      tags: tagsArray,
    }));
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

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredPosts();
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
      <div className="pool-container">
          <div className="pool-left">
              <h2>Filtering</h2>
              <form onSubmit={handleFilterSubmit}>
                <label>
                  Username:
                  <input type="text" name="username" value={filters.username} onChange={handleFilterChange} />
                </label>
                <label>
                  Content Title:
                  <input type="text" name="name" value={filters.name} onChange={handleFilterChange} />
                </label>
                <label>
                  After Date:
                  <input type="date" name="after" value={filters.after} onChange={handleFilterChange} />
                </label>
                <label>
                  Before Date:
                  <input type="date" name="before" value={filters.before} onChange={handleFilterChange} />
                </label>
                <label>
                  Tags (comma-separated):
                  <input type="text" name="tags" value={filters.tags?.join(", ")} onChange={handleTagsChange} />
                </label>
                <button type="submit">Apply Filters</button>
              </form>
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