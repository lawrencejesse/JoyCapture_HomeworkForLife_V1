import { HomeIcon, CalendarIcon, SearchIcon, UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  
  return (
    <nav className="lg:hidden bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-center">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate("/home");
          }} 
          className={cn(
            "flex flex-col items-center py-3 px-5", 
            location === "/home" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <HomeIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </a>
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()} 
          className="flex flex-col items-center py-3 px-5 text-muted-foreground"
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </a>
        <div className="relative -top-5">
          <button 
            className="bg-primary w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            onClick={() => {
              // Scroll to the top of the page where the entry form is
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()} 
          className="flex flex-col items-center py-3 px-5 text-muted-foreground"
        >
          <SearchIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </a>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile");
          }} 
          className={cn(
            "flex flex-col items-center py-3 px-5",
            location === "/profile" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <UserIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </nav>
  );
}
