"use client";
import "./topic.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Comment {
    id: number;
    text?: string | null;
    createdAt: Date;
    forReplyId: string;
    replyToId?: string | null;
    media?: Media[]
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
}

interface NestedComment extends Comment {
    replies: NestedComment[];
}

export default function TopIsOne() {
    const router = useRouter();
    const {subId,topicId} = useParams();
    const [topAndItsCom,setTopAndItsCom] = useState<Topic|null>(null);
    const [nestedComments, setNestedComments] = useState<Comment[]>([]);

    useEffect(()=> {
        fetchAllCom();
    },[])

    const buildNestedComments = (comments: Comment[]): NestedComment[] => {
        const commentMap: Record<string, NestedComment> = {};
        comments.forEach((comment) => {
            commentMap[comment.forReplyId] = { ...comment, replies: [] };
        });
        const nestedComments: NestedComment[] = [];
        comments.forEach((comment) => {
            if (comment.replyToId && commentMap[comment.replyToId]) {
                commentMap[comment.replyToId].replies.push(commentMap[comment.forReplyId]);
            } else {
                nestedComments.push(commentMap[comment.forReplyId]);
            }
        });
        nestedComments.forEach((comment) => {
          comment.replies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        return nestedComments;
    };
      
    const CommentItem = ({ comment }: { comment: NestedComment }) => (
        <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <p>{comment.text}</p>
            {comment.media?.map(media => (
                <img key={media.id} src={media.url} alt="comment media" style={{ maxWidth: '100px' }} />
            ))}
            {comment.replies.length > 0 && (
                <div>
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );

    const fetchAllCom = async () => {
        try {
          const response = await axios.get(`http://localhost:3030/subforum/${subId}/topics/${topicId}`);
          const data: Topic = response.data;
          setTopAndItsCom(data);
          const nested = buildNestedComments(data.comments);
          setNestedComments(nested);
        } catch (error) {
          console.error("Error fetching topic data:", error);
        }
    };

    return (
        <div></div>
    );
}