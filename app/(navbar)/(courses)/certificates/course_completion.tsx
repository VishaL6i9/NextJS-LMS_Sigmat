"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle, Clock, Medal, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

interface Assessment {
    id: string;
    title: string;
    duration: number;
    totalQuestions: number;
    passingScore: number;
}

interface Certificate {
    certificateId: number;
    learnerId: number;
    learnerFirstName: string;
    courseId: number;
    courseName: string;
    instructorId: number;
    instructorFirstName: string;
    dateOfCertificate: string;
}

function App() {
    const [assessment] = useState<Assessment>({
        id: '1',
        title: 'Final Course Assessment',
        duration: 60,
        totalQuestions: 50,
        passingScore: 70,
    });
    
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);
    const base_url= process.env.NEXT_PUBLIC_BASE_URL;
    useEffect(() => {
        const fetchCertificate = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${base_url}/certificates/9999`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
                }
                const data: Certificate = await response.json();
                setCertificate(data);
            } catch (err: any) {
                console.error("Error fetching certificate:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, []);

    const handleDownload = async () => {
        if (!certificate || !certificateRef.current) {
            console.log("Certificate or ref not ready yet!");
            return;
        }

        console.log("certificateRef.current:", certificateRef.current); // Inspect the ref
        console.log("Certificate Data:", certificate);  // Check if certificate data is available


        try {
            const canvas = await html2canvas(certificateRef.current, { scale: 2 });

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Convert pixels to mm (1 px ≈ 0.264583 mm)
            const imgWidthMm = imgWidth * 0.264583;
            const imgHeightMm = imgHeight * 0.264583;

            // Create PDF with dynamic height
            const pdf = new jsPDF('p', 'mm', [imgWidthMm, imgHeightMm]);

            // Scale image while maintaining aspect ratio
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const ratio = pdfWidth / imgWidth;
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;


            const imgData = canvas.toDataURL('image/png');
            //pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height - 20);
            pdf.addImage(imgData, 'PNG', (pdfWidth - imgScaledWidth) / 2, 10, imgScaledWidth, imgScaledHeight);

            const filename = `certificate_${certificate.certificateId}.pdf`;
            const encodedFilename = encodeURIComponent(filename);

            // Get the PDF as a blob
            const blob = pdf.output('blob'); // Crucial: Get the PDF as a Blob

            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a URL for the blob
            link.setAttribute('download', encodedFilename);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Clean up
            URL.revokeObjectURL(link.href); // Release the blob URL (important for memory management)

        } catch (error) {
            console.error("Error generating or downloading PDF:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading certificate...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!certificate) {
        return <div>Certificate not found.</div>;
    }

    const formattedDate = new Date(certificate.dateOfCertificate).toLocaleDateString();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Course Completion</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Assessment Details Card (unchanged) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assessment Details</CardTitle>
                            <Medal className="w-6 h-6 text-blue-600" />
                        </CardHeader>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                <span>Total Questions</span>
                                <span className="font-medium">{assessment.totalQuestions}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                                <span>Duration</span>
                                <span className="font-medium">{assessment.duration} minutes</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <Award className="w-5 h-5 text-yellow-500 mr-3" />
                                <span>Passing Score</span>
                                <span className="font-medium">{assessment.passingScore}%</span>
                            </div>
                        </div>
                        <CardFooter className="p-4">
                            <Button>Start Assessment</Button>
                        </CardFooter>
                    </Card>

                    {/* Certificate Preview Card (UPDATED) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Certificate Preview</CardTitle>
                            <Award className="w-6 h-6 text-yellow-600" />
                        </CardHeader>
                        <div ref={certificateRef} className="border-4 border-gray-200 p-6 rounded-lg">

                        <div className="text-center space-y-4">
                                <Award className="w-16 h-16 text-yellow-500" />
                                <h3 className="text-2xl font-serif text-gray-900">Certificate of Completion</h3>
                                <p className="text-gray-600">This certifies that</p>
                                <p className="text-xl font-semibold text-gray-900">{certificate.learnerFirstName}</p> {/* Use learnerFirstName */}
                                <p className="text-gray-600">has successfully completed</p>
                                <p className="text-xl font-semibold text-gray-900">{certificate.courseName}</p> {/* Use courseName */}
                                <div className="pt-4">
                                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>Instructor: {certificate.instructorFirstName}</span> {/* Use instructorFirstName */}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">
                                        Completed on {formattedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardFooter className="p-4">
                            <Button onClick={handleDownload}>Download Certificate</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default App;