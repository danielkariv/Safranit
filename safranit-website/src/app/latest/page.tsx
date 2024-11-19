"use client";
import { useState, useEffect, useCallback } from "react";
import BookPreviewCard from "@/components/BookPreviewCard";
import MainDrawer from "@/components/MainDrawer";
import { fetchlatestBooks } from "@/libs/data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const renderPagination = (page, pages, setPage) => {
  const pagination = [];

  // Always show the first page
  if (page > 3) {
    pagination.push(
      <button
        key="first"
        onClick={() => setPage(1)}
        className="join-item btn"
      >
        1
      </button>
    );
  }

  // Show previous page button
  if (page > 1) {
    pagination.push(
      <button
        key="prev"
        onClick={() => setPage(page - 1)}
        className="join-item btn"
      >
        &lt;
      </button>
    );
  }

  // Show pages before the current page (2 pages before, if possible)
  if (page > 2) {
    pagination.push(
      <button
        key={page - 2}
        onClick={() => setPage(page - 2)}
        className="join-item btn"
      >
        {page - 2}
      </button>
    );
  }

  if (page > 1) {
    pagination.push(
      <button
        key={page - 1}
        onClick={() => setPage(page - 1)}
        className="join-item btn"
      >
        {page - 1}
      </button>
    );
  }

  // Show the current page
  pagination.push(
    <button
      key="current"
      className="join-item btn btn-active"
    >
      {page}
    </button>
  );

  // Show pages after the current page (2 pages after, if possible)
  if (page < pages - 1) {
    pagination.push(
      <button
        key={page + 1}
        onClick={() => setPage(page + 1)}
        className="join-item btn"
      >
        {page + 1}
      </button>
    );
  }

  if (page < pages - 2) {
    pagination.push(
      <button
        key={page + 2}
        onClick={() => setPage(page + 2)}
        className="join-item btn"
      >
        {page + 2}
      </button>
    );
  }

  // Show next page button
  if (page < pages) {
    pagination.push(
      <button
        key="next"
        onClick={() => setPage(page + 1)}
        className="join-item btn"
      >
        &gt;
      </button>
    );
  }

  // Always show the last page
  if (page < pages - 2) {
    pagination.push(
      <button
        key="last"
        onClick={() => setPage(pages)}
        className="join-item btn"
      >
        {pages}
      </button>
    );
  }

  return pagination;
};

export default function Home() {
  const [books, setBooks] = useState(Array<{ href: string; imageSrc: string; title: string; writer: string; des: string; badges: string[]; storelinks:Record<string, string> }>);
  const [pages, setPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current page from the URL query parameter
  const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not found

  // Fetch books when the page changes
  useEffect(() => {
    const getBooks = async () => {
      // TODO: this leads to server side expose, need to be called server side!
      const { books, pages } = await fetchlatestBooks(page);
      setBooks(books);
      setPages(pages);
      // If the page is higher than available pages, redirect to the last page
      if (page > pages) {
        router.push(`?page=${pages}`, undefined);
      }
    };

    getBooks();
  }, [page]);  // Re-fetch when the page changes

  // Function to update the URL with the new page
  const changePage = (newPage: number) => {
    // Only update the URL if the page is different
    if (newPage !== page) {
      router.push(`?page=${newPage}`, undefined);
    }
  };
  return (
    <MainDrawer>
      <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
        <div className="flex w-full items-start justify-start p-2">
          <h2 className="font-bold text-xl p-2">Latest Books:</h2>
        </div>

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
          <div className="join">
            {renderPagination(page, pages, changePage)}
          </div>
        </div>
      </div>
    </MainDrawer>
  );
}
