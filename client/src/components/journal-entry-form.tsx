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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Entry } from "@shared/schema";
import React from "react";

const MAX_CONTENT_LENGTH = 5000;

const formSchema = z.object({
  content: z.string()
    .min(1, "Please enter your memory")
    .max(MAX_CONTENT_LENGTH, `Entry cannot exceed ${MAX_CONTENT_LENGTH} characters`),
  custom_date: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JournalEntryFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
  initialData?: Partial<Entry>;
  submitButtonText?: string;
}

export function JournalEntryForm({ 
  onSubmit, 
  isSubmitting = false, 
  initialData,
  submitButtonText = "Save This Moment"
}: JournalEntryFormProps) {
  const [contentLength, setContentLength] = useState(initialData?.content?.length || 0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialData?.content || "",
      custom_date: initialData?.custom_date ? new Date(initialData.custom_date) : new Date(),
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    if (!initialData) {
      form.reset();
      setContentLength(0);
    }
  };

  React.useEffect(() => {
    if (initialData?.content) {
      setContentLength(initialData.content.length);
    }
  }, [initialData?.content]);

  return (
    <Card className="card-shadow">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="max-h-[40vh] overflow-y-auto pl-2 pr-2">
                  <FormLabel>Describe your moment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What made you smile today? What do you want to remember?"
                      rows={6}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setContentLength(e.target.value.length);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Be specific - what details made this moment special?</span>
                    <span className={contentLength > MAX_CONTENT_LENGTH ? "text-destructive" : ""}>
                      {contentLength}/{MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="custom_date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="mb-2 block">When did this happen?</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full sm:w-auto flex items-center"
                disabled={isSubmitting}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : submitButtonText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
