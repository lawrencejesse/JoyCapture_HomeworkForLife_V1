import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { JournalEntryList } from "@/components/journal-entry-list";
import { SearchBar, SearchFilters } from "@/components/search-bar";
import { Entry } from "@shared/schema";
import { format } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [entryOffset, setEntryOffset] = useState(0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const ENTRIES_PER_PAGE = 5;

  const { 
    data: entries = [], 
    isLoading,
    isFetching
  } = useQuery<Entry[]>({
    queryKey: ["/api/entries", entryOffset, searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: ENTRIES_PER_PAGE.toString(),
        offset: entryOffset.toString(),
        ...(searchFilters.query && { query: searchFilters.query }),
        ...(searchFilters.startDate && { startDate: searchFilters.startDate.toISOString() }),
        ...(searchFilters.endDate && { endDate: searchFilters.endDate.toISOString() }),
        ...(searchFilters.category && { category: searchFilters.category }),
        ...(searchFilters.mood && { mood: searchFilters.mood }),
        ...(searchFilters.tags && searchFilters.tags.length > 0 && { tags: searchFilters.tags.join(",") }),
      });
      const response = await apiRequest("GET", `/api/entries?${params.toString()}`);
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newEntryData: { content: string; custom_date?: Date }) => {
      // Convert date to ISO string if it exists
      const dataToSend = {
        content: newEntryData.content,
        // category is removed from the form, no longer sent
        custom_date: newEntryData.custom_date ? newEntryData.custom_date.toISOString() : undefined,
      };
      return apiRequest("POST", "/api/entries", dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
    },
  });

  const loadMoreEntries = () => {
    setEntryOffset(prev => prev + ENTRIES_PER_PAGE);
  };

  const today = new Date();
  const formattedDate = format(today, "MMMM d, yyyy");

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setEntryOffset(0);
  };

  const handleClearSearch = () => {
    setSearchFilters({});
    setEntryOffset(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-grow flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Today's Entry Section */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-foreground">Today's Moment</h2>
                <div className="text-sm text-muted-foreground">{formattedDate}</div>
              </div>

              <JournalEntryForm 
                onSubmit={(data) => {
                  createMutation.mutate({
                    content: data.content,
                    custom_date: data.custom_date,
                  });
                }}
                isSubmitting={createMutation.isPending}
              />
            </section>

            {/* Search Section */}
            <section className="mb-8">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            </section>

            {/* Previous Entries Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-foreground">Previous Moments</h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {Object.keys(searchFilters).length > 0 ? (
                    <p>No entries found matching your search. Try adjusting your filters or start capturing your moments of joy.</p>
                  ) : (
                    <p>No entries yet. Start capturing your moments of joy!</p>
                  )}
                </div>
              ) : (
                <>
                  <JournalEntryList entries={entries} />
                  {entries.length === ENTRIES_PER_PAGE && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={loadMoreEntries}
                        disabled={isFetching}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isFetching ? (
                          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                        ) : null}
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
