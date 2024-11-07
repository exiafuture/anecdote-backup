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
    media?: Media[]
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
}

export default function TopIsOne() {
    const {subforumId,topicId} = useParams();
    const [topAndItsCom,setTopAndItsCom] = useState<Topic|null>(null);
    const [nestedComments, setNestedComments] = useState<NestedComment[]>([]);
    const [uniqueFor,setUniqueFor] = useState<string[]>([]);

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

    const CommentNode: React.FC<CommentNodeProps> = ({ comment }) => (
        <div style={{ marginLeft: comment.replyToId ? "0.75rem" : "0", padding: "13px 15px", border: "0px solid #ddd" }}>
            {comment.media && comment.media.map(media => (
                <div key={media.id}>
                    <a href={media.url} target="_blank" rel="noopener noreferrer">View Media</a>
                </div>
            ))}
            <div>
                {comment.replyToId&&(
                    <div>
                        <strong>[</strong><em>@{comment.replyToId}</em><strong>]</strong>
                    </div>
                    )
                }
                {comment.replyToId&&(<hr/>)}
                <p>{comment.text}</p>
                <strong>at {comment.forReplyId}</strong>
            </div>
            {comment.children.map(child => (
                <CommentNode key={child.id} comment={child} />
            ))}
        </div>
    );

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
            console.log(uniqueFor);
        } catch (error) {
          console.error("Error fetching topic data:", error);
        }
    };

    return (
        <div className="specific-chat-page">
            {topAndItsCom && (
                <>
                    <h1>{topAndItsCom.title}</h1>
                    <p className="dep-p">{topAndItsCom.description}</p>
                    <hr/>
                    {nestedComments.map(comment => (
                        <CommentNode key={comment.id} comment={comment} />
                    ))}
                </>
            )}
        </div>
    );
}