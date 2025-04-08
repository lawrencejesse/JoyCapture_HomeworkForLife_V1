import { LeafIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  showUserMenu?: boolean;
}

export default function Header({ showUserMenu = false }: HeaderProps) {
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <LeafIcon className="text-primary h-5 w-5 mr-2" />
          <h1 className="font-merriweather font-bold text-xl text-primary">Joy Sparks</h1>
        </div>
        
        <nav>
          {showUserMenu ? (
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground rounded-full"
              >
                <BellIcon className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/home")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="px-4 py-2 text-primary font-medium"
              >
                Log In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="ml-2"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
