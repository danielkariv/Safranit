import BookPreviewCard from "@/components/BookPreviewCard";
import { fetchWishlistBooks, verifySession } from "@/libs/data";
import { cookies } from "next/headers";
import Link from "next/link";

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

  // Access cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const sessionData = (sessionCookie)? await verifySession(sessionCookie) : null;
  if (!sessionData){
    // Return error message.
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-base-100">
        <h1 className="text-2xl font-bold text-error">Access Denied</h1>
        <p className="text-lg mb-4">
          Please log in to access this page.
        </p>
        <Link href="/login" className="btn btn-primary">
          Go to Login Page
        </Link>
      </div>
    );
  }


  const { books, pages } = await fetchWishlistBooks(searchQuery, currentPage, itemsPerPage, sessionData); // Fetch books from API or backend

  // Render pagination buttons
  const renderPagination = () => {
    if (pages === undefined)
      return [];
    const pagination = [];

    if (currentPage > 3) {
      pagination.push(
        <a
          key="first"
          href={`/wishlist?page=1&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage - 1}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage - 2}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage - 1}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage + 1}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage + 2}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${currentPage + 1}&query=${encodeURIComponent(searchQuery)}`}
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
          href={`/wishlist?page=${pages}&query=${encodeURIComponent(searchQuery)}`}
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
        <h2 className="font-bold text-xl">Wishlisted Books:</h2>
        <form
          method="get"
          action="/wishlist"
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
