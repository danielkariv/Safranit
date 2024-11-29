"use client";

import { useState } from "react";
import Link from "next/link";

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("Both email and password are required.");
            return;
        }

        try {
            // Send login data to the server
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response;

            if (!response.ok) {
                const res_json = await result.json();
                throw new Error(res_json.error || "Failed to log in.");
            }

            setSuccess("Login successful! Redirecting to homepage...");
            setFormData({ email: "", password: "" }); // Clear form

            // Redirect user after successful login
            setTimeout(() => {
                window.location.href = "/"; // Adjust based on your app's structure
            }, 3000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
            <div className="flex w-full items-center justify-center p-4">
                <div className="w-full max-w-md bg-base-200 shadow-md rounded p-6 mt-20">
                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Login
                        </button>
                    </form>

                    {/* Error and Success Messages */}
                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                    {success && <p className="text-green-500 mt-2 text-center">{success}</p>}

                    {/* Signup Link */}
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Don’t have an account?{" "}
                            <Link href="/signup" className="text-blue-500 hover:underline">
                                Sign up here
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
