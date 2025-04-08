import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter, // Not needed if form has own button
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button"; // Not needed if form has own button
import { JournalEntryForm } from "./journal-entry-form";
import { Entry } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import React from "react"; // Import React

// Reuse the form schema definition, potentially importing it if shared
// NOTE: It's better to import this from where it's defined (e.g., the form component or a shared location)
// But for simplicity here, we redefine it. Ensure MAX_CONTENT_LENGTH matches.
const formSchema = z.object({
  content: z.string()
    .min(1, "Please enter your memory")
    .max(5000, `Entry cannot exceed 5000 characters`), // Match the form
  category: z.string().optional(),
  custom_date: z.date().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry | null;
}

export function EditEntryModal({ isOpen, onClose, entry }: EditEntryModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (updatedData: FormValues) => {
      if (!entry) throw new Error("No entry selected for editing");

      // Convert date back to ISO string if necessary for API
      const dataToSend = {
          ...updatedData,
          custom_date: updatedData.custom_date ? updatedData.custom_date.toISOString() : undefined,
      };

      return apiRequest("PUT", `/api/entries/${entry.id}`, dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] }); // Invalidate list query
      // queryClient.invalidateQueries({ queryKey: [`/api/entries/${entry?.id}`] }); // Optional: Invalidate specific entry query if needed
      toast({
        title: "Entry Updated",
        description: "Your memory has been successfully updated.",
      });
      onClose(); // Close modal on success
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update entry: ${error instanceof Error ? error.message : "Please try again."}`,
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    updateMutation.mutate(data);
  };

  // Ensure the dialog doesn't render contents if no entry is selected or it's closing
  if (!entry) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Moment</DialogTitle>
          <DialogDescription>
            Make changes to your recorded memory. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Pass initialData and custom submit text */}
        {/* Adding a key ensures the form resets/reinitializes when the entry changes */}
        <JournalEntryForm
          key={entry.id}
          onSubmit={handleFormSubmit}
          isSubmitting={updateMutation.isPending}
          initialData={entry}
          submitButtonText="Save Changes"
        />

        {/* DialogFooter is not strictly needed as JournalEntryForm has its own submit button */}

      </DialogContent>
    </Dialog>
  );
}
