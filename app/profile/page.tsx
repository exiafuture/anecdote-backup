"use client";
import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import "./profile.css";
import { useRouter } from "next/navigation";

const Profile = () => {
    const { user, logout, deleteAccount } = useAuth(); // Use logout and deleteAccount from AuthContext
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth"); // Redirect to auth page after logout
      };
    
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (confirmDelete) {
            await deleteAccount();
            router.push("/"); // Redirect to auth page after account deletion
        }
    };

    useEffect(()=>{
        if(!user) {
            router.push("/auth");
        }
    },[user,router]);

    return (
        <div className="profilepage">
            <div className="profile-left">
                <div className="introduction-profile">
                    <h1>{user?.username || "User"}</h1>
                    <p>{user?.email || "Email"}</p>
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
                    <ul>
                        <li>Content item 1</li>
                        <li>Content item 2</li>
                        <li>Content item 3</li>
                        <li>Content item 4</li>
                        <li>Content item 5</li>
                        <li>Content item 6</li>
                        <li>Content item 7</li>
                        <li>Content item 8</li>
                        <li>Content item 9</li>
                        <li>Content item 10</li>
                        <li>Content item 1</li>
                        <li>Content item 2</li>
                        <li>Content item 3</li>
                        <li>Content item 4</li>
                        <li>Content item 5</li>
                        <li>Content item 6</li>
                        <li>Content item 7</li>
                        <li>Content item 8</li>
                        <li>Content item 9</li>
                        <li>Content item 10</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
