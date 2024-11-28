import Link from "next/link"; // Import Link if using Next.js

export default function Signup() {
    return (
        <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
            <div className="flex w-full items-center justify-center p-4">
                <div className="w-full max-w-md bg-base-200 shadow-md rounded p-6 mt-20">
                    <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                    <form className="flex flex-col space-y-4">
                        <div>
                            <label 
                                htmlFor="name" 
                                className="block text-sm font-medium">
                                Name
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Enter your full name"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required 
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium">
                                Email
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required 
                            />
                        </div>
                        
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Enter your password"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required 
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-2 rounded shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Sign Up
                        </button>
                    </form>
                    
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Already have an account?{" "}
                            <Link 
                                href="/login" 
                                className="text-blue-500 hover:underline">
                                Log in here
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
