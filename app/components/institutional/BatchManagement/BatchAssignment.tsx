"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  UserPlus, 
  Mail,
  User,
  CheckCircle
} from "lucide-react";
import { 
  InstitutionalUserDTO,
  getUsersByInstitute,
  getBatchStudents,
  assignStudentToBatch
} from "@/app/components/services/api";

interface BatchAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: number | null;
  batchName?: string;
  instituteId: number;
  onSuccess?: () => void;
}

export function BatchAssignment({ 
  isOpen, 
  onClose, 
  batchId, 
  batchName, 
  instituteId,
  onSuccess 
}: BatchAssignmentProps) {
  const [allStudents, setAllStudents] = useState<InstitutionalUserDTO[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<InstitutionalUserDTO[]>([]);
  const [availableStudents, setAvailableStudents] = useState<InstitutionalUserDTO[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<InstitutionalUserDTO[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && batchId && instituteId) {
      loadData();
    }
  }, [isOpen, batchId, instituteId]);

  useEffect(() => {
    // Filter available students based on search term
    const filtered = availableStudents.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [availableStudents, searchTerm]);

  const loadData = async () => {
    if (!batchId || !instituteId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [allStudentsData, enrolledStudentsData] = await Promise.all([
        getUsersByInstitute(instituteId),
        getBatchStudents(batchId)
      ]);

      // Filter to get only students (users with USER role)
      const students = allStudentsData.filter(user => 
        user.roles.some(role => role.name === 'USER')
      );

      setAllStudents(students);
      setEnrolledStudents(enrolledStudentsData);

      // Get students who are not already enrolled in this batch
      const enrolledIds = new Set(enrolledStudentsData.map(s => parseInt(s.id)));
      const available = students.filter(student => !enrolledIds.has(parseInt(student.id)));
      setAvailableStudents(available);

    } catch (error: any) {
      console.error('Failed to load data:', error);
      setError(error.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = (studentId: number, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredStudents.map(s => parseInt(s.id)));
      setSelectedStudents(allIds);
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleAssignStudents = async () => {
    if (!batchId || selectedStudents.size === 0) return;

    setIsAssigning(true);
    setError(null);

    try {
      // Assign students one by one
      const assignments = Array.from(selectedStudents).map(studentId =>
        assignStudentToBatch(batchId, studentId)
      );

      await Promise.all(assignments);

      // Clear selection and reload data
      setSelectedStudents(new Set());
      await loadData();
      onSuccess?.();

    } catch (error: any) {
      console.error('Failed to assign students:', error);
      setError(error.message || 'Failed to assign students');
    } finally {
      setIsAssigning(false);
    }
  };

  const isAllSelected = filteredStudents.length > 0 && 
    filteredStudents.every(student => selectedStudents.has(parseInt(student.id)));

  const isSomeSelected = filteredStudents.some(student => selectedStudents.has(parseInt(student.id)));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Assign Students to {batchName || 'Batch'}
          </DialogTitle>
          <DialogDescription>
            Select students to assign to this batch. Only students not already enrolled are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search available students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredStudents.length} available
              </Badge>
              <Badge variant="outline">
                {enrolledStudents.length} enrolled
              </Badge>
            </div>
          </div>

          {selectedStudents.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <Button
                onClick={handleAssignStudents}
                disabled={isAssigning}
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isAssigning ? 'Assigning...' : 'Assign Selected'}
              </Button>
            </div>
          )}

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
                    {searchTerm ? 'No students found matching your search' : 'No available students to assign'}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(ref) => {
                          if (ref) {
                            ref.indeterminate = isSomeSelected && !isAllSelected;
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Academic Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.has(parseInt(student.id))}
                          onCheckedChange={(checked) => 
                            handleStudentSelect(parseInt(student.id), checked as boolean)
                          }
                        />
                      </TableCell>
                      
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
                            <div className="text-sm text-muted-foreground">
                              {student.phoneNumber}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedStudents.size > 0 && (
              <span>{selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected for assignment</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignStudents}
              disabled={selectedStudents.size === 0 || isAssigning}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isAssigning ? 'Assigning...' : `Assign ${selectedStudents.size} Student${selectedStudents.size !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}