"use server";
import { sql } from '@vercel/postgres';

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
        // Fetch data from the database
        const data = await sql<DB_books>`SELECT * FROM books WHERE id=${id}`;
        
        // Log the data to inspect the structure
        console.log("Fetched data:", data);

        // If no rows are returned, return null
        if (data.rowCount === 0) {
            console.log(`No book found for id: ${id}`);
            return null;
        }

        const row = data.rows[0];

        // Check if the required fields are available
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

        // Return the formatted book data
        return {
            href: `/book/${row.id}/`,  // Assuming `row.id` is correct
            imageSrc: row.image,
            title: row.title,
            writer: row.writer,
            des: row.description,
            badges: row.tags,  // Assuming `tags` is a valid array
            storelinks: storelinks,  // Assuming this is a valid object after parsing
        };

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch book data, id:${id}.`);
    }
}


export async function fetchLastestBookData() {
    try{
        const data = await sql<DB_books>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT 1;`;
        const row = data.rows[0];
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
        throw new Error('Failed to fetch lastest book data.');
      }
  }

  export async function fetchLastestBooks(page : number, count : number = 10) {
    try{
        const data = await sql<DB_books>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT ${count} OFFSET ${page-1};`;
        const books: { href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks:Record<string, string> }[] = []
        data.rows.forEach((row) => {
            // Assuming row is an object with book data
            books.push({
                href: `/book/${row.id}/`,
                imageSrc: row.image,
                title: row.title,
                writer: row.writer,
                des: row.description,
                badges: row.tags,
                storelinks : row.storelinks
            }); // Add each row to the books array
        });
        return books;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch lastest books, page:${page} count:${count}.`);
      }
  }
  

export async function insertBook(
    imageSrc: string,
    title: string,
    writer: string,
    des: string,
    badges: Array<string>,
    storelinks: JSON) {
    
    try{
        const query = `
        INSERT INTO books (image, title, writer, tags, description, storeLinks)
        VALUES ($1, $2, $3, $4, $5, $6);`;
      
        // Parameters are passed as an array, which automatically prevents SQL injection
        await sql.query(query, [imageSrc, title, writer, badges, des, storelinks]);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to insert new book data.');
      }
  }