"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useAuth } from "../context/authContext";
import "./profile.css";

const Profile = () => {
    const router = useRouter();

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}

export default Profile;
