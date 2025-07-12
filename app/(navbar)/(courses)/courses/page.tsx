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
import { apiService, createCourse as apiCreateCourse, updateCourse as apiUpdateCourse, getAllCourses as apiGetAllCourses, deleteCourse as apiDeleteCourse, getAllInstructors, ApiCourseRequest, ApiInstructor } from "@/app/components/course-player-dashboard/services/api";

interface CourseData {
    id?: string;
    courseName: string;
    courseCode: string;
    courseDescription: string;
    courseCategory: string;
    instructors: { instructorId: number }[];
    courseDuration: number;
    courseMode: string;
    maxEnrollments: number;
    courseFee: number;
    language: string;
    enrolledStudents?: number;
    totalAssignments?: number;
    completedAssignments?: number;
    averageGrade?: number;
    status?: 'active' | 'draft' | 'archived';
    startDate?: Date;
    endDate?: Date;
    thumbnail?: string;
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
    const [availableInstructors, setAvailableInstructors] = useState<ApiInstructor[]>([]);

    const fields = [
        { label: "Course Name", id: "courseName", type: "text", required: true },
        { label: "Description", id: "courseDescription", type: "textarea" },
        { label: "Instructor(s)", id: "instructors", type: "select-multiple", options: availableInstructors.map(inst => ({ label: `${inst.firstName} ${inst.lastName}`, value: inst.instructorId.toString() })), required: true },
        { label: "Duration", id: "courseDuration", type: "number" },
        { label: "Mode of Delivery", id: "courseMode", type: "select", options: ["Online", "Offline", "Blended"], required: true },
        { label: "Maximum Enrollments", id: "maxEnrollments", type: "number" },
        { label: "Course Fee", id: "courseFee", type: "number" },
        { label: "Language", id: "language", type: "select", options: ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)", "Japanese", "Arabic", "Hindi", "Korean"], required: true },
    ];

    const courseCategories = [
        "Development & Programming",
        "Business & Entrepreneurship",
        "IT & Software",
        "Design & Creative",
        "Marketing & Digital Marketing",
        "Personal Development",
        "Finance & Accounting",
        "Health & Fitness",
        "Music & Arts",
        "Data Science & Analytics"
    ];

    const fetchInstructors = async () => {
        try {
            const instructors = await getAllInstructors();
            setAvailableInstructors(instructors);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            setError('Failed to load instructors.');
        }
    };

    const fetchCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiGetAllCourses();
            setCourses(data.map(course => ({
                id: course.id,
                courseName: course.courseName,
                courseCode: course.courseCode,
                courseDescription: course.courseDescription,
                courseCategory: course.courseCategory,
                instructors: course.instructors.map(inst => ({ instructorId: inst.instructorId })),
                courseDuration: course.courseDuration,
                courseMode: course.courseMode,
                maxEnrollments: course.maxEnrollments,
                courseFee: course.courseFee,
                language: course.language,
                enrolledStudents: course.studentsEnrolled,
                averageGrade: course.rating,
                status: 'active', // Assuming all fetched courses are active for now
                startDate: new Date(course.createdAt),
                endDate: new Date(course.updatedAt),
                thumbnail: '' // Placeholder
            })));
        } catch (error: any) {
            setError(error.message || 'Failed to load courses. Please try again later.');
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchInstructors();
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;

        const processedValue = type === 'number'
            ? (value === '' ? undefined : Number(value))
            : value;

        setFormData(prev => ({
            ...prev,
            [id]: processedValue
        }));
    };

    const handleSelectChange = (fieldId: string, value: string | string[]) => {
        if (fieldId === 'instructors') {
            setFormData(prev => ({
                ...prev,
                instructors: (value as string[]).map(id => ({ instructorId: Number(id) }))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [fieldId]: value
            }));
        }
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

        setIsLoading(true);
        setError(null);

        try {
            const courseCode = formData.courseCode || generateRandomCourseCode();
            const courseToSave: ApiCourseRequest = {
                courseName: formData.courseName || '',
                courseCode: courseCode,
                courseDescription: formData.courseDescription || '',
                courseCategory: formData.courseCategory || '',
                instructors: formData.instructors || [],
                courseDuration: formData.courseDuration || 0,
                courseMode: formData.courseMode || '',
                maxEnrollments: formData.maxEnrollments || 0,
                courseFee: formData.courseFee || 0,
                language: formData.language || '',
            };

            let savedCourse;
            if (editingIndex !== null && courses[editingIndex]?.id) {
                savedCourse = await apiUpdateCourse(courses[editingIndex].id!, courseToSave);
            } else {
                savedCourse = await apiCreateCourse(courseToSave);
            }

            if (editingIndex !== null) {
                const updatedCourses = [...courses];
                updatedCourses[editingIndex] = {
                    ...savedCourse,
                    startDate: new Date(savedCourse.createdAt),
                    endDate: new Date(savedCourse.updatedAt),
                    status: 'active',
                    totalAssignments: 0,
                    completedAssignments: 0,
                    thumbnail: ''
                };
                setCourses(updatedCourses);
            } else {
                setCourses([...courses, {
                    ...savedCourse,
                    startDate: new Date(savedCourse.createdAt),
                    endDate: new Date(savedCourse.updatedAt),
                    status: 'active',
                    totalAssignments: 0,
                    completedAssignments: 0,
                    thumbnail: ''
                }]);
            }
            alert(`Course ${editingIndex !== null ? 'updated' : 'created'} successfully!`);
            setIsCreating(false);
            setEditingIndex(null);
            setFormData({});
            fetchCourses(); // Re-fetch courses to ensure data consistency
        } catch (error: any) {
            console.error('Error saving course:', error);
            setError(error.message || 'An error occurred while saving the course.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourse = async (index: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            setIsLoading(true);
            setError(null);
            try {
                const courseIdToDelete = courses[index].id;
                if (courseIdToDelete) {
                    await apiDeleteCourse(courseIdToDelete);
                    const updatedCourses = courses.filter((_, i) => i !== index);
                    setCourses(updatedCourses);
                    alert('Course deleted successfully!');
                } else {
                    throw new Error('Course ID not found for deletion.');
                }
            } catch (error: any) {
                console.error('Error deleting course:', error);
                setError(error.message || 'An error occurred while deleting the course.');
            } finally {
                setIsLoading(false);
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
                                <Select
                                    value={formData.courseCategory || ''}
                                    onValueChange={(value) => handleSelectChange('courseCategory', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select course category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                ) : field.type === "select-multiple" ? (
                                    <Select
                                        value={formData.instructors?.map(inst => inst.instructorId.toString()) || []}
                                        onValueChange={(values) => handleSelectChange(field.id, values)}
                                        multiple // Enable multi-select
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${field.label}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((opt: any) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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