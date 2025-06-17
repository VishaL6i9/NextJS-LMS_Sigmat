'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CourseSearch } from "@/app/components/CourseSearch";

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
    [key: string]: any; 
}

export default function CoursesManagement() {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [formData, setFormData] = useState<Partial<CourseData>>({});
    const [activeTab, setActiveTab] = useState('list');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const fields = [
        { label: "Course Name", id: "courseName", type: "text", required: true },
        { label: "Description", id: "courseDescription", type: "textarea" },
        { label: "Instructor(s)", id: "courseInstructor", type: "select-multiple", options: ["Instructor 1", "Instructor 2"], required: true },
        { label: "Duration", id: "courseDuration", type: "number" },
        { label: "Mode of Delivery", id: "courseMode", type: "select", options: ["Online", "Offline", "Blended"], required: true },
        { label: "Maximum Enrollments", id: "maxEnrollments", type: "number" },
        { label: "Course Fee", id: "courseFee", type: "number" },
        { label: "Language", id: "language", type: "select", options: ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)", "Japanese", "Arabic", "Hindi", "Korean"], required: true },
    ];

    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            setError('Failed to load courses. Please try again later.');
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!isSearching) {
            setFilteredCourses(courses);
        }
    }, [courses, isSearching]);

    const handleSearch = async (query: string) => {
        setIsSearching(!!query);
        if (!query) {
            setFilteredCourses(courses);
            return;
        }

        const searchResults = courses.filter(course => 
            course.courseName.toLowerCase().includes(query.toLowerCase()) ||
            course.courseDescription?.toLowerCase().includes(query.toLowerCase()) ||
            course.courseCategory?.toLowerCase().includes(query.toLowerCase()) ||
            course.courseCode.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredCourses(searchResults);
    };

    const loadCreateForm = (index: number | null = null) => {
        setIsCreating(true);
        setEditingIndex(index);
        setCurrentPage(0);
        setActiveTab('form');

        if (index !== null && courses[index]) {
            setFormData({ ...courses[index] });
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

    const generateRandomCourseCode = () => {
        return 'COURSE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
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
            const courseCode = generateRandomCourseCode(); 
            const newCourseData = { ...formData, courseCode }; 

            const url = editingIndex !== null
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseCode}`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/courses`;
            const method = editingIndex !== null ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourseData),
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
            alert('An error occurred while saving the course.');
        }
    };

    const deleteCourse = async (index: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            try {
                const courseCode = courses[index].courseCode;
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseCode}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedCourses = courses.filter((_, i) => i !== index);
                    setCourses(updatedCourses);
                    alert('Course deleted successfully!');
                } else {
                    alert('Failed to delete course.');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('An error occurred while deleting the course.');
            }
        }
    };

    const renderForm = () => {
        const start = currentPage * 5;
        const end = start + 5;

        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        {editingIndex !== null ? 'Edit Course' : 'Create New Course'}
                    </CardTitle>
                    <Separator className="my-2" />
                </CardHeader>
                <CardContent>
                    <form onSubmit={addCourse} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label htmlFor="courseCategory">Course Category</Label>
                                <Input
                                    type="text"
                                    id="courseCategory"
                                    value={formData.courseCategory || ''}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter course category"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="courseName">Course Name</Label>
                                <Input
                                    type="text"
                                    id="courseName"
                                    value={formData.courseName || ''}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter course name"
                                />
                            </div>
                        </div>

                        {fields.slice(1, end).map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id}>{field.label}</Label>
                                {field.type === "select" ? (
                                    <Select
                                        value={formData[field.id]?.toString() || ''}
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
                                ) : field.type === "textarea" ? (
                                    <Textarea
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleInputChange}
                                        required={field.required}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        className="min-h-[100px]"
                                    />
                                ) : (
                                    <Input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleInputChange}
                                        required={field.required}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-4">
                            {currentPage > 0 && (
                                <Button type="button" variant="outline" onClick={() => setCurrentPage(currentPage - 1)}>
                                    Previous
                                </Button>
                            )}
                            <div className="flex gap-2">
                                {end < fields.length && (
                                    <Button type="button" variant="outline" onClick={() => setCurrentPage(currentPage + 1)}>
                                        Next
                                    </Button>
                                )}
                                <Button type="submit" variant="default">
                                    {editingIndex !== null ? 'Update' : 'Create'} Course
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    };

    const renderCourseList = () => (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-semibold">Course Management</CardTitle>
                    <CourseSearch 
                        onSearch={handleSearch}
                        placeholder="Search by name, category, or code..."
                    />
                </div>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left font-medium">Course Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Course Code</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="px-4 py-3">{course.courseName}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{course.courseCode}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge>{course.courseMode}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => loadCreateForm(index)}>
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => deleteCourse(index)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCourses.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                {isSearching 
                                    ? "No courses found matching your search criteria."
                                    : "No courses available. Create your first course to get started."}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'list') {
            setIsCreating(false);
            setEditingIndex(null);
            setFormData({});
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Course Management</h1>
                <Button onClick={() => loadCreateForm(null)} className="gap-2">
                    <span>Create New Course</span>
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full max-w-[200px] grid-cols-1">
                    <TabsTrigger value="list">Course List</TabsTrigger>
                </TabsList>

                {activeTab === 'list' && (
                    <div className="mt-6">
                        {renderCourseList()}
                    </div>
                )}

                {activeTab === 'form' && (
                    <div className="mt-6">
                        {renderForm()}
                    </div>
                )}
            </Tabs>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}