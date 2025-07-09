"use client";

import { ProfileForm } from "./profile";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="container max-w-3xl py-8">
            <div className="mb-6">
                <Link
                    href="/dashboard"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                    legacyBehavior>
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
                            Last updated: {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <Separator className="my-6" />
            <Card>
                <CardContent className="pt-6">
                    <ProfileForm />
                </CardContent>
            </Card>
            <footer className="mt-8 text-center text-sm text-muted-foreground">
                <p>Need help? Contact <Link href="/support" className="underline hover:text-foreground">support</Link></p>
            </footer>
        </div>
    );
}