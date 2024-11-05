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
    topicName?: string;
    labels?: string[];
}

export default function OneSub() {
    const router = useRouter();
    const {subforumId} = useParams();
    const [subWithTop, setSubWithTop] = useState<SubForumWithAllTop|null>(null);
    const [loading, setLoading] = useState(true);
    const [uniqueLabels, setUniqueLabels] = useState<string[]>([]);
    const [filters,setFilters] = useState<FilteredSubTopicsFormData>({
        topicName: "",
        labels: []
    });

    const resetFilters = () => {
        setFilters({
          topicName: "",
          labels: [],
        });
        fetchSubforum();
    };

    const filterOutIn = async () => {
        setLoading(true);
        try {
            const {
                topicName,
                labels
            } = filters;
            console.log(topicName,labels);
            const resp = await axios.get(
                `http://localhost:3030/subforum/${subforumId}/filter`,
                {
                    params: {
                        topicName:topicName?.trim()||"",
                        labels:labels?.length ? labels : [],
                    }
                }
            );
            if (resp.status===200) {
                setSubWithTop(resp.data);
            } else {
                console.error("failed to filter",resp.status);
                resetFilters();
                setLoading(false);
            }
        } catch(error) {
            console.error("error in retreieving filteried data",error)
        } finally {
            setLoading(false);
        }
    }

    const handleTopForwardClick = (id:number,top:number) => {
        router.push(`/say-it/subforums/${id}/topics/${top}`); 
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilers=>({
            ...prevFilers,
            [name]:value
        }))
        // setFilters({ ...filters, topicName: e.target.value });
    };

    const handleLabelChange = (label: string) => {
        setFilters(prevFilters => {
            const newLabels = prevFilters.labels?.includes(label)
                ? prevFilters.labels.filter(l => l !== label)
                : [...(prevFilters.labels || []), label];
            return { ...prevFilters, labels: newLabels };
        });
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
                        <div className="filter-section">
                            <input
                                type="text"
                                name="topicName"
                                id="topicName"
                                placeholder="Filter by title"
                                value={filters.topicName}
                                onChange={handleTitleChange}
                            />
                            <button onClick={filterOutIn}>Apply</button>
                            <button onClick={resetFilters}>Reset</button>
                            <ul className="checker-topics-list">
                                {uniqueLabels.map(label => (
                                    <li key={label} className="unique-label-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={filters.labels?.includes(label) || false}
                                                onChange={() => handleLabelChange(label)}
                                            />
                                            {label}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ul className="that-sub-only-sub-list">
                            <p className="pp"># {subWithTop.topics.length} topics met your need</p>
                            {subWithTop.topics.map((top)=>(
                                <li className="that-sub-only-sub-list-item" key={top.id} onClick={()=>handleTopForwardClick(subWithTop.id,top.id)}>
                                    <h3 className="that-sub-only-sub-list-item-header">{top.title}</h3>
                                    <p className="that-sub-only-sub-list-item-subheader">{top.description}</p>
                                    <ul className="tagger-list-container">
                                        {top.labels.length!==0 && (<p>tags: </p>)}
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
                                        {new Date(top.createdAt).toLocaleDateString()}{" "}{new Date(top.createdAt).toLocaleTimeString()}
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