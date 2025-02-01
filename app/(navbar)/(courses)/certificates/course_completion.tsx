"use client"
import React, { useState } from 'react';
import { Award, CheckCircle, Clock, Medal, User } from 'lucide-react';

interface Assessment {
    id: string;
    title: string;
    duration: number;
    totalQuestions: number;
    passingScore: number;
}

interface Certificate {
    recipientName: string;
    courseName: string;
    instructorName: string;
    completionDate: string;
    grade: string;
}

function App() {
    const [assessment] = useState<Assessment>({
        id: '1',
        title: 'Final Course Assessment',
        duration: 60,
        totalQuestions: 50,
        passingScore: 70,
    });

    const [certificate] = useState<Certificate>({
        recipientName: 'John Doe',
        courseName: 'Advanced Web Development',
        instructorName: 'Sarah Johnson',
        completionDate: new Date().toLocaleDateString(),
        grade: 'A',
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Course Completion</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Assessment Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Assessment Details</h2>
                            <Medal className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-gray-700">Total Questions</span>
                                </div>
                                <span className="font-medium">{assessment.totalQuestions}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-blue-500 mr-3" />
                                    <span className="text-gray-700">Duration</span>
                                </div>
                                <span className="font-medium">{assessment.duration} minutes</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Award className="w-5 h-5 text-yellow-500 mr-3" />
                                    <span className="text-gray-700">Passing Score</span>
                                </div>
                                <span className="font-medium">{assessment.passingScore}%</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Start Assessment
                        </button>
                    </div>

                    {/* Certificate Preview */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Certificate Preview</h2>
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>

                        <div className="border-4 border-gray-200 p-6 rounded-lg">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center mb-4">
                                    <Award className="w-16 h-16 text-yellow-500" />
                                </div>

                                <h3 className="text-2xl font-serif text-gray-900">Certificate of Completion</h3>

                                <p className="text-gray-600">This certifies that</p>

                                <p className="text-xl font-semibold text-gray-900">{certificate.recipientName}</p>

                                <p className="text-gray-600">has successfully completed</p>

                                <p className="text-xl font-semibold text-gray-900">{certificate.courseName}</p>

                                <div className="pt-4">
                                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>Instructor: {certificate.instructorName}</span>
                                    </div>

                                    <div className="text-sm text-gray-500 mt-2">
                                        Completed on {certificate.completionDate}
                                    </div>

                                    <div className="text-sm font-medium text-blue-600 mt-2">
                                        Grade: {certificate.grade}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            Download Certificate
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;