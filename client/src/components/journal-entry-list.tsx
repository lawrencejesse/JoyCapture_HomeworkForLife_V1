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
import { MoreHorizontalIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

// Character limit for the truncated view
const TRUNCATE_LENGTH = 280;

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
  // Keep track of which entries are expanded
  const [expandedEntries, setExpandedEntries] = useState<Record<number, boolean>>({});

  const formatEntryDate = (dateString: Date) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
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

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const isExpanded = expandedEntries[entry.id] || false;
        const needsTruncation = shouldTruncate(entry.content);
        
        return (
          <Card key={entry.id} className="card-shadow">
            <CardContent className="p-5">
              <div className="flex items-start mb-3">
                <div className="text-sm font-medium text-primary min-w-[120px]">
                  {formatEntryDate(entry.createdAt)}
                </div>
                <div className="flex-1">
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
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-muted-foreground hover:text-primary">
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
