'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CourseData {
    courseName: string;
    courseCode: string;
    courseDescription: string;
    courseCategory: string;
    courseInstructor: string[];
    courseDuration: number;
    courseMode: string;
    maxEnrollments: number;
    courseFee: number;
    language: string;
}

export default function InstructorDashboard() {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [formData, setFormData] = useState<Partial<CourseData>>({});

    const fields = [
        { label: "Course Name", id: "courseName", type: "text", required: true },
        { label: "Course Code", id: "courseCode", type: "text", required: true },
        { label: "Description", id: "courseDescription", type: "textarea" },
        { label: "Category", id: "courseCategory", type: "select", options: ["Science", "Math", "Arts"], required: true },
        { label: "Instructor(s)", id: "courseInstructor", type: "select-multiple", options: ["Instructor 1", "Instructor 2"], required: true },
        { label: "Duration", id: "courseDuration", type: "number" },
        { label: "Mode of Delivery", id: "courseMode", type: "select", options: ["Online", "Offline", "Blended"], required: true },
        { label: "Maximum Enrollments", id: "maxEnrollments", type: "number" },
        { label: "Course Fee", id: "courseFee", type: "number" },
        { label: "Language", id: "language", type: "select", options: ["English",
                "French",
                "Spanish",
                "German",
                "Italian",
                "Portuguese",
                "Russian",
                "Chinese (Mandarin)",
                "Japanese",
                "Arabic",
                "Hindi",
                "Korean"], required: true },
    ];

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`);
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

        if (index !== null && courses[index]) {
            setFormData({...courses[index]});
        } else {
            setFormData({});
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;

        if (type === 'select-multiple') {
            const selectElement = e.target as HTMLSelectElement;
            const selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [id]: selectedValues
            }));
            return;
        }

        const processedValue = type === 'number'
            ? (value === '' ? undefined : Number(value))
            : value;

        setFormData(prev => ({
            ...prev,
            [id]: processedValue
        }));
    };

    const handleSelectChange = (fieldId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const addCourse = async (event: FormEvent) => {
        event.preventDefault();

        const requiredFields = fields.filter(f => f.required).map(f => f.id);
        const missingFields = requiredFields.filter(field =>
            !formData[field] ||
            (Array.isArray(formData[field]) && formData[field].length === 0)
        );

        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const url = editingIndex !== null
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${editingIndex}`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/courses`;
            const method = editingIndex !== null ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                setIsCreating(false);
                setEditingIndex(null);
            } else {
                alert('Failed to save course.');
            }
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const deleteCourse = async (index: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${index}`, { method: 'DELETE' });
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

        return (
            <form onSubmit={addCourse}>
                <h3 className="text-2xl font-bold mb-4">{editingIndex !== null ? 'Edit' : 'Create'} Course</h3>
                {fields.slice(start, end).map((field) => (
                    <div key={field.id} className="mb-4">
                        <Label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </Label>
                        {field.type === "select" ? (
                            <Select
                                value={formData[field.id] || ''}
                                onValueChange={(value) => handleSelectChange(field.id, value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : field.type === "select-multiple" ? (
                            <Select
                                value={(formData[field.id] as string[] || []).join(',')}
                                onValueChange={(value) => handleSelectChange(field.id, value.split(','))}
                                multiple
                            >
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
                                value={formData[field.id] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
                            />
                        ) : (
                            <Input
                                type={field.type}
                                id={field.id}
                                value={formData[field.id] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 sm:text-sm"
                            />
                        )}
                    </div>
                ))}
                <div className="mt-4">
                    {currentPage > 0 && (
                        <Button type="button" variant="outline" onClick={() => setCurrentPage(currentPage - 1)} className="mr-2">
                            Previous
                        </Button>
                    )}
                    {end < fields.length && (
                        <Button type="button" variant="outline" onClick={() => setCurrentPage(currentPage + 1)} className="mr-2">
                            Next
                        </Button>
                    )}
                    <Button type="submit">
                        {editingIndex !== null ? 'Update' : 'Create'} Course
                    </Button>
                </div>
            </form>
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
                {courses.map((course, index) => (
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