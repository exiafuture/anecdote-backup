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

  const resetFilters = () => {
    setFilters({
      name: "",
      after: "",
      username: "",
      before: "",
      tags: [],
    });
  };

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
        <h2>Filter Search</h2>
        <form onSubmit={handleFilterSubmit} className="pool-filter-form">
          <div className="pool-form-group">
            <label htmlFor="username">
              Username:
            </label>
            <input type="text" name="username" id="username" value={filters.username} onChange={handleFilterChange} />
          </div>
          <div className="pool-form-group">
            <label htmlFor="name">
              Content Title:
            </label>
            <input type="text" id="name" name="name" value={filters.name} onChange={handleFilterChange} />
          </div>
          <div className="pool-form-group">
            <label htmlFor="after">
              After Date:
            </label>
            <input type="date" name="after" id="after" value={filters.after} onChange={handleFilterChange} />
          </div>
          <div className="pool-form-group">
            <label htmlFor="before">
              Before Date:
            </label>
            <input type="date" name="before" id="before" value={filters.before} onChange={handleFilterChange} />
          </div>
          <div className="pool-form-group">
            <label htmlFor="tags">
              Tags:
            </label>
            <input type="text" name="tags" id="tags" 
              value={filters.tags?.join(", ")} onChange={handleTagsChange} 
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div className="pool-filter-action-btn-group">
            <button type="submit" className="pool-filter-button">Apply</button>
            <button type="button" className="pool-reset-button" onClick={resetFilters}>Reset</button>
          </div>
        </form>
      </div>
      <div className="pool-right">
        <div className="header-flex">
          <h2>Content Posts</h2>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            Go to Bottom
          </button>
        </div>
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
      <button className="back-to-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to Top
      </button>
    </div>
  );
};

export default PoolPage;