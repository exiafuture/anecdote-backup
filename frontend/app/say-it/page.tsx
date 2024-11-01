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
        <div className="">
          <h2 className="">All the Subforums in Anecdote | SayIt</h2>
          <ul className="">
            {subforums.map((subforum) => (
              <li key={subforum.id} className="">
                <h3 className="">{subforum.name}</h3>
                <p className="">{subforum.description}</p>
                <small className="">
                    {new Date(subforum.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
    );
}