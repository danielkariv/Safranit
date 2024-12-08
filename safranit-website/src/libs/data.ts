'use server';
// TODO: verify that no page is reading this client side (was a bug previously)
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
/*
Note about "sql<>`select * from books where id=${id}`" and similar commands, it is safe from SQL injection, because it makes it a query + parameters.
See: https://neon.tech/blog/sql-template-tags
*/
// TODO: needs a cleanup and improving. It should handle edgecases, and the naming is off in multiple componenets.
export type DB_books = {
  id: string;
  image: string;
  title: string;
  writer: string;
  description: string;
  last_updated: Date;
  tags: Array<string>;
  storelinks: Record<string, string>;
};
export interface BookProps {
  href: string;
  imageSrc: string;
  title: string;
  writer: string;
  badges: string[];
  des: string;
  storelinks: Record<string, string> | null;
}
export type DB_USER_BOOKS = {
  user_id: string;
  book_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
export async function fetchBookData(id: string) {
  try {

    const data = await sql<DB_books>`SELECT * FROM books WHERE id=${id}`;

    if (data.rowCount === 0) {
      console.log(`No book found for id: ${id}`);
      return null;
    }

    const row = data.rows[0];
    // Check if the required fields are available
    // TODO: make sure what is a must and what not.
    if (!row.id || !row.image || !row.title || !row.writer || !row.description || !row.tags || !row.storelinks) {
      console.error('Missing required fields in the database row:', row);
      throw new Error(`Incomplete data for book with id:${id}`);
    }
    // Ensure `storelinks` is a valid object (parse if it's a stringified JSON)
    let storelinks;
    try {
      storelinks = typeof row.storelinks === 'string' ? JSON.parse(row.storelinks) : row.storelinks;
    } catch (error) {
      console.error('Error parsing storelinks:', error);
      throw new Error(`Failed to parse storelinks for book with id:${id}`);
    }
    // TODO: probably needs to do similarly for array of tags.

    // Return the formatted book data
    return {
      href: `/book/${row.id}/`,
      imageSrc: row.image,
      title: row.title,
      writer: row.writer,
      des: row.description,
      badges: row.tags,
      storelinks: storelinks,
    };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch book data, id:${id}.`);
  }
}

export async function fetchlatestBookData() {
  try {
    const data = await sql<DB_books>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT 1;`;
    const row = data.rows[0];
    // TODO: probably needs the same validation from fetchBookData
    return {
      href: `/book/${row.id}/`,
      imageSrc: row.image,
      title: row.title,
      writer: row.writer,
      des: row.description,
      badges: row.tags,
      storelinks: row.storelinks
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest book data.');
  }
}

export async function fetchlatestBooks(page: number, count: number = 10) {
  try {
    const data = await sql<DB_books>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT ${count} OFFSET ${(page - 1) * count};`;
    const books: { href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks: Record<string, string> }[] = []
    // convert rows into formated books array.
    data.rows.forEach((row) => {
      // TODO: probably needs the same validation from fetchBookData.
      books.push({
        href: `/book/${row.id}/`,
        imageSrc: row.image,
        title: row.title,
        writer: row.writer,
        des: row.description,
        badges: row.tags,
        storelinks: row.storelinks
      });
    });
    const metadata = await sql<{ amount: number }>`SELECT count(*) as amount FROM books`;
    const amount = metadata.rows[0].amount;
    const pages = Math.ceil(amount / count);
    return { books, pages };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch latest books, page:${page} count:${count}.`);
  }
}

export async function insertBook(book: {
  imageSrc: string,
  title: string,
  writer: string,
  des: string,
  badges: Array<string>,
  storelinks: { [key: string]: string }
}) {
  try {
    // We convert array and JSON to string. 
    await sql`
            INSERT INTO books (image, title, writer, tags, description, storeLinks)
            VALUES (${book.imageSrc}, ${book.title}, ${book.writer}, ${JSON.stringify(book.badges)}, ${book.des}, ${JSON.stringify(book.storelinks)})
            ON CONFLICT (title, writer)  -- Conflict check on title and writer
            DO UPDATE SET
                image = EXCLUDED.image,  -- Update image if conflict occurs
                tags = EXCLUDED.tags,    -- Update tags if conflict occurs
                description = EXCLUDED.description,  -- Update description if conflict occurs
                storeLinks = EXCLUDED.storeLinks;  -- Update storeLinks if conflict occurs
        `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert new book data.');
  }
}

export async function fetchSearchBooks(query: string, page: number, count: number = 10) {
  try {
    // Fetch books with pagination and search query
    const data = await sql<DB_books>`
        SELECT * FROM books
        WHERE title ILIKE ${'%' + query + '%'} OR writer ILIKE ${'%' + query + '%'}
        ORDER BY last_updated DESC
        LIMIT ${count} OFFSET ${(page - 1) * count};
      `;

    const books: {
      href: string;
      imageSrc: string;
      title: string;
      writer: string;
      des: string;
      badges: string[];
      storelinks: Record<string, string>;
    }[] = [];

    // Convert rows into formatted books array
    data.rows.forEach((row) => {
      books.push({
        href: `/book/${row.id}/`,
        imageSrc: row.image,
        title: row.title,
        writer: row.writer,
        des: row.description,
        badges: row.tags,
        storelinks: row.storelinks,
      });
    });

    // Fetch total count of matching books
    const metadata = await sql<{ amount: number }>`
        SELECT count(*) as amount FROM books 
        WHERE title ILIKE ${'%' + query + '%'} OR writer ILIKE ${'%' + query + '%'}
      `;
    const amount = metadata.rows[0].amount;
    const pages = Math.ceil(amount / count);

    return { books, pages };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch books with query: "${query}", page: ${page}, count: ${count}.`);
  }
}


export async function insertUser(user: { name: string, email: string, password: string }) {
  try {
    const { name, email, password } = user;

    // Hash the password before inserting (assuming bcrypt is being used)
    // You should hash the password before passing it to the query
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
                            INSERT INTO users (username, email, password_hash, role, created_at, last_updated)
                            VALUES (${name}, ${email}, ${hashedPassword}, 'user', NOW(), NOW())
                            ON CONFLICT (email) 
                            DO NOTHING;
                        `;

    if (result.rowCount === 0) {
      throw new Error(`Email already exists: ${email}`);
    }

  } catch (error: unknown) {
    // Handle specific error
    if (error instanceof Error && error.message.includes("Email already exists")) {
      throw new Error('Email already exists. Please choose a different email.');
    }
    console.error('Database Error:', error);
    // Handle other errors
    throw new Error('Failed to insert new user.');
  }
}

export async function authUser(user: { email: string, password: string }) {
  try {
    const { email, password } = user;

    // Fetch the user by email
    const result = await sql`
            SELECT email, password_hash 
            FROM users 
            WHERE email = ${email}
        `;

    // Check if the user exists
    if (result.rowCount === 0) {
      throw new Error('Invalid email or password.');
    }

    const dbUser = result.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    // If the email and password match, return true (successful login)
    return true;

  } catch (error: unknown) {
    // Handle specific error
    if (error instanceof Error && error.message.includes("Invalid email or password")) {
      throw new Error('Invalid email or password.');
    }
    console.error('Database Error:', error);
    // Handle other errors
    throw new Error('Failed to authenticate user.');
  }
}


// Secret key for signing JWT (store securely in environment variables)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 // 1 day in seconds
}
export async function getCookieOptions() {
  return COOKIE_OPTIONS;
}

// Function to generate a JWT
export async function generateJWT(payload: JWTPayload, expiresIn: string): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm
    .setExpirationTime(expiresIn) // Set expiration time
    .setIssuedAt() // Add "iat" (issued at) claim
    .sign(JWT_SECRET) // Sign the JWT with the secret key
}

// Function to verify a JWT
export async function verifyJWT(token: string, secret: Uint8Array) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function verifySession(sessionCookie: string): Promise<{ email: string } | null> {
  const session = sessionCookie;

  if (!session) {
    return null
  }

  try {
    // Verify the JWT and extract the payload
    const { payload } = await jwtVerify(session, JWT_SECRET);

    // Validate that payload contains the expected email property
    if (typeof payload.email === 'string') {
      return { email: payload.email };
    } else {
      console.log('Payload is missing the email property or it is invalid.');
      return null;
    }
  } catch (err) {
    console.log('Invalid session token:', err);
    return null;
  }
}

export async function fetchBookUserStatus(story_id: string, userData: { email: string; }) {
  try {
    const user = await sql<DB_books>`SELECT * FROM users WHERE email=${userData.email}`;

    if (user.rowCount === 0) {
      console.log(`No user found for email: ${userData.email}`);
      return null;
    }
    const userRow = user.rows[0];
    const data = await sql<DB_USER_BOOKS>`SELECT * FROM user_books WHERE user_id=${userRow.id} AND book_id=${story_id}`;

    if (data.rowCount === 0) {
      // console.log(`No book found for id: ${story_id} with user id: ${userRow.id}`);
      return null;
    }

    const row = data.rows[0];
    return row.status;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch book data, id:${story_id}, userData:${userData}.`);
  }
}


export async function updateUserBooksStatus(userData: { email: string }, productId: string, status: string) {
  try {
    const user = await sql<DB_books>`SELECT * FROM users WHERE email=${userData.email}`;

    if (user.rowCount === 0) {
      console.log(`No user found for email: ${userData.email}`);
      return null;
    }
    const userRow = user.rows[0];
    // We convert array and JSON to string. 
    await sql`
            INSERT INTO user_books (user_id, book_id, status)
            VALUES (${userRow.id}, ${productId}, ${status})
            ON CONFLICT (user_id, book_id)  -- Conflict check on title and writer
            DO UPDATE SET
                status = EXCLUDED.status  -- Update status if conflict occurs
        `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert new user_books status.');
  }
}

export async function fetchWishlistBooks(query: string, page: number, count: number = 10, userData: { email: string }) {
  try {
    const books: {
      href: string;
      imageSrc: string;
      title: string;
      writer: string;
      des: string;
      badges: string[];
      storelinks: Record<string, string>;
    }[] = [];
    const user = await sql<DB_books>`SELECT * FROM users WHERE email=${userData.email}`;

    if (user.rowCount === 0) {
      console.log(`No user found for email: ${userData.email}`);
      return { books, 0:Number };
    }
    const userRow = user.rows[0];
    const userId = userRow.id;
    // Fetch books with pagination and search query
    // Fetch books matching the search query and wishlist status for the user
    const data = await sql<DB_books>`
        SELECT books.*
        FROM books
        JOIN user_books ON books.id = user_books.book_id
        WHERE user_books.user_id = ${userId}
          AND user_books.status = 'wishlist'
          AND (books.title ILIKE ${'%' + query + '%'} OR books.writer ILIKE ${'%' + query + '%'})
        ORDER BY books.last_updated DESC
        LIMIT ${count} OFFSET ${(page - 1) * count};
      `;
    console.log(data);
    

    // Convert rows into formatted books array
    data.rows.forEach((row) => {
      books.push({
        href: `/book/${row.id}/`,
        imageSrc: row.image,
        title: row.title,
        writer: row.writer,
        des: row.description,
        badges: row.tags,
        storelinks: row.storelinks,
      });
    });

    // Fetch total count of matching books
    const metadata = await sql<{ amount: number }>`
        SELECT count(books.*)
        FROM books
        JOIN user_books ON books.id = user_books.book_id
        WHERE user_books.user_id = ${userId}
          AND user_books.status = 'wishlist'
          AND (books.title ILIKE ${'%' + query + '%'} OR books.writer ILIKE ${'%' + query + '%'})
      `;
    const amount = metadata.rows[0].amount;
    const pages = Math.ceil(amount / count);

    return { books, pages };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch books with query: "${query}", page: ${page}, count: ${count}.`);
  }
}
