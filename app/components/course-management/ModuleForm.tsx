
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const moduleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

interface ModuleFormProps {
    onSave: (data: z.infer<typeof moduleSchema>) => void;
    onCancel: () => void;
    initialData?: z.infer<typeof moduleSchema>;
}

export const ModuleForm = ({ onSave, onCancel, initialData }: ModuleFormProps) => {
    const form = useForm<z.infer<typeof moduleSchema>>({
        resolver: zodResolver(moduleSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? "Edit Module" : "Add Module"}</CardTitle>
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
                                        <Input placeholder="Module title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Module description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
