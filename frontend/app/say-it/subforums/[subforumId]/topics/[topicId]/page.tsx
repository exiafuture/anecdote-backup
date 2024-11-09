"use client";
import "./topic.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Comment {
    id: number;
    text?: string | null;
    createdAt: Date;
    forReplyId: string;
    replyToId?: string | null;
    media?: Media[];
    support:number;
    reject:number;
}

interface Label {
    id: number;
    name: string;
}

interface Media {
    id: number;
    url: string;
}
  
interface Topic {
    id: number;
    title: string;
    description: string;
    comments: Comment[];
    labels: Label[];
}

interface NestedComment extends Comment {
    children: NestedComment[];
}

interface CommentNodeProps {
    comment: NestedComment;
    onId: (forId:string)=>void;
}

export default function TopIsOne() {
    const {subforumId,topicId} = useParams();
    const [topAndItsCom,setTopAndItsCom] = useState<Topic|null>(null);
    const [nestedComments, setNestedComments] = useState<NestedComment[]>([]);
    const [uniqueFor,setUniqueFor] = useState<string[]>([]);
    const [uniqueBadge,setUniqueBadge] = useState<Label[]>([]);
    const [selectedReplyToId,setSelectedReplyToId] = useState<string>("");

    useEffect(()=> {
        fetchAllCom();
    },[])

    const extractUniqueForReplyIds = (comments: Comment[]): string[] => {
        const uniqueIds = new Set<string>();
        comments.forEach(comment => {
            uniqueIds.add(comment.forReplyId);
        });
        return Array.from(uniqueIds);
    };

    const extractUniqueLabels = (topic: Topic): Label[] => {
        const uniqueLab = new Set<Label>();
        topic.labels.forEach(l => {
            uniqueLab.add(l);
        });
        return Array.from(uniqueLab);
    };

    const selectReplyToWhich = (forId:string) => {
        setSelectedReplyToId(forId);
    };

    const CommentNode: React.FC<CommentNodeProps> = ({ comment,onId }) => {
        const [lastTouchEnd, setLastTouchEnd] = useState(0);

        const handleDoubleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            selectReplyToWhich(comment.forReplyId);
        };

        const handleDoublePress = (event: React.TouchEvent) => {
            event.stopPropagation();
            const currentTime = new Date().getTime();
            if (currentTime - lastTouchEnd < 300) {
                selectReplyToWhich(comment.forReplyId);
            }
            setLastTouchEnd(currentTime);
        };

        return (
            <div 
                onDoubleClick={handleDoubleClick}
                onTouchEnd={handleDoublePress}
                className="entire-ho"
                style={{ marginLeft: comment.replyToId ? "0.25rem" : "0", 
                padding: "13px 13px", border: "none" }}>
                {comment.media && comment.media.map(media => (
                    <div key={media.id}>
                        <a href={media.url} target="_blank" rel="noopener noreferrer">View Media</a>
                    </div>
                ))}
                <div>
                    {comment.replyToId&&(
                        <div>
                            <strong>[</strong><em className="connect-to">{comment.replyToId}</em><strong>]</strong>
                        </div>
                        )
                    }
                    {comment.replyToId&&(<hr/>)}
                    <p className="content-p">{comment.text}</p>
                    <strong className="connect-from">\ {comment.forReplyId} | {comment.support} vs {comment.reject}</strong>
                </div>
                {comment.children.map(child => (
                    <CommentNode key={child.id} comment={child} onId={onId} />
                ))}
            </div>
        )
    };

    const buildNestedComments = (comments: Comment[]): NestedComment[] => {
        const commentMap = new Map<string, NestedComment>();
    
        comments.forEach(comment => {
            commentMap.set(comment.forReplyId, { ...comment, children: [] });
        });
    
        comments.forEach(comment => {
            if (comment.replyToId) {
                const parent = commentMap.get(comment.replyToId);
                if (parent) {
                    parent.children.push(commentMap.get(comment.forReplyId)!);
                }
            }
        });
    
        return Array.from(commentMap.values()).filter(comment => !comment.replyToId);
    };

    const fetchAllCom = async () => {
        try {
            const response = await axios.get(`http://localhost:3030/subforum/${subforumId}/topics/${topicId}`);
            const data: Topic = response.data;
            setTopAndItsCom(data);
            const nested = buildNestedComments(data.comments);
            setNestedComments(nested);
            const uniqueIds = extractUniqueForReplyIds(data.comments);
            setUniqueFor(uniqueIds);
            const allLab = extractUniqueLabels(data);
            setUniqueBadge(allLab);
        } catch (error) {
          console.error("Error fetching topic data:", error);
        }
    };

    return (
        <div className="specific-chat-page">
            {topAndItsCom && (
                <>
                    <h1 className="dep-hone">{topAndItsCom.title}</h1>
                    <p className="dep-p">{topAndItsCom.description}</p>
                    <ul className="previous-page-filter">
                        {
                            uniqueBadge.map((f4)=>(
                                <li key={f4.id}>#{f4.name}{
                                    uniqueBadge.indexOf(f4)!==uniqueBadge.length-1 && ","}</li>
                            ))
                        }
                    </ul>
                    <hr/>
                    {nestedComments.map(comment => (
                        <CommentNode key={comment.id} comment={comment} onId={selectReplyToWhich} />
                    ))}
                    <div className="sticky-input-bar">
                        <div className="input-container">
                            <textarea
                            className="big-text-input"
                            placeholder="Type your comment here..."
                            rows={4}
                            ></textarea>
                            <div className="forReplyId-section">
                                <input
                                    type="text"
                                    className="reply-id-input"
                                    placeholder="Enter unique forReplyId"
                                />
                                <span className="validity-check">✅</span>
                            </div>
                            <select className="reply-dropdown"
                                value={selectedReplyToId} // Set the value to controlled state
                                onChange={(e) => setSelectedReplyToId(e.target.value)}
                            >
                            <option value="">Need A ReplyId?</option>
                            {uniqueFor.map((id) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                            </select>
                            <button className="submit-btn">Submit</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}