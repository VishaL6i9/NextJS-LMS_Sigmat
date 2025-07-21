
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete } from "@/components/ui/Delete";
import { Badge } from "@/components/ui/badge";
import { LessonForm } from "./LessonForm";
import { createLesson as apiCreateLesson, updateLesson as apiUpdateLesson, deleteLesson as apiDeleteLesson } from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'assignment';
    lessonOrder: number;
}

interface LessonListProps {
    lessons: Lesson[];
    moduleId: string;
    onLessonCreated: () => void;
}

export const LessonList = ({ lessons, moduleId, onLessonCreated }: LessonListProps) => {
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const { toast } = useToast();

    const handleSaveLesson = async (data: { title: string; type: 'video' | 'article' | 'quiz' | 'assignment' }) => {
        try {
            if (editingLesson) {
                await apiUpdateLesson(editingLesson.id, { ...data, lessonOrder: editingLesson.lessonOrder });
                toast({
                    title: "Success",
                    description: "Lesson updated successfully!",
                });
            } else {
                await apiCreateLesson(moduleId, { ...data, lessonOrder: lessons.length + 1 });
                toast({
                    title: "Success",
                    description: "Lesson created successfully!",
                });
            }
            setIsAddingLesson(false);
            setEditingLesson(null);
            onLessonCreated();
        } catch (error) {
            console.error("Failed to save lesson", error);
            toast({
                title: "Error",
                description: "Failed to save lesson.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
            try {
                await apiDeleteLesson(lessonId);
                toast({
                    title: "Success",
                    description: "Lesson deleted successfully!",
                });
                onLessonCreated(); // Re-fetch course details
            } catch (error) {
                console.error("Failed to delete lesson", error);
                toast({
                    title: "Error",
                    description: "Failed to delete lesson.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setIsAddingLesson(true);
    };

    const handleCancelEdit = () => {
        setIsAddingLesson(false);
        setEditingLesson(null);
    };

    return (
        <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Lessons</h4>
                <Button size="sm" onClick={() => setIsAddingLesson(true)}>Add Lesson</Button>
            </div>

            {(isAddingLesson || editingLesson) && (
                <LessonForm
                    onSave={handleSaveLesson}
                    onCancel={handleCancelEdit}
                    initialData={editingLesson || undefined}
                />
            )}

            {lessons.length > 0 ? (
                lessons.map(lesson => (
                    <Card key={lesson.id} className="p-2">
                        <div className="flex items-center justify-between">
                            <span>{lesson.title}</span>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{lesson.type}</Badge>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleEditLesson(lesson)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V12h2.828l7.586-7.586a2 2 0 000-2.828zM4 14a2 2 0 002 2h8a2 2 0 002-2V9.828a1 1 0 10-2 0V14H6v-2.172a1 1 0 00-.293-.707L3.414 8.586a2 2 0 00-2.828 2.828L3 13.586V14z" />
                                    </svg>
                                </Button>
                                <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => handleDeleteLesson(lesson.id)}>
                                    <Delete width={16} height={16} stroke="white" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                !(isAddingLesson || editingLesson) && <p className="text-sm text-muted-foreground">No lessons in this module.</p>
            )}
        </div>
    );
};
