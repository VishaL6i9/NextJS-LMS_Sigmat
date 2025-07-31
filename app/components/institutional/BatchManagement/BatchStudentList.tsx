"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  UserMinus, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  User
} from "lucide-react";
import { 
  InstitutionalUserDTO,
  getBatchStudents,
  removeStudentFromBatch
} from "@/app/components/services/api";

interface BatchStudentListProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: number | null;
  batchName?: string;
}

export function BatchStudentList({ isOpen, onClose, batchId, batchName }: BatchStudentListProps) {
  const [students, setStudents] = useState<InstitutionalUserDTO[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<InstitutionalUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && batchId) {
      loadStudents();
    }
  }, [isOpen, batchId]);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const loadStudents = async () => {
    if (!batchId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const studentsData = await getBatchStudents(batchId);
      setStudents(studentsData);
    } catch (error: any) {
      console.error('Failed to load batch students:', error);
      setError(error.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this batch?`)) {
      return;
    }

    try {
      await removeStudentFromBatch(studentId);
      // Reload students list
      await loadStudents();
    } catch (error: any) {
      console.error('Failed to remove student:', error);
      setError(error.message || 'Failed to remove student');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Students in {batchName || 'Batch'}
          </DialogTitle>
          <DialogDescription>
            Manage students enrolled in this batch
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, email, roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="flex-1 overflow-auto border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading students...</p>
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'No students found matching your search' : 'No students enrolled in this batch'}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Academic Info</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.rollNumber && (
                              <span className="mr-3">Roll: {student.rollNumber}</span>
                            )}
                            {student.admissionId && (
                              <span>ID: {student.admissionId}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{student.email}</span>
                          </div>
                          {student.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{student.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {student.semester && (
                            <div>{student.semester}</div>
                          )}
                          {student.grade && (
                            <div className="text-muted-foreground">Grade: {student.grade}</div>
                          )}
                          {student.division && (
                            <div className="text-muted-foreground">Div: {student.division}</div>
                          )}
                          {student.courseOfStudy && (
                            <div className="text-muted-foreground">{student.courseOfStudy}</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(student.enrollmentDate)}</span>
                          </div>
                          {student.lastLoginDate && (
                            <div className="text-muted-foreground">
                              Last login: {formatDate(student.lastLoginDate)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(parseInt(student.id), `${student.firstName} ${student.lastName}`)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}