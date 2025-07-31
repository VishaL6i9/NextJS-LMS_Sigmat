"use client";

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BatchDTO, 
  BatchRequestDTO, 
  ApiCourse, 
  ApiInstructor,
  getAllCourses,
  getAllInstructors,
  createBatch,
  updateBatch
} from "@/app/components/services/api";

const formSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  batchCode: z.string().min(1, "Batch code is required"),
  description: z.string().optional(),
  instituteId: z.number(),
  instructorId: z.number().min(1, "Instructor is required"),
  courseId: z.number().min(1, "Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
  grade: z.string().optional(),
  division: z.string().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED']),
});

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (batch: BatchDTO) => void;
  batch?: BatchDTO | null;
  instituteId: number;
}

export function BatchForm({ isOpen, onClose, onSuccess, batch, instituteId }: BatchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [instructors, setInstructors] = useState<ApiInstructor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: "",
      batchCode: "",
      description: "",
      instituteId: instituteId,
      instructorId: 0,
      courseId: 0,
      startDate: "",
      endDate: "",
      maxStudents: 30,
      semester: "",
      academicYear: new Date().getFullYear().toString(),
      grade: "",
      division: "",
      status: 'PLANNED',
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (batch) {
        // Populate form with existing batch data
        form.reset({
          batchName: batch.batchName,
          batchCode: batch.batchCode,
          description: batch.description || "",
          instituteId: batch.instituteId,
          instructorId: batch.instructorId,
          courseId: batch.courseId,
          startDate: batch.startDate.split('T')[0], // Convert to date input format
          endDate: batch.endDate.split('T')[0],
          maxStudents: batch.maxStudents,
          semester: batch.semester || "",
          academicYear: batch.academicYear || "",
          grade: batch.grade || "",
          division: batch.division || "",
          status: batch.status,
        });
      } else {
        form.reset({
          batchName: "",
          batchCode: "",
          description: "",
          instituteId: instituteId,
          instructorId: 0,
          courseId: 0,
          startDate: "",
          endDate: "",
          maxStudents: 30,
          semester: "",
          academicYear: new Date().getFullYear().toString(),
          grade: "",
          division: "",
          status: 'PLANNED',
        });
      }
    }
  }, [isOpen, batch, instituteId, form]);

  const loadData = async () => {
    try {
      const [coursesData, instructorsData] = await Promise.all([
        getAllCourses(),
        getAllInstructors()
      ]);
      setCourses(coursesData);
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Failed to load form data:', error);
      setError('Failed to load courses and instructors');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const batchData: BatchRequestDTO = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };

      let result: BatchDTO;
      if (batch) {
        result = await updateBatch(batch.batchId, batchData);
      } else {
        result = await createBatch(batchData);
      }

      onSuccess(result);
      onClose();
    } catch (error: any) {
      console.error('Failed to save batch:', error);
      setError(error.message || 'Failed to save batch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {batch ? 'Edit Batch' : 'Create New Batch'}
          </DialogTitle>
          <DialogDescription>
            {batch ? 'Update the batch information below.' : 'Fill in the details to create a new batch.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="batchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science 2024-A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS2024A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the batch"
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.courseId} value={course.courseId}>
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.instructorId} value={instructor.instructorId.toString()}>
                            {instructor.firstName} {instructor.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Students</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fall 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1st Year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLANNED">Planned</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (batch ? 'Update Batch' : 'Create Batch')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}