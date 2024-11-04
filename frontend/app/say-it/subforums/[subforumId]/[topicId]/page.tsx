"use client";
import "./topic.css";
import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function TopIsOne() {
    const router = useRouter();
    const {subid,topic} = useParams();

    return (
        <div></div>
    );
}