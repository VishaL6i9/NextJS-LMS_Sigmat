'use client'; 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from './NotificationDropdown';

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationDropdown />
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">John Doe</span>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/default-avatar.png" alt="John Doe" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}