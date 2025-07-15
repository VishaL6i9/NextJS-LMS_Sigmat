"use client";
import React, { useState, useRef } from 'react';
import { Upload, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface User {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [registrationResults, setRegistrationResults] = useState<{
        success: string;
        failed: string;
    }>({ success: '', failed: '' });
    const [showResults, setShowResults] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setErrorMessage(null); 

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                parseCSV(content);
            } catch (error) {
                console.error("Error parsing CSV:", error);
                setErrorMessage('Error parsing CSV file. Please check the format.');
            }
        };
        reader.onerror = () => {
            setErrorMessage('Error reading file. Please try again.');
        };
        reader.readAsText(file);
    };

    const parseCSV = (content: string) => {
        const lines = content.split('\n');
        if (lines.length < 1) {
            setErrorMessage('CSV file appears to be empty.');
            return;
        }

        const parsedUsers: User[] = [];

        // Process each line assuming fixed order: username,password,email,firstname,lastname
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(value => value.trim());

            if (values.length < 5) continue;

            parsedUsers.push({
                username: values[0],
                password: values[1],
                email: values[2],
                firstName: values[3],
                lastName: values[4]
            });
        }

        setUsers(parsedUsers);
    };

    

    const prepareFormData = (selectedFile: File) => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        return formData;
    };

    const batchRegisterUsers = async () => {
        if (!selectedFile) {
            setErrorMessage('Please upload a CSV file first.');
            return;
        }

        setIsRegistering(true);
        setShowResults(false);
        setErrorMessage(null);

        try {
            const formData = prepareFormData(selectedFile);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/register/batch`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setRegistrationResults({
                success: response.data || '',
                failed: response.data.failed || '',
            });
            setShowResults(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(`Batch registration failed: ${error.message}`);
            } else {
                setErrorMessage(`An unknown error occurred: ${error}`);
            }
        } finally {
            setIsRegistering(false);
        }
    };

    const downloadTemplate = () => {
        const template = "johndoe,password123,john.doe@example.com,John,Doe\njanedoe,password456,jane.doe@example.com,Jane,Doe";
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulk_registration_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 shadow-md">
                <div className=" max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-white">LMS Bulk Registration</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload User Data</h2>

                        {errorMessage && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                                {errorMessage}
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">
                                Upload a CSV file with user information in the format:
                                <span className="font-semibold"> username,password,email,firstname,lastname</span>
                            </p>
                            <button
                                onClick={downloadTemplate}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Download CSV template
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload CSV File
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">CSV file only</p>
                                        {selectedFile && (
                                            <p className="text-xs text-green-600 mt-2">
                                                Selected: {selectedFile.name}
                                            </p>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".csv,text/csv,application/vnd.ms-excel,application/csv,text/x-csv,application/x-csv,text/comma-separated-values,text/x-comma-separated-values"
                                        onChange={handleFileUpload}
                                        disabled={isRegistering}
                                    />
                                </label>
                            </div>
                        </div>

                        {selectedFile && users.length > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={batchRegisterUsers}
                                    disabled={isRegistering || !selectedFile}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                                >
                                    {isRegistering ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Register {users.length} Users
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="mb-6 mt-6">
                            <h3 className="text-md font-medium text-gray-900 mb-2">Preview ({users.length} users)</h3>
                            {users.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Password
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                First Name
                                            </th>
                                            <th scope="col" className="px- 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Name
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {users.slice(0, 5).map((user, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.password}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.firstName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.lastName}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    {users.length > 5 && (
                                        <p className="mt-2 text-xs text-gray-500 text-right">
                                            Showing 5 of {users.length} users
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No users to display. Please upload a CSV file.</p>
                            )}
                        </div>
                    </div>

                    {showResults && (
                        <div className="mt-6 bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Registration Results</h2>

                            <div className="mb-4">
                                <div className="flex items-center text-sm text-green-600">
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    <span className="font-medium">{registrationResults.success} users registered successfully</span>
                                </div>
                                {registrationResults.failed.length > 0 && (
                                    <div className="flex items-center text-sm text-red-600 mt-1">
                                        <AlertCircle className="mr-2 h-5 w-5" />
                                        <span className="font-medium">{registrationResults.failed.length} users failed to register</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;