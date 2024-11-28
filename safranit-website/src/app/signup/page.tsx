"use client";

import { useState } from "react";

interface FormData {
    name: string;
    email: string;
    password: string;
}

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        try {
            
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await response;
            
            if (!response.ok) {
                throw new Error(result.statusText || "Something went wrong.");
            }

            setSuccess("Signup successful! Redirecting to login page..");
            setFormData({ name: "", email: "", password: "" }); // Clear form

            // Redirect user after successful login
            setTimeout(() => {
                window.location.href = "/login"; // Adjust based on your app's structure
            }, 2000);
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
                    <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

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
                            Sign Up
                        </button>
                    </form>

                    {/* Error and Success Messages */}
                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                    {success && <p className="text-green-500 mt-2 text-center">{success}</p>}

                    {/* Login Link */}
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-500 hover:underline">
                                Log in here
                            </a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
