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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import { 
  AnnouncementDTO, 
  AnnouncementRequestDTO,
  BatchDTO,
  ApiCourse,
  createAnnouncement,
  updateAnnouncement,
  getBatchesByInstitute,
  getAllCourses
} from "@/app/components/services/api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(['GENERAL', 'ACADEMIC', 'ADMINISTRATIVE', 'URGENT', 'EVENT', 'HOLIDAY', 'EXAM', 'ASSIGNMENT']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  instituteId: z.number(),
  targetRoles: z.array(z.string()).optional(),
  targetBatches: z.array(z.number()).optional(),
  targetCourses: z.array(z.number()).optional(),
  publishDate: z.string().min(1, "Publish date is required"),
  expiryDate: z.string().optional(),
  isPublished: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  sendNotification: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
});

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (announcement: AnnouncementDTO) => void;
  announcement?: AnnouncementDTO | null;
  instituteId: number;
}

const availableRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'INSTITUTION'];

export function AnnouncementForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  announcement, 
  instituteId 
}: AnnouncementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState<BatchDTO[]>([]);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: 'GENERAL',
      priority: 'MEDIUM',
      instituteId: instituteId,
      targetRoles: [],
      targetBatches: [],
      targetCourses: [],
      publishDate: new Date().toISOString().slice(0, 16), // Current datetime
      expiryDate: "",
      isPublished: true,
      isPinned: false,
      sendNotification: true,
      sendEmail: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (announcement) {
        // Populate form with existing announcement data
        form.reset({
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          priority: announcement.priority,
          instituteId: announcement.instituteId,
          targetRoles: announcement.targetRoles,
          targetBatches: announcement.targetBatches,
          targetCourses: announcement.targetCourses,
          publishDate: announcement.publishDate.slice(0, 16), // Convert to datetime-local format
          expiryDate: announcement.expiryDate?.slice(0, 16) || "",
          isPublished: announcement.isPublished,
          isPinned: announcement.isPinned,
          sendNotification: announcement.sendNotification,
          sendEmail: announcement.sendEmail,
        });
      } else {
        form.reset({
          title: "",
          content: "",
          type: 'GENERAL',
          priority: 'MEDIUM',
          instituteId: instituteId,
          targetRoles: [],
          targetBatches: [],
          targetCourses: [],
          publishDate: new Date().toISOString().slice(0, 16),
          expiryDate: "",
          isPublished: true,
          isPinned: false,
          sendNotification: true,
          sendEmail: false,
        });
      }
    }
  }, [isOpen, announcement, instituteId, form]);

  const loadData = async () => {
    try {
      const [batchesData, coursesData] = await Promise.all([
        getBatchesByInstitute(instituteId),
        getAllCourses()
      ]);
      setBatches(batchesData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load form data:', error);
      setError('Failed to load batches and courses');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const announcementData: AnnouncementRequestDTO = {
        ...values,
        publishDate: new Date(values.publishDate).toISOString(),
        expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : undefined,
      };

      let result: AnnouncementDTO;
      if (announcement) {
        result = await updateAnnouncement(announcement.announcementId, announcementData);
      } else {
        result = await createAnnouncement(announcementData);
      }

      onSuccess(result);
      onClose();
    } catch (error: any) {
      console.error('Failed to save announcement:', error);
      setError(error.message || 'Failed to save announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (role: string, checked: boolean) => {
    const currentRoles = form.getValues('targetRoles') || [];
    if (checked) {
      form.setValue('targetRoles', [...currentRoles, role]);
    } else {
      form.setValue('targetRoles', currentRoles.filter(r => r !== role));
    }
  };

  const handleBatchToggle = (batchId: number, checked: boolean) => {
    const currentBatches = form.getValues('targetBatches') || [];
    if (checked) {
      form.setValue('targetBatches', [...currentBatches, batchId]);
    } else {
      form.setValue('targetBatches', currentBatches.filter(id => id !== batchId));
    }
  };

  const handleCourseToggle = (courseId: number, checked: boolean) => {
    const currentCourses = form.getValues('targetCourses') || [];
    if (checked) {
      form.setValue('targetCourses', [...currentCourses, courseId]);
    } else {
      form.setValue('targetCourses', currentCourses.filter(id => id !== courseId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Edit Announcement' : 'Create New Announcement'}
          </DialogTitle>
          <DialogDescription>
            {announcement ? 'Update the announcement details below.' : 'Fill in the details to create a new announcement.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="ACADEMIC">Academic</SelectItem>
                        <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="HOLIDAY">Holiday</SelectItem>
                        <SelectItem value="EXAM">Exam</SelectItem>
                        <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Announcement content"
                      className="resize-none"
                      rows={6}
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
                name="publishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date & Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Target Audience</h3>
              
              <div>
                <FormLabel className="text-base">Roles</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={(form.getValues('targetRoles') || []).includes(role)}
                        onCheckedChange={(checked) => handleRoleToggle(role, checked as boolean)}
                      />
                      <label htmlFor={`role-${role}`} className="text-sm font-medium">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <FormLabel className="text-base">Batches</FormLabel>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 mt-2">
                  {batches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No batches available</p>
                  ) : (
                    <div className="space-y-2">
                      {batches.map((batch) => (
                        <div key={batch.batchId} className="flex items-center space-x-2">
                          <Checkbox
                            id={`batch-${batch.batchId}`}
                            checked={(form.getValues('targetBatches') || []).includes(batch.batchId)}
                            onCheckedChange={(checked) => handleBatchToggle(batch.batchId, checked as boolean)}
                          />
                          <label htmlFor={`batch-${batch.batchId}`} className="text-sm">
                            {batch.batchName} ({batch.batchCode})
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publish immediately</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPinned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Pin announcement</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send push notification</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send email notification</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (announcement ? 'Update Announcement' : 'Create Announcement')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}