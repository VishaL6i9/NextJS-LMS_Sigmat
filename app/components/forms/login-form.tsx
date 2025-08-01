"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useUser } from "@/app/contexts/UserContext";
import { login, getUserId, getUserRoles, getUserProfile, getProfileImageId, getProfileImage, ApiError, UserProfile } from "@/app/components/services/api";

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const { setUserProfile } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form submitted with values:', values); // Debug log
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const token = await login(values.username, values.password);
            console.log('Token received:', token);
            localStorage.setItem('token', token);

            // Fetch user profile after successful login
            const userID = await getUserId();
            localStorage.setItem("userid", userID);

            const profileData: UserProfile = await getUserProfile(userID);

            let profileImage: string | null = null;
            try {
                const profileImageID = await getProfileImageId(userID);
                const imageBlob = await getProfileImage(profileImageID);
                profileImage = URL.createObjectURL(imageBlob);
            } catch (imageError) {
                if (imageError instanceof ApiError && imageError.status === 404) {
                    // No image found, use default placeholder
                    profileImage = null;
                } else {
                    console.error("Error fetching profile image:", imageError);
                    profileImage = null;
                }
            }

            setUserProfile({ ...profileData, profileImage });

            // Fetch user roles after successful login to determine routing
            try {
                const roles = await getUserRoles();
                const roleNames = roles.map(role => role.name || role.toString());

                // Route based on user roles (priority order)
                if (roleNames.includes('SUPER_ADMIN')) {
                    router.push('/dashboard/super-admin-home');
                } else if (roleNames.includes('INSTITUTION')) {
                    router.push('/institution/dashboard');
                } else if (roleNames.includes('INSTRUCTOR')) {
                    router.push('/instructor/home');
                } else if (roleNames.includes('USER')) {
                    router.push('/user/home');
                } else {
                    // Default fallback if no recognized role
                    router.push('/auth/login');
                }
            } catch (roleError) {
                console.error('Failed to fetch user roles for routing:', roleError);
                // Default fallback route if role fetching fails
                router.push('/auth/login');
            }

        } catch (error: any) {
            console.error('Login error:', error);
            if (error instanceof ApiError) {
                setErrorMessage(error.response?.message || error.message);
            } else {
                setErrorMessage(error.message || 'An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to login
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                                {errorMessage && (
                                    <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                                        {errorMessage}
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    //placeholder="your_username"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                <a
                                                    href="/auth/forgot-password"
                                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input type="password" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </form>
                        </Form>
                        {/* <div className="relative flex justify-center text-xs uppercase">
                            <Separator className="shrink" />
                            <span className="bg-background text-muted-foreground absolute px-2 top-1/2 -translate-y-1/2">
                                Or continue with
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Button variant="outline" type="button" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="sr-only">Login with Apple</span>
                            </Button>
                            <Button variant="outline" type="button" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="sr-only">Login with Google</span>
                            </Button>
                            <Button variant="outline" type="button" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="sr-only">Login with Meta</span>
                            </Button>
                        </div> */}
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/auth/register" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
