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
  

export async function fetchBookData(id : string) {
    try{
        const data = await sql<Book>`SELECT * FROM books WHERE id=${id}`;
        if (data.rowCount == 0)
            return null;
        
        const row = data.rows[0];
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
        throw new Error(`Failed to fetch book data, id:${id}.`);
      }
  }

export async function fetchLastestBookData() {
    try{
        const data = await sql<Book>`SELECT * FROM books
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
        const data = await sql<Book>`SELECT * FROM books
                                    ORDER BY last_updated DESC
                                    LIMIT ${count} OFFSET ${page-1};`;
        const books: { href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks:JSON }[] = []
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