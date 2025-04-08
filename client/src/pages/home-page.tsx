import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { JournalEntryForm } from "@/components/journal-entry-form";
import { JournalEntryList } from "@/components/journal-entry-list";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Entry } from "@shared/schema";
import { format } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [entryOffset, setEntryOffset] = useState(0);
  const ENTRIES_PER_PAGE = 5;

  const { 
    data: entries = [], 
    isLoading,
    isFetching
  } = useQuery<Entry[]>({
    queryKey: ["/api/entries", entryOffset],
    queryFn: async () => {
      const response = await fetch(`/api/entries?limit=${ENTRIES_PER_PAGE}&offset=${entryOffset}`);
      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }
      return response.json();
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: { content: string; category?: string }) => {
      return apiRequest("POST", "/api/entries", newEntry);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showUserMenu={true} />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Today's Entry Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-foreground">Today's Moment</h2>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </div>

          <JournalEntryForm 
            onSubmit={(data) => {
              createEntryMutation.mutate({
                content: data.content,
                category: data.category,
              });
            }}
            isSubmitting={createEntryMutation.isPending}
          />
        </section>

        {/* Previous Entries Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-foreground">Your Joy Collection</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : entries.length > 0 ? (
            <>
              <JournalEntryList entries={entries} />
              
              {entries.length >= ENTRIES_PER_PAGE && (
                <div className="py-4 text-center">
                  <button 
                    className="text-primary font-medium flex items-center justify-center mx-auto"
                    onClick={loadMoreEntries}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                          <path d="M16 16h5v5" />
                        </svg>
                        Load more memories
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl card-shadow">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary h-8 w-8"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M9 15h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-6">
                Start capturing your daily moments of joy
              </p>
            </div>
          )}
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
