"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Upload, ArrowLeft } from "lucide-react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    getUserId,
    getUserProfile,
    getProfileImageId,
    getProfileImage,
    updateUserProfile,
    updatePassword,
    uploadProfileImage,
    getInstructorProfile,
    getInstructorIdFromToken,
    getInstructorProfileImageId,
    getInstructorProfileImage,
    updateInstructorProfile,
    updateInstructorPassword,
    uploadInstructorProfileImage,
    ApiError,
    UserProfile,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    InstructorProfile,
    InstructorProfileDTO,
} from "@/app/components/services/api";

const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    timezone: z.string(),
    language: z.string(),
});

const instructorProfileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().min(1, "Phone number is required"),
    bio: z.string().optional(),
    specialization: z.string().optional(),
    facebookHandle: z.string().optional(),
    linkedinHandle: z.string().optional(),
    youtubeHandle: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    accountHolderName: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().optional(),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isInstructor, setIsInstructor] = useState(false);
    const router = useRouter();

    // Dynamic password schema based on user role
    const getPasswordSchema = (isInstructorRole: boolean) => z
        .object({
            currentPassword: isInstructorRole
                ? z.string().optional()
                : z.string().min(1, "Current password is required"),
            newPassword: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(
                    /[^A-Za-z0-9]/,
                    "Password must contain at least one special character"
                ),
            confirmPassword: z.string().min(1, "Please confirm your new password"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        });

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

    const instructorProfileForm = useForm<z.infer<typeof instructorProfileSchema>>({
        resolver: zodResolver(instructorProfileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            bio: "",
            specialization: "",
            facebookHandle: "",
            linkedinHandle: "",
            youtubeHandle: "",
            bankName: "",
            accountNumber: "",
            routingNumber: "",
            accountHolderName: "",
            timezone: "UTC",
            language: "en",
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(getPasswordSchema(isInstructor)),
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
                    router.push("/auth/login");
                    toast({
                        title: "Invalid Session",
                        description: "Please Login Before Proceeding.",
                        variant: "default",
                    });
                    throw new Error("Authentication token not found");
                }

                // Decode token to get user role
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const roles = tokenPayload.roles || [];
                setUserRole(roles.join(', '));
                const isInstructorRole = roles.includes('INSTRUCTOR');
                setIsInstructor(isInstructorRole);

                // Reset password form with new schema
                passwordForm.reset({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                if (isInstructorRole) {
                    // Fetch instructor profile
                    try {
                        const instructorId = await getInstructorIdFromToken();
                        localStorage.setItem("instructorId", instructorId.toString());

                        const instructorData = await getInstructorProfile(instructorId);
                        instructorProfileForm.reset({
                            firstName: instructorData.firstName || "",
                            lastName: instructorData.lastName || "",
                            email: instructorData.email || "",
                            phoneNo: instructorData.phoneNo || "",
                            bio: instructorData.bio || "",
                            specialization: instructorData.specialization || "",
                            facebookHandle: instructorData.facebookHandle || "",
                            linkedinHandle: instructorData.linkedinHandle || "",
                            youtubeHandle: instructorData.youtubeHandle || "",
                            bankName: instructorData.bankName || "",
                            accountNumber: instructorData.accountNumber || "",
                            routingNumber: instructorData.routingNumber || "",
                            accountHolderName: instructorData.accountHolderName || "",
                            timezone: instructorData.timezone || "UTC",
                            language: instructorData.language || "en",
                        });

                        try {
                            const profileImageID = await getInstructorProfileImageId(instructorId);
                            localStorage.setItem("profileImageID", profileImageID);
                            const imageBlob = await getInstructorProfileImage(instructorId);

                            const imageUrl = URL.createObjectURL(imageBlob);
                            setAvatar(imageUrl);
                            imageUrlToRevoke = imageUrl;
                        } catch (imageError) {
                            if (imageError instanceof ApiError && imageError.status === 404) {
                                setAvatar(null);
                            } else {
                                console.error("Error fetching instructor profile image:", imageError);
                                setAvatar(null);
                            }
                        }
                    } catch (instructorError) {
                        console.error("Error fetching instructor profile:", instructorError);
                        setError("Failed to load instructor profile");
                    }
                } else {
                    // Fetch regular user profile
                    const userID = await getUserId();
                    localStorage.setItem("userid", userID);

                    const data = await getUserProfile(userID);
                    profileForm.reset(data);

                    try {
                        const profileImageID = await getProfileImageId(userID);
                        localStorage.setItem("profileImageID", profileImageID);
                        const imageBlob = await getProfileImage(profileImageID);

                        const imageUrl = URL.createObjectURL(imageBlob);
                        setAvatar(imageUrl);
                        imageUrlToRevoke = imageUrl;
                    } catch (imageError) {
                        if (imageError instanceof ApiError && imageError.status === 404) {
                            setAvatar(null);
                        } else {
                            console.error("Error fetching profile image:", imageError);
                            setAvatar(null);
                        }
                    }
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "An unknown error occurred";
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
            cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
        };
    }, [profileForm, instructorProfileForm, router]);

    async function onSubmitProfile(values: z.infer<typeof profileSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userid");
            const token = localStorage.getItem("token");

            if (!userId) {
                throw new Error("User ID not found");
            }

            const profileData: Omit<UpdateProfileRequest, 'id'> = { ...values };
            await updateUserProfile(userId, profileData);

            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            toast({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmitInstructorProfile(values: z.infer<typeof instructorProfileSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const instructorId = localStorage.getItem("instructorId");

            if (!instructorId) {
                throw new Error("Instructor ID not found");
            }

            const profileData: InstructorProfileDTO = { ...values };
            await updateInstructorProfile(parseInt(instructorId), profileData);

            toast({
                title: "Profile Updated",
                description: "Your instructor profile has been updated successfully.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            toast({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmitPassword(values: any) {
        setIsLoading(true);
        setError(null);
        try {
            if (isInstructor) {
                await updateInstructorPassword(values.newPassword);
            } else {
                const userId = localStorage.getItem("userid");
                if (!userId) {
                    throw new Error("User ID not found");
                }

                const passwordUpdateData: UpdatePasswordRequest = {
                    userID: userId,
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                };

                await updatePassword(passwordUpdateData);
            }

            passwordForm.reset();
            toast({
                title: "Password Updated",
                description: "Your password has been updated successfully.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            toast({
                title: "Password Update Failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleAvatarChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image size must be less than 5MB.",
                variant: "destructive",
            });
            return;
        }

        const validTypes = ["image/jpeg", "image/png", "image/gif"];
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

            if (isInstructor) {
                const instructorId = localStorage.getItem("instructorId");
                if (!instructorId) {
                    throw new Error("Instructor ID not found");
                }
                await uploadInstructorProfileImage(parseInt(instructorId), file);
            } else {
                const userId = localStorage.getItem("userid");
                if (!userId) {
                    throw new Error("User ID not found");
                }
                await uploadProfileImage(userId, file);
            }

            toast({
                title: "Avatar Updated",
                description: "Your profile picture has been updated.",
            });
        } catch (error) {
            toast({
                title: "Avatar Update Failed",
                description: "Failed to update profile picture.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-6">
                <Button onClick={() => router.push("/user/home")} variant="outline" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Profile Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>
            </div>
            <Separator className="my-6" />


            {error && (

                <div
                    className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive mb-4"

                >
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}


            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Your Profile
                            </CardTitle>
                            <CardDescription>
                                Manage your personal information and account settings
                            </CardDescription>
                        </div>
                        <Badge
                            variant="outline"
                            className={`mt-2 sm:mt-0 ${isInstructor ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}
                        >
                            {isInstructor ? 'Instructor Account' : 'User Account'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">

                        <Avatar className="h-32 w-32 border-4 border-primary/10">
                            <AvatarImage src={avatar || ""} alt="Profile" />
                            <AvatarFallback className="bg-primary/5 text-primary text-xl">
                                {isInstructor
                                    ? `${instructorProfileForm.getValues("firstName")?.charAt(0) || ""}${instructorProfileForm.getValues("lastName")?.charAt(0) || ""}`
                                    : `${profileForm.getValues("firstName")?.charAt(0) || ""}${profileForm.getValues("lastName")?.charAt(0) || ""}`
                                }
                            </AvatarFallback>
                        </Avatar>

                        <div className="w-full sm:w-auto space-y-2">
                            <label
                                htmlFor="avatar-upload"
                                className="flex items-center gap-2 text-sm font-medium cursor-pointer text-indigo-600 hover:text-indigo-700 transition-colors"
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

                        <TabsContent value="profile">
                            {isInstructor ? (
                                <Form {...instructorProfileForm}>
                                    <form
                                        onSubmit={instructorProfileForm.handleSubmit(onSubmitInstructorProfile)}
                                        className="space-y-6 py-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="First name"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Last name"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="your.email@example.com"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="phoneNo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g. +1 (555) 123-4567"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={instructorProfileForm.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Tell us about yourself..."
                                                            {...field}
                                                            className="bg-white/80"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={instructorProfileForm.control}
                                            name="specialization"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Specialization</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Machine Learning, Web Development"
                                                            {...field}
                                                            className="bg-white/80"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="facebookHandle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Facebook Handle</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="facebook.com/username"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="linkedinHandle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>LinkedIn Handle</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="linkedin.com/in/username"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="youtubeHandle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>YouTube Handle</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="youtube.com/@username"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator className="my-6" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="bankName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bank Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g. Chase Bank"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="accountHolderName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Account Holder Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Full name on account"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="accountNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Account Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Account number"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="routingNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Routing Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Routing number"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="timezone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Time Zone</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80">
                                                                    <SelectValue placeholder="Select timezone" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="UTC">UTC</SelectItem>
                                                                <SelectItem value="EST">EST</SelectItem>
                                                                <SelectItem value="CST">CST</SelectItem>
                                                                <SelectItem value="MST">MST</SelectItem>
                                                                <SelectItem value="PST">PST</SelectItem>
                                                                <SelectItem value="GMT">GMT</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={instructorProfileForm.control}
                                                name="language"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Language</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80">
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
                                                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                                                disabled={isLoading}
                                                size="lg"
                                            >
                                                {isLoading ? "Saving..." : "Save Instructor Profile"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <Form {...profileForm}>
                                    <form
                                        onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                                        className="space-y-6 py-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={profileForm.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="First name"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
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
                                                            <Input
                                                                placeholder="Last name"
                                                                {...field}
                                                                className="bg-white/80"
                                                            />
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
                                                            className="bg-white/80"
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
                                                            className="bg-white/80"
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
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80">
                                                                    <SelectValue placeholder="Select timezone" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="UTC">UTC</SelectItem>
                                                                <SelectItem value="EST">EST</SelectItem>
                                                                <SelectItem value="CST">CST</SelectItem>
                                                                <SelectItem value="MST">MST</SelectItem>
                                                                <SelectItem value="PST">PST</SelectItem>
                                                                <SelectItem value="GMT">GMT</SelectItem>
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
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80">
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
                                                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                                                disabled={isLoading}
                                                size="lg"
                                            >
                                                {isLoading ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </TabsContent>

                        <TabsContent value="password">
                            <Form {...passwordForm}>
                                <form
                                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                                    className="space-y-6 py-4"
                                >
                                    {!isInstructor && (
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
                                                            className="bg-white/80"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

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
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Must be at least 8 characters and include uppercase,
                                                    lowercase, numbers, and special characters.
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
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {isInstructor && (
                                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                                <strong>Note:</strong> As an instructor, you only need to provide your new password.
                                                Current password verification is not required.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <Button
                                            type="submit"
                                            className={`w-full sm:w-auto ${isInstructor
                                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                                                : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                                                } text-white`}
                                            disabled={isLoading}
                                            size="lg"
                                        >
                                            {isLoading
                                                ? "Updating Password..."
                                                : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <footer className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                    Need help? Contact{" "}
                    <Link
                        href="/contact-us"
                        className="underline hover:text-foreground"
                    >
                        support
                    </Link>
                </p>
            </footer>
        </div>
    );
}