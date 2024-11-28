import { NextResponse } from "next/server";

interface SignupRequestBody {
    name: string;
    email: string;
    password: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        
        // Parse the JSON body from the request
        const body: SignupRequestBody = await req.json();

        const { name, email, password } = body;

        // Server-side validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // Save the data (placeholder for database logic)
        // Example: await db.users.create({ name, email, password });

        return NextResponse.json({ message: "Signup successful!" });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error during signup:", err.message);
            return NextResponse.json(
                { error: "Internal server error." },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "An unknown error occurred." },
            { status: 500 }
        );
    }
}
