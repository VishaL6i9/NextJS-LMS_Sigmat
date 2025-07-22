"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { requestPasswordReset, resetPassword, ApiError } from "@/app/components/services/api";

const requestFormSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const resetFormSchema = z.object({
    token: z.string().min(1, "OTP is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [step, setStep] = useState<"request" | "reset">("request");
    const [email, setEmail] = useState("");

    const requestForm = useForm<z.infer<typeof requestFormSchema>>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const resetForm = useForm<z.infer<typeof resetFormSchema>>({
        resolver: zodResolver(resetFormSchema),
        defaultValues: {
            token: "",
            newPassword: "",
        },
    });

    async function onRequestSubmit(values: z.infer<typeof requestFormSchema>) {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            await requestPasswordReset(values.email);
            setEmail(values.email);
            setSuccessMessage("An OTP has been sent to your email address.");
            setStep("reset");
        } catch (error) {
            console.error(error);
            if (error instanceof ApiError) {
                setErrorMessage(error.response?.message || error.message);
            } else {
                setErrorMessage("An error occurred while sending the OTP.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function onResetSubmit(values: z.infer<typeof resetFormSchema>) {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await resetPassword(email, values.token, values.newPassword);
            setSuccessMessage("Your password has been reset successfully. You can now log in with your new password.");
            // Optionally, redirect to login page after a delay
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 3000);
        } catch (error) {
            console.error(error);
            if (error instanceof ApiError) {
                setErrorMessage(error.response?.message || error.message);
            } else {
                setErrorMessage("An error occurred while resetting your password.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                    {step === "request" ? "Forgot Password" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                    {step === "request" 
                        ? "Enter your email and we'll send you an OTP to reset your password."
                        : "Enter the OTP you received and your new password."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {errorMessage && (
                    <div className="p-3 mb-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                        {errorMessage}
                    </div>
                )}
                
                {successMessage && (
                    <div className="p-3 mb-4 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
                        {successMessage}
                    </div>
                )}

                {step === "request" ? (
                    <Form {...requestForm}>
                        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="grid gap-4">
                            <FormField
                                control={requestForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : "Send OTP"}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...resetForm}>
                        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="grid gap-4">
                            <FormField
                                control={resetForm.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={resetForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                )}

                <div className="mt-4 text-center text-sm">
                    Remember your password?{" "}
                    <a href="/auth/login" className="underline">
                        Sign in
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
