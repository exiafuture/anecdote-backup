"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import "./profile.css";

const Profile = () => {
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('');
            setMessage('Logged out successfully!');
            console.log(`detroy user session msg: ${message}`);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'An error occurred while logging out.');
            console.log(`logout error msg: ${message}`);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('');
            setMessage('Account deleted successfully!');
            router.push("/creator");
            console.log(`remove account msg: ${message}`);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'An error occurred while deleting the account.');
            console.log(`unable to delete user account since: ${message}`);
        }
    };

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}

export default Profile;
