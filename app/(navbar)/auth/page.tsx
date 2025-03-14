"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/app/components/forms/login-form";
import { RegisterForm } from "@/app/components/forms/register-form";
import { ForgotPasswordForm } from "@/app/components/forms/forgot-password-form";

export default function AuthPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col justify-center space-y-6 w-full max-w-sm">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                        <TabsTrigger value="forgot">Reset</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterForm />
                    </TabsContent>
                    <TabsContent value="forgot">
                        <ForgotPasswordForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}