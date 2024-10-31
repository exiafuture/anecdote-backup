"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import './alltags.css';
import { useRouter } from "next/navigation";
import { TagType } from "@/types/Posts";

const AllTagCollectionPage = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTags();
  }, []);

  const handleTagClick = (tagName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents triggering the card click event
    router.push(`/pool/tags/${tagName}`);
  };

  const fetchAllTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/post/fetch/alltags");
      if (response.status === 200) {
        setTags(response.data);
      } else {
        console.error("Failed to fetch tag:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tag", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alltag-collection-container">
      <h1>All Tags in Ideas | Amount = {tags.length}</h1>
      {loading ? (
        <p className="alltag-expanding">Loading tags...</p>
      ) : tags.length > 0 ? (
        <div className="alltag-collection-grid">
            {
                tags.map((tag, index) => (
                    <span key={index}
                      className="along-tag"
                      onClick={(event) => handleTagClick(tag.name, event)}
                    >{tag.name}</span>
                ))
            }
        </div>
      ) : (
        <p className="alltag-expanding">No tag found in "ideas".</p>
      )}
    </div>
  );
};

export default AllTagCollectionPage;
