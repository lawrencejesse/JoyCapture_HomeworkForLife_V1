import { format } from "date-fns";
import { Entry } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, ChevronDownIcon, ChevronUpIcon, Edit2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EditEntryModal } from "./edit-entry-modal";
import { saveAs } from 'file-saver';

// Character limit for the truncated view
const TRUNCATE_LENGTH = 100;

interface JournalEntryListProps {
  entries: Entry[];
}

// Define entry category badges with their corresponding colors
const categoryBadges: Record<string, { bg: string; text: string }> = {
  "Discovery": { bg: "bg-secondary/20", text: "text-secondary" },
  "Connection": { bg: "bg-accent/20", text: "text-accent" },
  "Friendship": { bg: "bg-primary/20", text: "text-primary" },
  "Nature": { bg: "bg-emerald-500/20", text: "text-emerald-500" },
  "Achievement": { bg: "bg-blue-500/20", text: "text-blue-500" },
  "Gratitude": { bg: "bg-purple-500/20", text: "text-purple-500" },
};

export function JournalEntryList({ entries }: JournalEntryListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry deleted",
        description: "Your memory has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Keep track of which entries are expanded
  const [expandedEntries, setExpandedEntries] = useState<Record<number, boolean>>({});
  
  // State for managing the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Function to open the edit modal
  const handleEditClick = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingEntry(null); // Clear the entry being edited
  };

  const formatEntryDate = (dateString: Date, custom_date: Date | null) => {
    const date = custom_date ? new Date(custom_date) : new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  const toggleExpand = (entryId: number) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  const shouldTruncate = (content: string) => content.length > TRUNCATE_LENGTH;

  const getTruncatedContent = (content: string, expanded: boolean) => {
    if (!shouldTruncate(content) || expanded) {
      return content;
    }
    return content.substring(0, TRUNCATE_LENGTH) + '...';
  };

  // Function to handle CSV export
  const handleExportCsv = () => {
    if (!entries || entries.length === 0) {
      toast({
        title: "No entries to export",
        description: "There are no memories to export.",
        variant: "default",
      });
      return;
    }

    // Define CSV headers
    const headers = ["Date", "Content", "Category"];
    
    // Function to escape CSV special characters
    const escapeCsv = (value: string | null | undefined): string => {
      if (value === null || value === undefined) return '';
      let str = String(value);
      // Escape double quotes by doubling them
      str = str.replace(/"/g, '""');
      // If the value contains a comma, newline, or double quote, enclose it in double quotes
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        str = `"${str}"`;
      }
      return str;
    };

    // Prepare CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...entries.map(entry => [
        escapeCsv(formatEntryDate(entry.created_at, entry.custom_date)),
        escapeCsv(entry.content),
        escapeCsv(entry.category)
      ].join(',')) // Data rows
    ];

    // Combine rows into a single CSV string
    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Use file-saver to trigger the download
    saveAs(blob, 'memories.csv');

    toast({
      title: "Export Successful",
      description: "Your memories have been exported to memories.csv.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleExportCsv}>
          Export to CSV
        </Button>
      </div>

      {entries.map((entry) => {
        const isExpanded = expandedEntries[entry.id] || false;
        const needsTruncation = shouldTruncate(entry.content);
        
        return (
          <React.Fragment key={entry.id}>
            <Card className="card-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row items-start mb-3">
                  <div className="text-sm font-medium text-primary mb-2 md:mb-0 md:mr-3 md:min-w-[120px]">
                    {formatEntryDate(entry.created_at, entry.custom_date)}
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-foreground/90 whitespace-pre-line">
                      {getTruncatedContent(entry.content, isExpanded)}
                    </p>
                    
                    {needsTruncation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-xs flex items-center text-muted-foreground hover:text-primary"
                        onClick={() => toggleExpand(entry.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUpIcon className="h-4 w-4 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="h-4 w-4 mr-1" />
                            Show more
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="self-end md:self-start md:ml-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleEditClick(entry)}
                          className="text-foreground/80 hover:text-primary cursor-pointer"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMutation.mutate(entry.id)} 
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  {entry.category && (
                    <Badge 
                      className={`px-3 py-1 ${
                        categoryBadges[entry.category]?.bg || "bg-primary/20"
                      } ${
                        categoryBadges[entry.category]?.text || "text-primary"
                      }`}
                      variant="outline"
                    >
                      {entry.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </React.Fragment>
        );
      })}

      {/* Render the modal outside the loop */}
      <EditEntryModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModal} 
        entry={editingEntry} 
      />
    </div>
  );
}
