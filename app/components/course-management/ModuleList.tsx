
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete } from "@/components/ui/Delete";
import { LessonList } from "./LessonList";
import { ModuleForm } from "./ModuleForm";
import { createModule as apiCreateModule, updateModule as apiUpdateModule, deleteModule as apiDeleteModule } from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'assignment';
}

interface Module {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface ModuleListProps {
    modules: Module[];
    courseId: string;
    onModuleCreated: () => void;
}

export const ModuleList = ({ modules, courseId, onModuleCreated }: ModuleListProps) => {
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const { toast } = useToast();

    const handleSaveModule = async (data: { title: string; description?: string }) => {
        try {
            if (editingModule) {
                await apiUpdateModule(editingModule.id, { ...data, moduleOrder: editingModule.moduleOrder });
                toast({
                    title: "Success",
                    description: "Module updated successfully!",
                });
            } else {
                await apiCreateModule(courseId, { ...data, moduleOrder: modules.length + 1 });
                toast({
                    title: "Success",
                    description: "Module created successfully!",
                });
            }
            setIsAddingModule(false);
            setEditingModule(null);
            onModuleCreated();
        } catch (error) {
            console.error("Failed to save module", error);
            toast({
                title: "Error",
                description: "Failed to save module.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
            try {
                await apiDeleteModule(moduleId);
                toast({
                    title: "Success",
                    description: "Module deleted successfully!",
                });
                onModuleCreated(); // Re-fetch course details
            } catch (error) {
                console.error("Failed to delete module", error);
                toast({
                    title: "Error",
                    description: "Failed to delete module.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleEditModule = (module: Module) => {
        setEditingModule(module);
        setIsAddingModule(true);
    };

    const handleCancelEdit = () => {
        setIsAddingModule(false);
        setEditingModule(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Modules</h3>
                <Button onClick={() => setIsAddingModule(true)}>Add Module</Button>
            </div>

            {(isAddingModule || editingModule) && (
                <ModuleForm
                    onSave={handleSaveModule}
                    onCancel={handleCancelEdit}
                    initialData={editingModule || undefined}
                />
            )}

            {modules.length > 0 ? (
                modules.map(module => (
                    <Card key={module.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{module.title}</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditModule(module)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteModule(module.id)}>
                                    <Delete width={16} height={16} stroke="white" className="mr-1" /> Delete
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{module.description}</p>
                            <LessonList
                                moduleId={module.id}
                                lessons={module.lessons || []}
                                onLessonCreated={onModuleCreated} // Re-fetch course details
                            />
                        </CardContent>
                    </Card>
                ))
            ) : (
                !(isAddingModule || editingModule) && <p>No modules found for this course.</p>
            )}
        </div>
    );
};
