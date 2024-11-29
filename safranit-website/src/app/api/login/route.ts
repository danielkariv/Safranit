import { authUser } from '@/libs/data'
import { NextResponse } from 'next/server'

type ResponseData = {
  message?: string
  error?: string
}

interface LoginRequestBody {
  email: string
  password: string
}

// Handle POST request for login
export async function POST(req: Request): Promise<NextResponse<ResponseData>> {
  try {
    const body: LoginRequestBody = await req.json() // Parse the JSON body

    const { email, password } = body

    // Server-side validation
    if (!email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Call the authUser function to authenticate the user
    const isAuthenticated = await authUser({ email, password })

    if (isAuthenticated) {
      // Send success response if authentication is successful
      return NextResponse.json({ message: 'Login successful!' })
    } else {
      // Return error if authentication fails (though `authUser` should throw an error if this occurs)
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Invalid email or password')) {
      console.log("Error: ", err.message );
      return NextResponse.json({ error: err.message }, { status: 401 })
    }
    console.log('Error during login:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
