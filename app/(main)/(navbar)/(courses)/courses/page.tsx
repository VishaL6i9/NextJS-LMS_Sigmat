
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CourseSearch } from "@/app/components/CourseSearch";
import { apiService, createCourse as apiCreateCourse, updateCourse as apiUpdateCourse, getAllCourses as apiGetAllCourses, deleteCourse as apiDeleteCourse, getAllInstructors, ApiCourseRequest, ApiInstructor, getUserRoles } from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, ChevronsUpDown, PlusCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

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

const courseSchema = z.object({
    id: z.string().optional(),
    courseName: z.string().min(1, "Course Name is required"),
    courseCode: z.string().optional(),
    courseDescription: z.string().optional(),
    courseCategory: z.string().min(1, "Course Category is required"),
    instructors: z.array(z.object({ instructorId: z.number() })).min(1, "At least one instructor is required"),
    courseDuration: z.number().min(0, "Duration must be a positive number"),
    courseMode: z.string().min(1, "Mode of Delivery is required"),
    maxEnrollments: z.number().min(0, "Max Enrollments must be a positive number"),
    courseFee: z.number().min(0, "Course Fee must be a positive number"),
    language: z.string().min(1, "Language is required"),
    enrolledStudents: z.number().optional(),
    totalAssignments: z.number().optional(),
    completedAssignments: z.number().optional(),
    averageGrade: z.number().optional(),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    thumbnail: z.string().optional(),
});

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

export default function CoursesManagement() {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('list');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [availableInstructors, setAvailableInstructors] = useState<ApiInstructor[]>([]);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const { toast } = useToast();

    const form = useForm<CourseData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            courseName: '',
            courseCode: '',
            courseDescription: '',
            courseCategory: '',
            instructors: [],
            courseDuration: 0,
            courseMode: '',
            maxEnrollments: 0,
            courseFee: 0,
            language: '',
            status: 'active',
            startDate: undefined,
            endDate: undefined,
        },
    });

    const { handleSubmit, control, reset, setValue, formState: { errors } } = form;

    const fetchUserRoles = async () => {
        try {
            const roles = await getUserRoles();
            // Extract role names from Role objects
            const roleNames = roles.map(role => role.name || role.toString());
            setUserRoles(roleNames);
        } catch (error) {
            console.error('Failed to fetch user roles:', error);
        }
    };

    const fetchInstructors = async () => {
        try {
            const instructors = await getAllInstructors();
            setAvailableInstructors(instructors);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            toast({
                title: "Error",
                description: "Failed to load instructors.",
                variant: "destructive",
            });
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
                status: 'active',
                startDate: course.createdAt ? new Date(course.createdAt) : undefined,
                endDate: course.updatedAt ? new Date(course.updatedAt) : undefined,
                thumbnail: ''
            })));
        } catch (error: any) {
            setError(error.message || 'Failed to load courses. Please try again later.');
            toast({
                title: "Error",
                description: error.message || 'Failed to load courses. Please try again later.',
                variant: "destructive",
            });
            console.error('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchInstructors();
        fetchUserRoles();
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

    const loadCourseForm = (course?: CourseData) => {
        setIsCreating(true);
        setEditingCourseId(course?.id || null);
        reset(course || {}); // Reset form with course data or empty object
        setActiveTab('form');
    };

    const generateRandomCourseCode = () => {
        return 'COURSE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const onSubmit = async (data: CourseData) => {
        setIsLoading(true);
        setError(null);

        try {
            const courseCode = data.courseCode || generateRandomCourseCode();
            const courseToSave: ApiCourseRequest = {
                courseName: data.courseName,
                courseCode: courseCode,
                courseDescription: data.courseDescription || '',
                courseCategory: data.courseCategory,
                instructors: data.instructors,
                courseDuration: data.courseDuration,
                courseMode: data.courseMode,
                maxEnrollments: data.maxEnrollments,
                courseFee: data.courseFee,
                language: data.language,
            };

            let savedCourse;
            if (editingCourseId) {
                savedCourse = await apiUpdateCourse(editingCourseId, courseToSave);
                toast({
                    title: "Success",
                    description: "Course updated successfully!",
                });
            } else {
                savedCourse = await apiCreateCourse(courseToSave);
                toast({
                    title: "Success",
                    description: "Course created successfully!",
                });
            }

            setIsCreating(false);
            setEditingCourseId(null);
            reset();
            fetchCourses();
        } catch (error: any) {
            console.error('Error saving course:', error);
            setError(error.message || 'An error occurred while saving the course.');
            toast({
                title: "Error",
                description: error.message || 'An error occurred while saving the course.',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourse = async (courseId: string) => {
        if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            setIsLoading(true);
            setError(null);
            try {
                await apiDeleteCourse(courseId);
                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
                toast({
                    title: "Success",
                    description: "Course deleted successfully!",
                });
            } catch (error: any) {
                console.error('Error deleting course:', error);
                setError(error.message || 'An error occurred while deleting the course.');
                toast({
                    title: "Error",
                    description: error.message || 'An error occurred while deleting the course.',
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const canManageCourses = userRoles.includes('ADMIN') || userRoles.includes('INSTRUCTOR');

    const renderForm = () => {
        if (!canManageCourses) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl mx-auto"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">
                            {editingCourseId ? 'Edit Course' : 'Create New Course'}
                        </CardTitle>
                        <Separator className="my-4" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="courseName">Course Name</Label>
                                    <Controller
                                        name="courseName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter course name"
                                            />
                                        )}
                                    />
                                    {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseCategory">Course Category</Label>
                                    <Controller
                                        name="courseCategory"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
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
                                        )}
                                    />
                                    {errors.courseCategory && <p className="text-red-500 text-sm">{errors.courseCategory.message}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="courseDescription">Description</Label>
                                    <Controller
                                        name="courseDescription"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="Enter course description"
                                                className="min-h-[100px]"
                                            />
                                        )}
                                    />
                                    {errors.courseDescription && <p className="text-red-500 text-sm">{errors.courseDescription.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseDuration">Duration (in hours)</Label>
                                    <Controller
                                        name="courseDuration"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                value={field.value === 0 ? '' : field.value}
                                                placeholder="e.g., 40"
                                            />
                                        )}
                                    />
                                    {errors.courseDuration && <p className="text-red-500 text-sm">{errors.courseDuration.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseMode">Mode of Delivery</Label>
                                    <Controller
                                        name="courseMode"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["Online", "Offline", "Blended"].map((mode) => (
                                                        <SelectItem key={mode} value={mode}>
                                                            {mode}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.courseMode && <p className="text-red-500 text-sm">{errors.courseMode.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxEnrollments">Maximum Enrollments</Label>
                                    <Controller
                                        name="maxEnrollments"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                value={field.value === 0 ? '' : field.value}
                                                placeholder="e.g., 100"
                                            />
                                        )}
                                    />
                                    {errors.maxEnrollments && <p className="text-red-500 text-sm">{errors.maxEnrollments.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="courseFee">Course Fee</Label>
                                    <Controller
                                        name="courseFee"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                value={field.value === 0 ? '' : field.value}
                                                placeholder="e.g., 500"
                                            />
                                        )}
                                    />
                                    {errors.courseFee && <p className="text-red-500 text-sm">{errors.courseFee.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Controller
                                        name="language"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["English", "French", "Spanish", "German", "Italian", "Portuguese", "Russian", "Chinese (Mandarin)", "Japanese", "Arabic", "Hindi", "Korean"].map((lang) => (
                                                        <SelectItem key={lang} value={lang}>
                                                            {lang}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="instructors">Instructor(s)</Label>
                                    <Controller
                                        name="instructors"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value && field.value.length > 0
                                                            ? field.value.map(selectedInst => {
                                                                const instructor = availableInstructors.find(inst => inst.instructorId === selectedInst.instructorId);
                                                                return instructor ? `${instructor.firstName} ${instructor.lastName}` : '';
                                                            }).join(", ")
                                                            : "Select instructor(s)..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search instructors..." />
                                                        <CommandList>
                                                            <CommandEmpty>No instructors found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {availableInstructors.map((instructor) => (
                                                                    <CommandItem
                                                                        key={instructor.instructorId}
                                                                        onSelect={() => {
                                                                            const currentSelected = field.value || [];
                                                                            const isSelected = currentSelected.some(inst => inst.instructorId === instructor.instructorId);
                                                                            if (isSelected) {
                                                                                setValue('instructors', currentSelected.filter(inst => inst.instructorId !== instructor.instructorId));
                                                                            } else {
                                                                                setValue('instructors', [...currentSelected, { instructorId: instructor.instructorId }]);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={field.value?.some(inst => inst.instructorId === instructor.instructorId)}
                                                                            onCheckedChange={() => {
                                                                                const currentSelected = field.value || [];
                                                                                const isSelected = currentSelected.some(inst => inst.instructorId === instructor.instructorId);
                                                                                if (isSelected) {
                                                                                    setValue('instructors', currentSelected.filter(inst => inst.instructorId !== instructor.instructorId));
                                                                                } else {
                                                                                    setValue('instructors', [...currentSelected, { instructorId: instructor.instructorId }]);
                                                                                }
                                                                            }}
                                                                            className="mr-2"
                                                                        />
                                                                        {`${instructor.firstName} ${instructor.lastName}`}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.instructors && <p className="text-red-500 text-sm">{errors.instructors.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingCourseId(null);
                                        reset();
                                        setActiveTab('list');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <span className="animate-spin mr-2">&#9696;</span>}
                                    {editingCourseId ? 'Update Course' : 'Create Course'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    const renderCourseList = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-3xl font-bold">Course Catalog</CardTitle>
                        <CourseSearch
                            onSearch={handleSearch}
                            placeholder="Search by name, category, or code..."
                        />
                    </div>
                    <Separator className="my-4" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
                            <p className="text-lg text-muted-foreground">Loading courses...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive" className="my-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Course Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Code</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Mode</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Instructors</th>
                                        {canManageCourses && <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <AnimatePresence>
                                        {filteredCourses.length > 0 ? (
                                            filteredCourses.map((course) => (
                                                <motion.tr
                                                    key={course.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="hover:bg-muted/50"
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap font-medium">{course.courseName}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <Badge variant="secondary">{course.courseCode}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{course.courseCategory}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <Badge variant="outline">{course.courseMode}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {course.instructors?.map(selectedInst => {
                                                            const instructor = availableInstructors.find(inst => inst.instructorId === selectedInst.instructorId);
                                                            return instructor ? (
                                                                <Badge key={instructor.instructorId} variant="default" className="mr-1 mb-1">
                                                                    {`${instructor.firstName} ${instructor.lastName}`}
                                                                </Badge>
                                                            ) : null;
                                                        })}
                                                    </td>
                                                    {canManageCourses && (
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => loadCourseForm(course)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id!)}>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={canManageCourses ? 6 : 5} className="text-center py-8 text-muted-foreground">
                                                    {isSearching
                                                        ? "No courses found matching your search criteria."
                                                        : "No courses available. Click 'Create New Course' to get started."}
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'list') {
            setIsCreating(false);
            setEditingCourseId(null);
            reset();
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <h1 className="text-4xl font-extrabold text-primary-foreground">Course Management</h1>
                {canManageCourses && (
                    <Button onClick={() => loadCourseForm()} className="gap-2 px-6 py-3 text-lg">
                        <PlusCircle className="h-5 w-5" />
                        <span>Create New Course</span>
                    </Button>
                )}
            </motion.div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className={`grid w-full max-w-[250px] ${canManageCourses ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <TabsTrigger value="list">Course List</TabsTrigger>
                    {canManageCourses && <TabsTrigger value="form">Course Form</TabsTrigger>}
                </TabsList>

                <AnimatePresence mode="wait">
                    {activeTab === 'list' && (
                        <TabsContent value="list" className="mt-6">
                            {renderCourseList()}
                        </TabsContent>
                    )}

                    {activeTab === 'form' && canManageCourses && (
                        <TabsContent value="form" className="mt-6">
                            {renderForm()}
                        </TabsContent>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
