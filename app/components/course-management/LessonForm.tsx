
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const lessonSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["video", "article", "quiz", "assignment"]),
    videoUrl: z.string().optional(),
    content: z.string().optional(),
    dueDate: z.string().optional(),
    maxPoints: z.number().optional(),
});

interface LessonFormProps {
    onSave: (data: z.infer<typeof lessonSchema>) => void;
    onCancel: () => void;
    initialData?: z.infer<typeof lessonSchema>;
}

export const LessonForm = ({ onSave, onCancel, initialData }: LessonFormProps) => {
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: initialData || {
            title: "",
            type: "video",
            videoUrl: "",
            content: "",
            dueDate: "",
            maxPoints: 0,
        },
    });

    const lessonType = form.watch("type");

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>{initialData ? "Edit Lesson" : "Add Lesson"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson title" {...field} />
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
                                    <FormLabel>Lesson Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a lesson type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="article">Article</SelectItem>
                                            <SelectItem value="quiz">Quiz</SelectItem>
                                            <SelectItem value="assignment">Assignment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {lessonType === "video" && (
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/video.mp4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {lessonType === "article" && (
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Article content" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {lessonType === "assignment" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxPoints"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Points</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
