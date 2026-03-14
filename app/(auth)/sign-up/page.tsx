"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client"
import { Spinner } from "@/components/ui/spinner"

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
        const result = await signUp.email({
            name,
            email,
            password,
        });

        if (result.error) {
            setError(result.error.message ?? "Failed to sign up");
        } else {
            router.push("/dashboard");
        }
        } catch (err) {
        setError("An unexpected error occurred");
        } finally {
        setLoading(false);
        }
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Create an account to start tracking your job application
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                            )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input id="name" 
                                className="border-gray-300 focus:border-primary focus:ring-primary" 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe" 
                                required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input id="email" 
                                className="border-gray-300 focus:border-primary focus:ring-primary" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="John@example.com" 
                                required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input id="password" 
                                minLength={8} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-gray-300 focus:border-primary focus:ring-primary" 
                                type="password" 
                                placeholder="********" 
                                required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? <div className="flex items-center gap-2">Creating account <Spinner /></div> : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">Already have an account? 
                            <Link className="ml-1 font-medium text-primary hover:underline" href="/sign-in">Sign In</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}