// summary page of all subforums and introduction of the forum
"use client";
import "./subforums.css";
import { useEffect, useState } from 'react';
import React from "react";

interface Subforum {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export default function Subforums() {
    const [subforums, setSubforums] = useState<Subforum[]>([]);

    useEffect(() => {
        fetch('http://localhost:3030/subforum')
            .then((response) => response.json())
            .then((data) => setSubforums(data))
            .catch((error) => console.error('Error fetching subforums:', error));
    }, []);

    if (!subforums) {
        return <div>Loading all sub-forums ...</div>;
    }

    return (
        <div>
          <h2>Subforums</h2>
          <ul>
            {subforums.map((subforum) => (
              <li key={subforum.id}>
                <h3>{subforum.name}</h3>
                <p>{subforum.description}</p>
              </li>
            ))}
          </ul>
        </div>
    );
}