'use server'
// TODO: this is being loaded in client side! (data.ts exposed to client, because of usage in client side code.. see /latest page.ts)
import { sql } from '@vercel/postgres';
/*
Note about "sql<>`select * from books where id=${id}`" and similar commands, it is safe from SQL injection, because it makes it a query + parameters.
See: https://neon.tech/blog/sql-template-tags
*/
// TODO: needs a cleanup and improving. It should handle edgecases, and the naming is off in multiple componenets.
export type DB_books = {
    id : string;
    image : string;
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
    try{
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

  export async function fetchlatestBooks(page : number, count : number = 10) {
    try{
        const data = await sql<DB_books>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT ${count} OFFSET ${(page-1) * count};`;
        const books: { href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks:Record<string, string> }[] = []
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
                storelinks : row.storelinks
            });
        });
        const metadata = await sql<DB_books>`SELECT count(*) as amount FROM books`;
        const amount = metadata.rows[0].amount;
        const pages = Math.ceil(amount/count);
        return {books ,pages};
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch latest books, page:${page} count:${count}.`);
      }
  }

  export async function insertBook(book : {
    imageSrc: string,
    title: string,
    writer: string,
    des: string,
    badges: Array<string>,
    storelinks: { [key: string]: string }}) {
    try{
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