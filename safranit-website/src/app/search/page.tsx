import BookPreviewCard from "@/components/BookPreviewCard";
import { fetchSearchBooks } from "@/libs/data";

export const dynamic = "force-dynamic"; // Ensures dynamic rendering (no caching)

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const { page, query } = await searchParams;
  const currentPage = parseInt(page || "1", 10); // Default to page 1
  const searchQuery = query || ""; // Default to an empty search query
  const itemsPerPage = 10; // Number of items to return per page

  const { books, pages } = await fetchSearchBooks(searchQuery, currentPage, itemsPerPage); // Fetch books from API or backend

  // Render pagination buttons
  const renderPagination = () => {
    const pagination = [];

    if (currentPage > 3) {
      pagination.push(
        <a
          key="first"
          href={`/search?page=1&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          1
        </a>
      );
    }

    if (currentPage > 1) {
      pagination.push(
        <a
          key="prev"
          href={`/search?page=${currentPage - 1}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          &lt;
        </a>
      );
    }

    if (currentPage > 2) {
      pagination.push(
        <a
          key={currentPage - 2}
          href={`/search?page=${currentPage - 2}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          {currentPage - 2}
        </a>
      );
    }

    if (currentPage > 1) {
      pagination.push(
        <a
          key={currentPage - 1}
          href={`/search?page=${currentPage - 1}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          {currentPage - 1}
        </a>
      );
    }

    pagination.push(
      <button key="current" className="join-item btn btn-active">
        {currentPage}
      </button>
    );

    if (currentPage < pages - 1) {
      pagination.push(
        <a
          key={currentPage + 1}
          href={`/search?page=${currentPage + 1}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          {currentPage + 1}
        </a>
      );
    }

    if (currentPage < pages - 2) {
      pagination.push(
        <a
          key={currentPage + 2}
          href={`/search?page=${currentPage + 2}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          {currentPage + 2}
        </a>
      );
    }

    if (currentPage < pages - 2) {
      pagination.push(
        <a
          key="next"
          href={`/search?page=${currentPage + 1}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          &gt;
        </a>
      );
    }

    if (currentPage < pages) {
      pagination.push(
        <a
          key="last"
          href={`/search?page=${pages}&query=${encodeURIComponent(searchQuery)}`}
          className="join-item btn"
        >
          {pages}
        </a>
      );
    }

    return pagination;
  };

  return (
    <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
      {/* Search Bar */}
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="font-bold text-xl">Search Books:</h2>
        <form
          method="get"
          action="/search"
          className="flex w-full max-w-md space-x-2"
        >
          <input
            type="text"
            name="query"
            defaultValue={searchQuery}
            placeholder="Search for books..."
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Book List */}
      <div className="card p-0 ml-6 mr-6 grid min-h-20 place-items-center w-full">
        {books.map((book, index) => (
          <BookPreviewCard
            key={index}
            href={book.href}
            imageSrc={book.imageSrc}
            title={book.title}
            writer={book.writer}
            badges={book.badges}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center py-4">
        <div className="join">{renderPagination()}</div>
      </div>
    </div>
  );
}
