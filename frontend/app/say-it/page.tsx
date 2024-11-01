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
        <div className="subforums-summary-labler-page-container">
            <div className="subforums-summary-labler-left-down">
                <h2 className="subforums-summary-labler-header">All the Subforums in Anecdote @ Say-It</h2>
                <ul className="subforums-summary-labler-list">
                    {subforums.map((subforum) => (
                    <li key={subforum.id} className="subforums-summary-labler-item">
                        <h3 className="subforums-summary-labler-item-title">{subforum.name}</h3>
                        <p className="subforums-summary-labler-item-leading">{subforum.description}</p>
                        <small className="subforums-summary-labler-item-date">
                            {new Date(subforum.createdAt).toLocaleDateString()}
                        </small>
                    </li>
                    ))}
                </ul>
            </div>
            <div className="subforums-summary-labler-right-up">

            </div>
        </div>
    );
}