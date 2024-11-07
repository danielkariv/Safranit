import { sql } from '@vercel/postgres';

export type Book = {
    id : string;
    image : string;
    title: string;
    writer: string;
    description: string;
    last_updated: Date;
    tags: Array<string>;
    storelinks: JSON;
  };
  

export async function fetchBookData() {
    try{
        const data = await sql<Book>`SELECT * FROM books`;
        let row = data.rows[0];
        return {
            href: `/book/${row.id}/`,
            imageSrc: row.image,
            title: row.title,
            writer: row.writer,
            des: row.description,
            badges: row.tags,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
      }
  }

export async function fetchLastestBookData() {
    try{
        const data = await sql<Book>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT 1;`;
        let row = data.rows[0];
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
        throw new Error('Failed to fetch revenue data.');
      }
  }

  export async function fetchLastestBooks(page : number, count : number = 10) {
    try{
        const data = await sql<Book>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT ${count} OFFSET ${page-1};`;
        let books: { href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks:JSON }[] = []
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
        throw new Error('Failed to fetch revenue data.');
      }
  }
