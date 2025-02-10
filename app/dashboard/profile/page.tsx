"use client";

import { ProfileForm } from "./profile";

export default function ProfilePage() {
    return (
        <div className="container max-w-2xl py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>
                <ProfileForm />
            </div>
        </div>
    );
}