import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Privacy Policy</h1>
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
          <p>
            Your privacy is important to us. This Privacy Policy explains how Joy Sparks collects, uses, and discloses information about you when you use our web application (the "Service").
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> When you register, we collect information such as your name (optional, if provided via Google Sign-In), email address, and password (if using email/password registration).</li>
            <li><strong>Journal Entries:</strong> We collect the content you create and save as journal entries within the Service.</li>
            <li><strong>Usage Information:</strong> We may collect information about how you interact with the Service, such as pages visited and features used (standard web server logs).</li>
            <li><strong>Device Information:</strong> We may collect information about the device you use to access the Service, such as IP address, browser type, and operating system.</li>
            <li><strong>Google Sign-In:</strong> If you use Google Sign-In, we receive information from Google such as your name, email address, and profile picture URL, as permitted by your Google account settings.</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <ul>
            <li>To provide, maintain, and improve the Service.</li>
            <li>To authenticate users and personalize your experience.</li>
            <li>To communicate with you (though active communication is unlikely for this project).</li>
            <li><strong>For Development and Debugging:</strong> As stated in the Terms of Service, administrators may access user data, including journal entries, for operational needs like debugging, troubleshooting, and improving the Service.</li>
            <li>To monitor and analyze trends, usage, and activities in connection with our Service (primarily for learning and improvement).</li>
          </ul>
          
          <h2>3. How We Share Information</h2>
          <p>We do not share your personal information with third parties except in the following circumstances:</p>
          <ul>
            <li>With your consent.</li>
            <li>For external processing (e.g., hosting providers like Replit, database providers like Neon). These providers have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.</li>
            <li>To comply with laws or respond to lawful requests and legal processes.</li>
            <li>To protect the rights and property of the Joy Sparks project, our users, and others.</li>
            <li><strong>Administrator Access:</strong> As mentioned, administrators have access to user data for operational purposes inherent to running and developing the application.</li>
          </ul>
          <p>
            We do not sell your personal information.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, please remember this is a learning project, and no internet transmission is ever completely secure or error-free. Data security cannot be guaranteed.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your account information and journal entries as long as your account is active or as needed to provide you the Service. You can request account deletion by contacting us [Provide Contact Method if applicable, otherwise remove or state data is kept indefinitely while service runs]. We may retain certain information as required by law or for legitimate business purposes after you delete your account.
          </p>
          
          <h2>6. Your Choices</h2>
          <p>
            You may update or correct your account information (if applicable features exist) by logging into your account. You can choose not to provide certain information, but that may prevent you from using certain features of the Service.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            The Service is not intended for children under the age of 13 (or a higher age threshold depending on your jurisdiction). We do not knowingly collect personal information from children.
          </p>
          
          <h2>8. Changes to This Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the bottom of the policy and, in some cases, we may provide additional notice (such as adding a statement to our homepage or sending you a notification - though unlikely for this project).
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at [Your Contact Email or Method].
          </p>

          <p><em>Last Updated: [Date]</em></p>
        </div>
      </main>
    </div>
  );
} 