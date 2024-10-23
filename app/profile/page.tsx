"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import "./profile.css";
import { useRouter } from "next/navigation";
import ContentCard from "../components/contentCard";
import { PreviewPost } from "@/types/Posts";
import axios from "axios";

const Profile = () => {
    const { user, logout, deleteAccount } = useAuth(); // Use logout and deleteAccount from AuthContext
    const router = useRouter();
    const [email,setEmail] = useState("");
    const [posts, setPosts] = useState<PreviewPost[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.push("/auth"); // Redirect to auth page after logout
    };
    
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your anecdote account? Your creative ideas will be lost and unprotected!"
        );
        if (confirmDelete) {
            await deleteAccount();
            router.push("/"); // Redirect to auth page after account deletion
        }
    };

    const fetchUserPosts = async () => {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await axios.get('/api/post/fetch', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the request headers
                },
            });
            if (response.status === 200) {
                setPosts(response.data); // Set the fetched posts
            } else {
                console.error("Failed to fetch posts:", response.status);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        setLoading(false);
    };

    useEffect(()=>{
        if(!user) {
            router.push("/auth");
        } else {
            setEmail(`mailto:${user.email}?subject=Hellow&body=Hello! I am ${user.username}`);
            fetchUserPosts();
        }
    },[user,router]);

    return (
        <div className="profilepage">
            <div className="profile-left">
                <div className="introduction-profile">
                    <h1>{user?.username || "User"}</h1>
                    <a href={email}>{user?.email || "Email"}</a>
                </div>

                <div className="profile-actions">
                    <button onClick={handleLogout} className="profile-action logout-btn">
                        Logout
                    </button>
                    <button onClick={handleDeleteAccount} className="profile-action delete-btn">
                        Delete
                    </button>
                </div>
            </div>

            <div className="profile-right">
                <div className="right-upper">
                    <h2>User's Message</h2>
                    <p>Like Chinese Idiom, the fishes longing to jump and transform into dragon from the water they reside, so do I to be amazing in creating unique and provking content for the world to admire!</p>
                </div>
                <div className="right-lower">
                    <div className="content-grid">
                        {loading ? (
                            <p>Loading posts...</p>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <ContentCard 
                                    key={post.id} 
                                    post={{
                                        id: post.id,
                                        title: post.title,
                                        createdAt: post.createdAt,
                                        tags: post.tags, // Extracting tag names
                                        image: post.image != "" ? post.image : 'https://tinyurl.com/ycx4t8tw' // Get the first image or empty string
                                    }} 
                                />
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
