import { insertBook} from "@/libs/data";
import fs from "fs";
import path from "path";

// This page component is async since we're fetching data from a server
export default async function DebugInsertData() {
    return(<>Disabled!</>);
  try {
    // Load the JSON file from the file system
    const filePath = path.join(process.cwd(), "scraped_data.json"); // Adjust path as necessary
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Iterate over each book entry and prepare it for batch insertion
    for (const book of jsonData) {
      const storeLinks = {
        steimatzky: String(book.url),
      };
      // made a mistake where it made double the tags, so this correct it.
      const tagsHalf = book.tags.slice(0, book.tags.length / 2);
      const value = {
        imageSrc: book.coverImageUrl, // Image source
        title: book.title, // Book title
        writer: book.author, // Writer
        des: book.description, // Description
        badges: tagsHalf, // Tags
        storelinks: storeLinks, // Store links
      };
      await insertBook(value);
      // TODO: It lacks some information from the dataset (like release year, and such).
      // TODO: I can't find an easy way to do it in bulks, it requires ORM libary to do safely.
    }
    return (
      <>
        <h1>Insert dataset from local storage completed.</h1>
      </>
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return (
      <>
        <h1>Error inserting data. Check console for details.</h1>
      </>
    );
  }
}
