"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().default(false),
    role: z.string().nonempty("Role is required").default("learner"),
});

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter(); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
            role: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`${base_url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.email,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed! Invalid credentials.');
            }

            const token = await response.text();
            console.log(token);
            localStorage.setItem('token', token);
            
            router.push('/dashboard/profile');

        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const FormItemComponent = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <FormItem>
            <FormLabel aria-label={label}>{label}</FormLabel>
            <FormControl>
                {children}
            </FormControl>
            <FormMessage />
        </FormItem>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItemComponent label="Email">
                            <Input placeholder="email@example.com" {...field} />
                        </FormItemComponent>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItemComponent label="Password">
                            <Input type="password" {...field} />
                        </FormItemComponent>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItemComponent label="Role">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="learner">Learner</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItemComponent>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Remember me</FormLabel>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </Form>
    );
}
