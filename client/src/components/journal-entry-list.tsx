import { format } from "date-fns";
import { Entry } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

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
  const formatEntryDate = (dateString: Date) => {
    const date = new Date(dateString);
    return format(date, "MMM d");
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="card-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-foreground line-clamp-1">
                {entry.title || "Untitled Entry"}
              </h3>
              <div className="text-sm text-muted-foreground">
                {formatEntryDate(entry.createdAt)}
              </div>
            </div>
            <p className="text-foreground/90 mb-4 whitespace-pre-line">
              {entry.content}
            </p>
            <div className="flex justify-between items-center">
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
      ))}
    </div>
  );
}
