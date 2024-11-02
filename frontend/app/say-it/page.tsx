// summary page of all subforums and introduction of the forum
"use client";
import "./subforums.css";
import { useEffect, useState } from 'react';
import React from "react";
import axios from "axios";

interface Subforum {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export default function Subforums() {
    const [subforums, setSubforums] = useState<Subforum[]>([]);
    const [currentChunk, setCurrentChunk] = useState(0);
    const chunkSize = 4;

    useEffect(() => {
        axios.get('http://localhost:3030/subforum')
            .then((response) => setSubforums(response.data))
            .catch((error) => console.error('Error fetching subforums:', error));
    }, []);

    const totalChunks = Math.ceil(subforums.length / chunkSize);

    const subforumsToDisplay = subforums.slice(currentChunk * chunkSize, (currentChunk + 1) * chunkSize);

    if (!subforums) {
        return <div>Loading all sub-forums ...</div>;
    }

    return (
        <div className="subforums-summary-labler-page-container">
            <div className="subforums-summary-labler-left-down">
                <h2 className="subforums-summary-labler-header">All the Subforums in Anecdote @ Say-It</h2>
                <ul className="subforums-summary-labler-list">
                    {subforums.map((subforum) => (
                    <li key={subforum.id} className="subforums-summary-labler-item-mob">
                        <h3 className="subforums-summary-labler-item-title-mob">{subforum.name}</h3>
                        <p className="subforums-summary-labler-item-leading-mob">{subforum.description}</p>
                        <small className="subforums-summary-labler-item-date-mob">
                            {new Date(subforum.createdAt).toLocaleDateString()}
                        </small>
                    </li>
                    ))}
                    {subforumsToDisplay.map((subforum)=>(
                        <li key={subforum.id} className="subforums-summary-labler-item">
                            <h3 className="subforums-summary-labler-item-title">{subforum.name}</h3>
                            <p className="subforums-summary-labler-item-leading">{subforum.description}</p>
                            <small className="subforums-summary-labler-item-date">
                                {new Date(subforum.createdAt).toLocaleDateString()}
                            </small>
                        </li>
                    ))}
                </ul>
                <div className="subforums-summary-labler-pagination-controls-chunk">
                    {Array.from({length:totalChunks}).map((_,index)=>(
                        <button
                            key={index}
                            className={
                                `subforums-summary-labler-pagination-controls-chunk-btn 
                                ${index===currentChunk? "active" : ""}`
                            }
                            onClick={()=>setCurrentChunk(index)}
                        >
                            {index+1}
                        </button>
                    ))}
                </div>
            </div>
            <div className="subforums-summary-labler-right-up">

            </div>
        </div>
    );
}