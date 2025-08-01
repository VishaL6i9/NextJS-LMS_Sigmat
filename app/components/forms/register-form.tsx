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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, AlertTriangle, Info } from "lucide-react";
import { registerUser, registerInstructor, ApiError, InstructorRegistrationDTO } from "@/app/components/services/api";

// Utility function to parse and format error messages
const parseRegistrationError = (error: any): { message: string; type: 'error' | 'warning' } => {
    const errorMessage = error.response?.message || error.message || "";

    // Handle database constraint violations
    if (errorMessage.includes("duplicate key value violates unique constraint")) {
        if (errorMessage.includes("users_email_key") || errorMessage.includes("email")) {
            return {
                message: "This email address is already registered in our system.",
                type: 'warning'
            };
        }
        if (errorMessage.includes("users_username_key") || errorMessage.includes("username")) {
            return {
                message: "This username is already taken. Please choose a different username.",
                type: 'error'
            };
        }
        return {
            message: "This information is already registered in our system. Please verify your details.",
            type: 'warning'
        };
    }

    // Handle specific backend error messages
    if (errorMessage.includes("Registration failed")) {
        if (errorMessage.toLowerCase().includes("email")) {
            return {
                message: "This email address is already registered in our system.",
                type: 'warning'
            };
        }
        return {
            message: errorMessage,
            type: 'error'
        };
    }

    // Handle validation errors
    if (errorMessage.includes("Invalid email")) {
        return {
            message: "Please enter a valid email address.",
            type: 'error'
        };
    }

    if (errorMessage.includes("Password")) {
        return {
            message: "Password does not meet security requirements. Please ensure it's at least 8 characters long.",
            type: 'error'
        };
    }

    // Default error message
    return {
        message: errorMessage || "An error occurred during registration. Please try again.",
        type: 'error'
    };
};

// Helper function to validate email format and provide immediate feedback
const validateEmailFormat = (email: string): string => {
    if (!email) return "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }

    return "";
};

const formSchema = z.object({
    role: z.enum(["User", "Instructor", "Institution"]),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phoneNo: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    accountHolderName: z.string().optional(),
    dateOfJoining: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.role !== "Instructor" || (data.phoneNo && data.bankName && data.accountNumber && data.routingNumber && data.accountHolderName && data.dateOfJoining), {
    message: "All instructor fields must be filled",
    path: ["phoneNo", "bankName", "accountNumber", "routingNumber", "accountHolderName", "dateOfJoining"],
});

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState<'error' | 'warning'>('error');
    const [successMessage, setSuccessMessage] = useState("");
    const [emailCheckMessage, setEmailCheckMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "User",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNo: "",
            bankName: "",
            accountNumber: "",
            routingNumber: "",
            accountHolderName: "",
            dateOfJoining: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setErrorMessage("");
        setErrorType('error');
        setSuccessMessage("");

        try {
            if (values.role === "Instructor") {
                await registerInstructor({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    username: values.email,
                    password: values.password,
                    phoneNo: values.phoneNo!,
                    bankName: values.bankName!,
                    accountNumber: values.accountNumber!,
                    routingNumber: values.routingNumber!,
                    accountHolderName: values.accountHolderName!,
                    dateOfJoining: values.dateOfJoining!,
                });
            } else {
                await registerUser({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    username: values.email,
                    password: values.password,
                });
            }

            setSuccessMessage("🎉 Registration Successful! Check Your Mailbox for a confirmation email.");
        } catch (error) {
            console.error("Registration error:", error);
            const parsedError = parseRegistrationError(error);
            setErrorMessage(parsedError.message);
            setErrorType(parsedError.type);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your details below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {errorMessage && (
                            <Alert variant={errorType === 'warning' ? 'default' : 'destructive'}
                                className={errorType === 'warning' ? 'border-amber-200 bg-amber-50' : ''}>
                                {errorType === 'warning' ? (
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertTitle className={errorType === 'warning' ? 'text-amber-800' : ''}>
                                    {errorType === 'warning' ? 'Account Already Exists' : 'Registration Error'}
                                </AlertTitle>
                                <AlertDescription className={errorType === 'warning' ? 'text-amber-700' : ''}>
                                    {errorMessage}
                                    {errorMessage.includes("email address is already registered") && (
                                        <div className="mt-3 p-3 bg-white/50 rounded-md border border-amber-200">
                                            <div className="flex items-start space-x-2">
                                                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-amber-800">
                                                        What you can do:
                                                    </p>
                                                    <div className="space-y-1 text-sm text-amber-700">
                                                        <div className="flex items-center space-x-2">
                                                            <span>•</span>
                                                            <span>
                                                                <a href="/auth/login" className="underline font-medium hover:text-amber-800">
                                                                    Sign in to your existing account
                                                                </a>
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span>•</span>
                                                            <span>Use a different email address to create a new account</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span>•</span>
                                                            <span>
                                                                <a href="/auth/forgot-password" className="underline font-medium hover:text-amber-800">
                                                                    Reset your password
                                                                </a> if you've forgotten it
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {errorMessage.includes("username is already taken") && (
                                        <div className="mt-2 text-sm">
                                            Please try a different username
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert variant="default">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="User">User</SelectItem>
                                            <SelectItem value="Instructor">Instructor</SelectItem>
                                            <SelectItem value="Institution">Institution</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            {...field}
                                            onBlur={(e) => {
                                                field.onBlur(e);
                                                const validationMessage = validateEmailFormat(e.target.value);
                                                setEmailCheckMessage(validationMessage);
                                            }}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setEmailCheckMessage("");
                                                setErrorMessage("");
                                                setErrorType('error');
                                            }}
                                        />
                                    </FormControl>
                                    {emailCheckMessage && (
                                        <p className="text-sm text-amber-600">{emailCheckMessage}</p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("role") === "Instructor" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 234 567 8900" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Bank Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Account Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="routingNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Routing Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Routing Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountHolderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Holder Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Account Holder Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="dateOfJoining"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Joining</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : "Create Account"}
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
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
