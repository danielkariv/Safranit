import { insertUser } from '@/libs/data'
import { NextResponse } from 'next/server'

type ResponseData = {
  message?: string
  error?: string
}

interface SignupRequestBody {
  name: string
  email: string
  password: string
}

// Handle POST request
export async function POST(req: Request): Promise<NextResponse<ResponseData>> {
  try {
    const body: SignupRequestBody = await req.json() // Parse the JSON body

    const { name, email, password } = body

    // Server-side validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Call the insertUser function to insert the user into the database
    await insertUser({ name, email, password })

    // Send success response
    return NextResponse.json({ message: 'Signup successful!' })
  } catch (err: unknown) {
    
    if (err instanceof Error && err.message.includes("Email already exists")) {
      console.log('Error during signup:', err.message);
      return NextResponse.json({error: err.message}, {status: 406});
    }
    console.log('Error during signup:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
