import { useState } from "react";
import { SearchIcon, CalendarIcon, TagIcon, FilterIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface SearchFilters {
  query?: string;
  startDate?: Date;
  endDate?: Date;
  // tags?: string[]; // REMOVED
  // category?: string; // REMOVED
  // mood?: string; // REMOVED
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

// REMOVED categories constant
// const categories = [ ... ];

// REMOVED moods constant
// const moods = [ ... ];

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && 
    !(Array.isArray(value) && value.length === 0)
  );

  return (
    <Card className="card-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your memories..."
                className="pl-9"
                value={filters.query || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(isExpanded && "bg-accent text-accent-foreground")}
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleClear}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Date Range */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Date Range</span>
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        {filters.startDate ? (
                          format(filters.startDate, "PPP")
                        ) : (
                          <span>From</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.startDate}
                        onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        {filters.endDate ? (
                          format(filters.endDate, "PPP")
                        ) : (
                          <span>To</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.endDate}
                        onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Category REMOVED */}
              {/* <div className="space-y-2"> ... </div> */}

              {/* Mood REMOVED */}
              {/* <div className="space-y-2"> ... </div> */}

              {/* Tags REMOVED */}
              {/* <div className="space-y-2"> ... </div> */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 