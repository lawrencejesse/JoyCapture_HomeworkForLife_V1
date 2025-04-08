import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { YouTube } from "@/components/ui/youtube";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  CalendarIcon,
  Heart,
  Flame,
  Play,
  TimerIcon,
  UserPlus,
} from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function LandingPage() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 flex-grow flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <h1 className="font-bold text-3xl md:text-4xl leading-tight mb-4">
            Capture your daily moments of <span className="text-primary">joy</span>
          </h1>
          <p className="text-lg mb-6 text-foreground/80">
            Inspired by the "Homework for Life" concept, Joy Sparks helps you preserve the small but meaningful moments that might otherwise slip away.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Button size="lg" onClick={() => navigate("/home")}>
                <Flame className="mr-2 h-4 w-4" />
                Go to Journal
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/auth")}>
                  <Flame className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById('concept-section')?.scrollIntoView({ behavior: 'smooth' })}>
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative rounded-xl overflow-hidden card-shadow">
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643" 
              alt="Person writing in journal" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent flex items-end p-4">
              <Button variant="secondary" onClick={() => document.getElementById('concept-video')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play className="mr-2 h-4 w-4" />
                Watch the concept
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Concept Section */}
      <section id="concept-section" className="bg-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-2xl md:text-3xl text-center mb-8">The "Homework for Life" Concept</h2>
          
          <div id="concept-video" className="max-w-3xl mx-auto mb-8">
            <div className="rounded-xl overflow-hidden card-shadow">
              <YouTube videoId="x7p329Z8MD0" title="Homework for Life Concept" />
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              Every day, take just a moment to reflect and write down one meaningful moment - something that made you smile, feel grateful, or simply caught your attention.
            </p>
            <p className="text-lg mb-6">
              These small moments often slip away, but they're the essence of our lives. By capturing them daily, you create a treasure trove of memories and cultivate mindfulness.
            </p>
            <div className="flex justify-center">
              {user ? (
                <Button size="lg" onClick={() => navigate("/home")}>
                  <Flame className="mr-2 h-4 w-4" />
                  Go to Your Journal
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/auth")}>
                  Start Your Journey
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="font-bold text-2xl md:text-3xl text-center mb-12">How It Works</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-2xl text-primary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3">Daily Capture</h3>
            <p className="text-foreground/80">
              Take a moment each day to write down a brief memory that brought you joy or meaning.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <TimerIcon className="text-2xl text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-3">Build Over Time</h3>
            <p className="text-foreground/80">
              Watch your collection of moments grow, creating a beautiful timeline of your life's small joys.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-2xl text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-3">Reflect & Appreciate</h3>
            <p className="text-foreground/80">
              Look back at any time to reconnect with the meaningful moments that might otherwise be forgotten.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="bg-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-2xl md:text-3xl text-center mb-12">What Users Say</h2>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Sarah K.</h4>
                  <p className="text-sm text-foreground/70">Using Joy Sparks for 6 months</p>
                </div>
              </div>
              <p className="italic text-foreground/80">
                "I never realized how many beautiful moments I was forgetting until I started using Joy Sparks. Now I have a treasure trove of memories that would have otherwise disappeared."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">David M.</h4>
                  <p className="text-sm text-foreground/70">Using Joy Sparks for 1 year</p>
                </div>
              </div>
              <p className="italic text-foreground/80">
                "This simple practice has genuinely changed how I experience life. I'm more present and notice the small joys I used to miss. Reading back through my entries always brings a smile."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="font-bold text-2xl md:text-3xl mb-6">Start Capturing Your Moments Today</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          It takes just a minute each day to preserve the moments that matter. Begin your collection of joy and watch how it transforms your perspective.
        </p>
        {user ? (
          <Button size="lg" onClick={() => navigate("/home")}>
            <Flame className="mr-2 h-4 w-4" />
            Go to Your Journal
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate("/auth")}>
            <Flame className="mr-2 h-4 w-4" />
            Create Your Account
          </Button>
        )}
      </section>
      
      <Footer />
    </div>
  );
}
