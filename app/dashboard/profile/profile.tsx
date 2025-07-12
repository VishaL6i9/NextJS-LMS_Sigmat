"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Upload } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import {useRouter} from "next/navigation";
import * as http from "node:http";

const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    timezone: z.string(),
    language: z.string(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
const base_url = "http://localhost:8080";

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            timezone: "UTC",
            language: "en",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            let imageUrlToRevoke = null;

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push('/auth');
                    toast({title: "Invalid Session",
                        description: "Please Login Before Proceeding.",
                        variant: "default"});
                    throw new Error("Authentication token not found");

                }
                

                const getuserID = await fetch(`${base_url}/api/user/profile/getuserID`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!getuserID.ok) {
                    throw new Error("Failed to fetch user ID");
                }

                const userID = await getuserID.text();
                localStorage.setItem('userid', userID);

                const response = await fetch(`${base_url}/api/user/profile/${userID}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                profileForm.reset(data);

                try {
                    const getProfileImageID= await fetch(`${base_url}/api/user/profile/getProfileImageID/${userID}`,{
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const profileImageID = await getProfileImageID.text();
                    localStorage.setItem('profileImageID',profileImageID);
                    const imageResponse = await fetch(`${base_url}/api/public/get-image/${profileImageID}`, {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (imageResponse.ok) {

                        //standard is null check is not working for some reason.
                        const contentType = imageResponse.headers.get('content-type');
                        if (contentType && contentType.startsWith('image/')) {
                            const imageBlob = await imageResponse.blob();
                            const imageUrl = URL.createObjectURL(imageBlob);
                            setAvatar(imageUrl);
                            imageUrlToRevoke = imageUrl;
                        } else {
                            console.warn("Invalid content type received:", contentType);
                            setAvatar(null);
                        }
                    } else {
                        if (imageResponse.status !== 404) {
                            console.warn(`Image fetch returned status: ${imageResponse.status}`);
                        }
                        setAvatar(null);
                    }
                } catch (imageError) {
                    console.error("Error fetching profile image:", imageError);
                    setAvatar(null);
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setError(errorMessage);
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false);
            }

            return () => {
                if (imageUrlToRevoke) {
                    URL.revokeObjectURL(imageUrlToRevoke);
                }
            };
        };

        const cleanup = fetchUserData();

        return () => {
            cleanup.then(cleanupFn => cleanupFn && cleanupFn());
        };
    }, [profileForm]);

    async function onSubmitProfile(values: z.infer<typeof profileSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userid");
            const token = localStorage.getItem("token");

            if (!userId) {
                throw new Error("User ID is not available");
            }

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`${base_url}/api/user/profile`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...values, id: userId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to update profile");
            }

            profileForm.reset();
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
                variant: "default",
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            toast({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmitPassword(values: z.infer<typeof passwordSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userid");
            const token = localStorage.getItem("token");

            if (!userId) {
                throw new Error("User ID is not available");
            }

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const url = new URL(`${base_url}/api/user/profile/password`);
            url.searchParams.append("userID", userId);
            url.searchParams.append("currentPassword", values.currentPassword);
            url.searchParams.append("newPassword", values.newPassword);

            const response = await fetch(url.toString(), {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to update password");
            }

            passwordForm.reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            toast({
                title: "Password Updated",
                description: "Your password has been updated successfully.",
                variant: "default",
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            toast({
                title: "Password Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
            console.error("Error updating password:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // @ts-ignore
        localStorage.setItem('file',file);
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image size must be less than 5MB.",
                variant: "destructive",
            });
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only JPG, PNG, and GIF files are allowed.",
                variant: "destructive",
            });
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('file', file);

            const userId = localStorage.getItem("userid");
            const response = await axios.post(`${base_url}/api/user/profile/pic/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast({
                    title: "Avatar Updated",
                    description: "Your profile picture has been updated.",
                    variant: "default",
                });
            } else {
                throw new Error("Failed to update profile picture.");
            }
        } catch (error) {
            toast({
                title: "Avatar Update Failed",
                description: "Failed to update profile picture.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {error && (
                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive mb-4">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
                            <CardDescription>Manage your personal information and account settings</CardDescription>
                        </div>
                        <Badge variant="outline" className="mt-2 sm:mt-0">
                            User Account
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
                        <Avatar className="h-32 w-32 border-4 border-primary/10">
                            <AvatarImage src={avatar || ""} alt="Profile" />
                            <AvatarFallback className="bg-primary/5 text-primary text-xl">
                                {profileForm.getValues("firstName")?.charAt(0) || ""}
                                {profileForm.getValues("lastName")?.charAt(0) || ""}
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-full sm:w-auto space-y-2">
                            <label
                                htmlFor="avatar-upload"
                                className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                            >
                                <Upload size={16} />
                                Upload new picture
                            </label>
                            <Input
                                type="file"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleAvatarChange}
                                className="max-w-xs hidden"
                                id="avatar-upload"
                            />
                            <p className="text-sm text-muted-foreground">
                                JPG, PNG or GIF. Max size 5MB.
                            </p>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User size={16} />
                                Profile Details
                            </TabsTrigger>
                            <TabsTrigger value="password" className="flex items-center gap-2">
                                <Lock size={16} />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6 py-4">
                                <TabsContent value="profile">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="First name" {...field} className="bg-background" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Last name" {...field} className="bg-background" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="your.email@example.com"
                                                        {...field}
                                                        className="bg-background"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. +1 (555) 123-4567"
                                                        {...field}
                                                        className="bg-background"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="timezone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time Zone</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background">
                                                                <SelectValue placeholder="Select timezone" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                                                            <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                                                            <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                                                            <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                                                            <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                                                            <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={profileForm.control}
                                            name="language"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Language</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background">
                                                                <SelectValue placeholder="Select language" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="en">English</SelectItem>
                                                            <SelectItem value="es">Spanish</SelectItem>
                                                            <SelectItem value="fr">French</SelectItem>
                                                            <SelectItem value="de">German</SelectItem>
                                                            <SelectItem value="zh">Chinese</SelectItem>
                                                            <SelectItem value="ja">Japanese</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="mt-8">
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={isLoading}
                                            size="lg"
                                        >
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </form>
                        </Form>

                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6 py-4">
                                <TabsContent value="password">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your current password"
                                                        {...field}
                                                        className="bg-background"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        {...field}
                                                        className="bg-background"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.
                                                </p>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="mt-6">
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        {...field}
                                                        className="bg-background"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="mt-8">
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={isLoading}
                                            size="lg"
                                        >
                                            {isLoading ? "Updating Password..." : "Update Password"}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </form>
                        </Form>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
