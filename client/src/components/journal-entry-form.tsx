import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

const MAX_CONTENT_LENGTH = 280;

const formSchema = z.object({
  title: z.string().optional(),
  content: z.string()
    .min(1, "Please enter your memory")
    .max(MAX_CONTENT_LENGTH, `Entry cannot exceed ${MAX_CONTENT_LENGTH} characters`),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JournalEntryFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

export function JournalEntryForm({ onSubmit, isSubmitting }: JournalEntryFormProps) {
  const [contentLength, setContentLength] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
    setContentLength(0);
  };

  return (
    <Card className="card-shadow">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Give your moment a title (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 'Morning coffee discovery' or 'Unexpected kindness'"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your moment (1-5 sentences)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What made you smile today? What do you want to remember?"
                      rows={4}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setContentLength(e.target.value.length);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Be specific but concise - what details made this moment special?</span>
                    <span className={contentLength > MAX_CONTENT_LENGTH ? "text-destructive" : ""}>
                      {contentLength}/{MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full sm:w-auto flex items-center"
                disabled={isSubmitting}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save This Moment"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
