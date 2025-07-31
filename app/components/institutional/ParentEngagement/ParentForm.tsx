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
import { X } from "lucide-react";
import { 
  ParentProfileDTO, 
  ParentProfileRequestDTO,
  InstitutionalUserDTO,
  createParentProfile,
  updateParentProfile,
  getUsersByInstitute
} from "@/app/components/services/api";

const formSchema = z.object({
  parentName: z.string().min(1, "Parent name is required"),
  parentEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  relationship: z.string().min(1, "Relationship is required"),
  childrenIds: z.array(z.number()).min(1, "At least one child must be selected"),
  instituteId: z.number(),
  canViewReports: z.boolean().optional(),
  canViewAttendance: z.boolean().optional(),
  canViewGrades: z.boolean().optional(),
  canViewAnnouncements: z.boolean().optional(),
  canReceiveNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
});

interface ParentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (parent: ParentProfileDTO) => void;
  parent?: ParentProfileDTO | null;
  instituteId: number;
}

const relationshipOptions = [
  'Father',
  'Mother',
  'Guardian',
  'Grandfather',
  'Grandmother',
  'Uncle',
  'Aunt',
  'Other'
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export function ParentForm({ isOpen, onClose, onSuccess, parent, instituteId }: ParentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<InstitutionalUserDTO[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<InstitutionalUserDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      phoneNumber: "",
      relationship: "",
      childrenIds: [],
      instituteId: instituteId,
      canViewReports: true,
      canViewAttendance: true,
      canViewGrades: true,
      canViewAnnouncements: true,
      canReceiveNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      preferredLanguage: "en",
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadStudents();
      if (parent) {
        // Populate form with existing parent data
        form.reset({
          parentName: parent.parentName,
          parentEmail: parent.parentEmail,
          phoneNumber: parent.phoneNumber,
          relationship: parent.relationship,
          childrenIds: parent.children.map(child => parseInt(child.id)),
          instituteId: parent.instituteId,
          canViewReports: parent.canViewReports,
          canViewAttendance: parent.canViewAttendance,
          canViewGrades: parent.canViewGrades,
          canViewAnnouncements: parent.canViewAnnouncements,
          canReceiveNotifications: parent.canReceiveNotifications,
          emailNotifications: parent.emailNotifications,
          smsNotifications: parent.smsNotifications,
          preferredLanguage: parent.preferredLanguage,
        });
        setSelectedChildren(parent.children.map(child => ({
          ...child,
          roles: child.roles || []
        } as InstitutionalUserDTO)));
      } else {
        form.reset({
          parentName: "",
          parentEmail: "",
          phoneNumber: "",
          relationship: "",
          childrenIds: [],
          instituteId: instituteId,
          canViewReports: true,
          canViewAttendance: true,
          canViewGrades: true,
          canViewAnnouncements: true,
          canReceiveNotifications: true,
          emailNotifications: true,
          smsNotifications: false,
          preferredLanguage: "en",
        });
        setSelectedChildren([]);
      }
    }
  }, [isOpen, parent, instituteId, form]);

  const loadStudents = async () => {
    try {
      const usersData = await getUsersByInstitute(instituteId);
      // Filter to get only students (users with USER role)
      const studentsData = usersData.filter(user => 
        user.roles.some(role => role.name === 'USER')
      );
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load students:', error);
      setError('Failed to load students');
    }
  };

  const handleChildSelection = (student: InstitutionalUserDTO, checked: boolean) => {
    const currentIds = form.getValues('childrenIds') || [];
    
    if (checked) {
      form.setValue('childrenIds', [...currentIds, parseInt(student.id)]);
      setSelectedChildren(prev => [...prev, student]);
    } else {
      form.setValue('childrenIds', currentIds.filter(id => id !== parseInt(student.id)));
      setSelectedChildren(prev => prev.filter(child => child.id !== student.id));
    }
  };

  const removeChild = (studentId: string) => {
    const currentIds = form.getValues('childrenIds') || [];
    form.setValue('childrenIds', currentIds.filter(id => id !== parseInt(studentId)));
    setSelectedChildren(prev => prev.filter(child => child.id !== studentId));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const parentData: ParentProfileRequestDTO = {
        ...values,
      };

      let result: ParentProfileDTO;
      if (parent) {
        result = await updateParentProfile(parent.parentId, parentData);
      } else {
        result = await createParentProfile(parentData);
      }

      onSuccess(result);
      onClose();
    } catch (error: any) {
      console.error('Failed to save parent profile:', error);
      setError(error.message || 'Failed to save parent profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parent ? 'Edit Parent Profile' : 'Create Parent Profile'}
          </DialogTitle>
          <DialogDescription>
            {parent ? 'Update the parent profile information below.' : 'Fill in the details to create a new parent profile.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>
                              {relationship}
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
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="parent@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Children Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Children</h3>
              
              {selectedChildren.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Children:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChildren.map((child) => (
                      <Badge key={child.id} variant="secondary" className="flex items-center gap-1">
                        {child.firstName} {child.lastName}
                        <button
                          type="button"
                          onClick={() => removeChild(child.id)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium mb-3">Available Students:</h4>
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students available</p>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={(form.getValues('childrenIds') || []).includes(parseInt(student.id))}
                          onCheckedChange={(checked) => handleChildSelection(student, checked as boolean)}
                        />
                        <label htmlFor={`student-${student.id}`} className="text-sm flex-1">
                          {student.firstName} {student.lastName}
                          {student.rollNumber && (
                            <span className="text-muted-foreground ml-2">({student.rollNumber})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="canViewReports"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can view progress reports</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canViewAttendance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can view attendance</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canViewGrades"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can view grades</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canViewAnnouncements"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can view announcements</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="canReceiveNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div></div>

                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Email notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>SMS notifications</FormLabel>
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
                {isLoading ? 'Saving...' : (parent ? 'Update Profile' : 'Create Profile')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}