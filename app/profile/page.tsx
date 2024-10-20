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
        console.log(user);
    },[user,router]);

    return (
        <div>
            <h1>Welcome, {user?.username || "User"}</h1>
            <p>Email: {user?.email || "Email"}</p>

            <div className="profile-actions">
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleDeleteAccount} className="delete-account-btn">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Profile;
