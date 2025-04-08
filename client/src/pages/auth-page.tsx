import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeafIcon, ArrowLeft, Linkedin, Apple } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms and conditions" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      terms: false,
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    registerMutation.mutate({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-stretch">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <LeafIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
              Welcome to Joy Sparks
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Capture and preserve your daily moments of joy
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="you@example.com" 
                                  {...field} 
                                  disabled={loginMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  disabled={loginMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between">
                          <FormField
                            control={loginForm.control}
                            name="rememberMe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loginMutation.isPending}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Remember me
                                </FormLabel>
                              </FormItem>
                            )}
                          />

                          <div className="text-sm">
                            <button type="button" className="font-medium text-primary hover:text-primary/80">
                              Forgot password?
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign in"}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-card text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button" disabled={loginMutation.isPending}>
                          <svg 
                            className="w-5 h-5" 
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#EA4335"
                              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                              fill="#34A853"
                              d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                            />
                            <path
                              fill="#4A90E2"
                              d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                            />
                          </svg>
                        </Button>

                        <Button variant="outline" type="button" disabled={loginMutation.isPending}>
                          <Apple className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={registerMutation.isPending} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={registerMutation.isPending} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="you@example.com" 
                                  {...field} 
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Minimum 8 characters" 
                                  {...field} 
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  I agree to the{" "}
                                  <a href="#" className="text-primary hover:text-primary/80">
                                    Terms of Service
                                  </a>{" "}
                                  and{" "}
                                  <a href="#" className="text-primary hover:text-primary/80">
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-card text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button" disabled={registerMutation.isPending}>
                          <svg 
                            className="w-5 h-5" 
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#EA4335"
                              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                              fill="#34A853"
                              d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                            />
                            <path
                              fill="#4A90E2"
                              d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                            />
                          </svg>
                        </Button>

                        <Button variant="outline" type="button" disabled={registerMutation.isPending}>
                          <Apple className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="hidden lg:flex lg:w-1/2 bg-primary/10 relative items-center justify-center">
          <div className="max-w-lg px-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Capture the moments that bring you joy</h2>
            <p className="text-lg mb-6 text-foreground/80">
              Joy Sparks helps you preserve the small but meaningful moments of everyday life. Start your daily journaling practice and build a collection of memories to look back on.
            </p>
            <div className="rounded-lg overflow-hidden card-shadow mb-8">
              <img 
                src="https://images.unsplash.com/photo-1606244864456-8bee63fce472" 
                alt="Journaling" 
                className="w-full h-auto"
              />
            </div>
            <div className="flex items-center text-sm space-x-4">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                  alt="User"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="User"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
                  alt="User"
                />
              </div>
              <p className="text-muted-foreground">Join thousands of others capturing daily joy</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center py-4 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center mx-auto"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </div>
    </div>
  );
}
