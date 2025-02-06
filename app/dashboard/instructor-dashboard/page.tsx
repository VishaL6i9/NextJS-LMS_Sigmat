'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function InstructorDashboard() {
    const [courses, setCourses] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const fields = [
        { label: "Course Name", id: "courseName", type: "text", required: true },
        { label: "Course Code", id: "courseCode", type: "text", required: true },
        { label: "Description", id: "courseDescription", type: "textarea" },
        { label: "Category", id: "courseCategory", type: "select", options: ["Science", "Math", "Arts"], required: true },
        { label: "Instructor(s)", id: "courseInstructor", type: "select-multiple", options: ["Instructor 1", "Instructor 2"], required: true },
        { label: "Start Date", id: "courseStartDate", type: "date", required: true },
        { label: "End Date", id: "courseEndDate", type: "date" },
        { label: "Duration", id: "courseDuration", type: "number" },
        { label: "Mode of Delivery", id: "courseMode", type: "select", options: ["Online", "Offline", "Blended"], required: true },
        { label: "Maximum Enrollments", id: "maxEnrollments", type: "number" },
        { label: "Course Fee", id: "courseFee", type: "number" },
        { label: "Prerequisites", id: "prerequisites", type: "select-multiple", options: ["Course A", "Course B"] },
        { label: "Course Materials", id: "courseMaterials", type: "file", accept: ".pdf,.docx,.pptx" },
        { label: "Learning Objectives", id: "learningObjectives", type: "textarea" },
        { label: "Assessment Type", id: "assessmentType", type: "select", options: ["Quizzes", "Assignments", "Final Exam"] },
        { label: "Language", id: "language", type: "select", options: ["English", "French"], required: true },
        { label: "Course Image", id: "courseImage", type: "file", accept: ".png,.jpg,.jpeg" },
        { label: "Publish Status", id: "publishStatus", type: "select", options: ["Draft", "Published", "Archived"], required: true },
        { label: "Tags", id: "tags", type: "text" },
        { label: "Certificate Issuance", id: "certificateIssuance", type: "checkbox" }
    ];
    const API_BASE_URL = 'http://localhost:8080';
   
    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/public/courses`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

   
    const loadCreateForm = (index: number | null = null) => {
        setIsManaging(false);
        setIsCreating(true);
        setEditingIndex(index);
        setCurrentPage(0);
    };

   
    const addCourse = async (event: React.FormEvent) => {
        event.preventDefault();
        const courseData: any = {};
        fields.forEach((field) => {
            const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if (element) {
                if (field.type === "select-multiple") {
                    courseData[field.id] = Array.from((element as HTMLSelectElement).selectedOptions, (option) => option.value);
                } else if (field.type === "checkbox") {
                    courseData[field.id] = (element as HTMLInputElement).checked;
                } else {
                    courseData[field.id] = element.value;
                }
            }
        });

        try {
            const url = editingIndex !== null ? `${API_BASE_URL}/api/public/courses/${editingIndex}` : `${API_BASE_URL}/api/public/courses`;
            const method = editingIndex !== null ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData),
            });

            if (response.ok) {
                const savedCourse = await response.json();
                if (editingIndex !== null) {
                    const updatedCourses = [...courses];
                    updatedCourses[editingIndex] = savedCourse;
                    setCourses(updatedCourses);
                } else {
                    setCourses([...courses, savedCourse]);
                }
                alert(`Course ${editingIndex !== null ? 'updated' : 'created'} successfully!`);
            } else {
                alert('Failed to save course.');
            }
        } catch (error) {
            console.error('Error saving course:', error);
        }

        setIsCreating(false);
        setEditingIndex(null);
    };

    
    const deleteCourse = async (index: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/public/courses/${index}`, { method: 'DELETE' });
                if (response.ok) {
                    const updatedCourses = courses.filter((_, i) => i !== index);
                    setCourses(updatedCourses);
                    alert('Course deleted successfully!');
                } else {
                    alert('Failed to delete course.');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    
    const renderForm = () => {
        const start = currentPage * 5;
        const end = start + 5;
        const course = editingIndex !== null ? courses[editingIndex] : {};

        return (
            <div>
                <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? 'Edit' : 'Create'} Course</h3>
                {fields.slice(start, end).map((field) => (
                    <div key={field.id} className="mb-4">
                        <Label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </Label>
                        {field.type === "select" ? (
                            <Select defaultValue={course[field.id] || ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : field.type === "textarea" ? (
                            <Textarea
                                id={field.id}
                                defaultValue={course[field.id] || ''}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
                            />
                        ) : field.type === "checkbox" ? (
                            <div className="mt-1 flex items-start">
                                <div className="flex items-center h-5">
                                    <Input
                                        type="checkbox"
                                        id={field.id}
                                        defaultChecked={course[field.id] || false}
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <Label htmlFor={field.id} className="font-medium text-gray-700">
                                        {field.label}
                                    </Label>
                                </div>
                            </div>
                        ) : (
                            <Input
                                type={field.type}
                                id={field.id}
                                defaultValue={course[field.id] || ''}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
                            />
                        )}
                    </div>
                ))}
                <div className="mt-4">
                    {currentPage > 0 && (
                        <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} className="mr-2">
                            Previous
                        </Button>
                    )}
                    {end < fields.length && (
                        <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)} className="mr-2">
                            Next
                        </Button>
                    )}
                    <Button onClick={addCourse}>
                        {editingIndex !== null ? 'Update' : 'Create'} Course
                    </Button>
                </div>
            </div>
        );
    };
    
    const renderCourseList = () => (
        <div className="overflow-x-auto">
            <h3 className="text-2xl font-bold mb-4">Manage Courses</h3>
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
                        Course Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
                        Course Code
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course: any, index: number) => (
                    <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap border-b">
                            {course.courseName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap border-b">
                            {course.courseCode}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap border-b">
                            <Button variant="outline" size="icon" onClick={() => loadCreateForm(index)} className="mr-2">
                                Edit
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteCourse(index)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {courses.length === 0 && <p className="mt-4 text-center text-gray-500">No courses added yet.</p>}
        </div>
    );

    return (
        <div className="container mx-auto p-4 bg-card rounded-lg shadow-md">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground">Welcome Instructor</h1>
            </header>

            <div className="mb-8 flex justify-center">
                <Button onClick={() => loadCreateForm(null)} className="mr-4">
                    Create New Course
                </Button>
                <Button onClick={() => setIsManaging(true)}>
                    Manage Courses
                </Button>
            </div>

            {isCreating && renderForm()}
            {isManaging && renderCourseList()}

            <footer className="fixed bottom-0 w-full bg-secondary text-center p-2 text-secondary-foreground">
                @2025 LMS All rights reserved
            </footer>
        </div>
    );
}