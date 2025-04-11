import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Terms of Service</h1>
          <Link href="/auth">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Auth</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <p>Welcome to Joy Sparks! These Terms of Service ("Terms") govern your use of the Joy Sparks web application (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.</p>

          <h2>1. Project Purpose and Disclaimers</h2>
          <ul>
            <li><strong>Learning Project:</strong> This Service was created primarily as a learning exercise and for building in public. As such, it may contain bugs, errors, or incomplete features. Use it at your own risk.</li>
            <li><strong>No Guarantees:</strong> We make no guarantees regarding the reliability, availability, or accuracy of the Service. Data loss may occur.</li>
            <li><strong>"As Is":</strong> The Service is provided "as is" without warranties of any kind, either express or implied.</li>
          </ul>

          <h2>2. Use of the Service</h2>
          <ul>
            <li>You must be at least 13 years old (or the required age in your jurisdiction) to use the Service.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the Service for any illegal or unauthorized purpose.</li>
            <li>You are solely responsible for the content you create and store ("User Content").</li>
          </ul>

          <h2>3. User Content and Data Access</h2>
          <ul>
            <li>You retain ownership of your User Content.</li>
            <li><strong>Administrator Access:</strong> You acknowledge and agree that administrators of the Service (the developers/owner) may need to access your User Content and account information for purposes such as:
              <ul>
                <li>Debugging issues and troubleshooting problems.</li>
                <li>Maintaining and improving the Service.</li>
                <li>Ensuring compliance with these Terms.</li>
                <li>Responding to legal requirements or preventing harm.</li>
              </ul>
            </li>
            <li>We will strive to respect the privacy of your User Content but cannot guarantee confidentiality due to the nature of the project and potential operational needs.</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>The Service and its original content (excluding User Content), features, and functionality are owned by the project creator and are protected by intellectual property laws.</p>

          <h2>5. Termination</h2>
          <p>We may terminate or suspend your access to the Service at any time, without prior notice or liability, for any reason, including if you breach these Terms.</p>

          <h2>6. Limitation of Liability</h2>
          <p>In no event shall the creators of Joy Sparks be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.</p>

          <h2>7. Governing Law</h2>
          <p>These Terms shall be governed by the laws of [Specify Jurisdiction - e.g., California, USA], without regard to its conflict of law provisions.</p>

          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will provide notice of changes by updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>

          <h2>9. Contact</h2>
          <p>If you have any questions about these Terms, please contact [Your Contact Email or Method].</p>

          <p><em>Last Updated: [Date]</em></p>
        </div>
      </main>
    </div>
  );
} 