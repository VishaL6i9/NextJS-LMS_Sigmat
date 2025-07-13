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

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Replace with your actual API call
        console.log(values);

        setSuccessMessage("If an account with that email exists, a password reset link has been sent.");
        setIsLoading(false);
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {errorMessage && (
                            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                                {errorMessage}
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
                                {successMessage}
                            </div>
                        )}

                        <FormField
                            control={form.control}
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
                            ) : "Send Reset Link"}
                        </Button>

                        <div className="text-center text-sm">
                            Remember your password?{" "}
                            <a href="/auth/login" className="underline">
                                Sign in
                            </a>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
