"use client";
import React from 'react';
import { ProfileForm } from "./profile";
import Navbar from "@/app/components/Navbar"

export default function ProfilePage() {
    return (
        <div>
            <Navbar />
        <ProfileForm/>
        </div>
    );
}
