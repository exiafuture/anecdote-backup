"use client";
import "./subforum.css"
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Topic {
    id: number;
    title: string;
    createdAt: Date;
    description: string;
}

interface SubForumWithAllTop {
    id:number;
    name:string;
    description:string;
    createdAt: Date;
    topics:Topic[];
}

export default function OneSub() {
    const router = useRouter();
    const {subforumId} = useParams();
    const [subWithTop, setSubWithTop] = useState<SubForumWithAllTop|null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubforum = async () => {
        try {
            axios.get(`http://localhost:3030/subforum/${subforumId}`)
            .then((response) => setSubWithTop(response.data))
            .catch((error) => console.error('Error fetching subforums:', error));
        } catch(error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubforum();
    }, []);

    return (
        <div className="that-sub-only-sub-page">
            {loading?(<p>Loading</p>)
                :subWithTop===null ? (
                    <p>No Valid Info Retrieved</p>
                ): (
                    <div className="that-sub-only-content-container">
                        <div className="that-sub-only-sub-content">
                            <h2 className="that-sub-only-sub-heading">{subWithTop.name}</h2>
                            <h5 className="that-sub-only-sub-leading">{subWithTop.description}</h5>
                            <figcaption className="that-sub-only-sub-date">formed at {new Date(subWithTop.createdAt).toLocaleDateString()}</figcaption>
                        </div>
                        <hr/>
                        <ul className="that-sub-only-sub-list">
                            {subWithTop.topics.map((top)=>(
                                <li className="that-sub-only-sub-list-item" key={top.id}>
                                    <h3 className="that-sub-only-sub-list-item-header">{top.title}</h3>
                                    <p className="that-sub-only-sub-list-item-subheader">{top.description}</p>
                                    <span className="that-sub-only-sub-list-item-date">
                                        {new Date(top.createdAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
};