"use client";
import "./subforum.css"
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Marker {
    id: number;
    name: string;
}

interface Topic {
    id: number;
    title: string;
    createdAt: Date;
    description: string;
    labels: Marker[];
}

interface SubForumWithAllTop {
    id:number;
    name:string;
    description:string;
    createdAt: Date;
    topics:Topic[];
}

interface FilteredSubTopicsFormData {
    title?: string;
    labels?: string[];
}

export default function OneSub() {
    const router = useRouter();
    const {subforumId} = useParams();
    const [subWithTop, setSubWithTop] = useState<SubForumWithAllTop|null>(null);
    const [loading, setLoading] = useState(true);
    const [uniqueLabels, setUniqueLabels] = useState<string[]>([]);
    const [filters,setFilters] = useState<FilteredSubTopicsFormData>({
        title: "",
        labels: []
    });

    const resetFilters = () => {
        setFilters({
          title: "",
          labels: [],
        });
        fetchSubforum();
    };

    const fetchSubforum = async () => {
        try {
            const resp = await axios.get(`http://localhost:3030/subforum/${subforumId}`);
            setSubWithTop(resp.data);

            const taggingInstances = resp.data.topics.flatMap((topic: Topic) =>
                topic.labels.map((label: Marker) => label.name)
            );
            const uniqueLabelSet = Array.from(new Set(taggingInstances))as string[];
            setUniqueLabels(uniqueLabelSet);
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
                        <ul className="checker-topics-list">
                            {uniqueLabels.map((label) => (
                                <li key={label} className="unique-label-item">{label}</li>
                            ))}
                        </ul>
                        <ul className="that-sub-only-sub-list">
                            {subWithTop.topics.map((top)=>(
                                <li className="that-sub-only-sub-list-item" key={top.id}>
                                    <h3 className="that-sub-only-sub-list-item-header">{top.title}</h3>
                                    <p className="that-sub-only-sub-list-item-subheader">{top.description}</p>
                                    <ul className="tagger-list-container">
                                        <p>tags: </p>
                                        {top.labels.map((tagger)=>(
                                            <li
                                            className="tagger-list" 
                                            key={tagger.id}>
                                                <p>{tagger.name}</p>
                                                <span>{top.labels.indexOf(tagger)!==top.labels.length-1 && ","}</span>
                                            </li>
                                        ))}
                                    </ul>
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