'use client'; 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from './NotificationDropdown';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md">
            <div className="max-w-[2000px] mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationDropdown />
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">John Doe</span>
                            <Avatar className="h-10 w-10 border-2 border-white/50">
                                <AvatarImage src="/default-avatar.png" alt="John Doe" />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}