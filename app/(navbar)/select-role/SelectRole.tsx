// components/SelectRole.tsx
import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';

const SelectRole: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            <header className="w-full text-center py-5 text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500">
                <h1>Select the type of role to access your LMS.</h1>
            </header>

            <div className="flex justify-center gap-5 mt-5 flex-wrap flex-grow">
                <Link href="/admin" className="box-link">
                    <div className="box bg-red-100 flex flex-col items-center p-5 rounded-lg shadow-md transition-transform duration-200 transform hover:translate-y-[-5px]">
                        <Image src="/admin.png" alt="Admin Icon" width={150} height={150} className="rounded-lg border-2 border-gray-800 object-cover" />
                        <h3 className="mt-2 text-lg font-bold">Admin</h3>
                    </div>
                </Link>
                <Link href="/dashboard/instructor-dashboard" className="box-link">
                    <div className="box bg-blue-100 flex flex-col items-center p-5 rounded-lg shadow-md transition-transform duration-200 transform hover:translate-y-[-5px]">
                        <Image src="/instructor.png" alt="Instructor Icon" width={150} height={150} className="rounded-lg border-2 border-gray-800 object-cover" />
                        <h3 className="mt-2 text-lg font-bold">Instructor</h3>
                    </div>
                </Link>
                <Link href="/student" className="box-link">
                    <div className="box bg-yellow-100 flex flex-col items-center p-5 rounded-lg shadow-md transition-transform duration-200 transform hover:translate-y-[-5px]">
                        <Image src="/student.png" alt="Student Icon" width={150} height={150} className="rounded-lg border-2 border-gray-800 object-cover" />
                        <h3 className="mt-2 text-lg font-bold">Student</h3>
                    </div>
                </Link>
            </div>

            <footer className="text-center py-2 w-full bg-gray-200 absolute bottom-0 left-0 text-sm">
                @2025 LMS All rights reserved
            </footer>
        </div>
    );
};

export default SelectRole;