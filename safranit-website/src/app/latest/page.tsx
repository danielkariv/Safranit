import BookPreviewCard from "@/components/BookPreviewCard";
import { fetchlatestBooks } from "@/libs/data";

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering (no caching)

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const {page} = await searchParams;
  const currentPage = parseInt(page || "1", 10); // Default to page 1
  const { books, pages } = await fetchlatestBooks(currentPage); // Fetch books from API or backend

  // Render pagination buttons
  const renderPagination = () => {
    const pagination = [];
  
    if (currentPage > 3) {
      pagination.push(
        <a key="first" href="/latest?page=1" className="join-item btn">
          1
        </a>
      );
    }
  
    if (currentPage > 1) {
      pagination.push(
        <a key="prev" href={`/latest?page=${currentPage - 1}`} className="join-item btn">
          &lt;
        </a>
      );
    }
  
    if (currentPage > 2) {
      pagination.push(
        <a key={currentPage - 2} href={`/latest?page=${currentPage - 2}`} className="join-item btn">
          {currentPage - 2}
        </a>
      );
    }
  
    if (currentPage > 1) {
      pagination.push(
        <a key={currentPage - 1} href={`/latest?page=${currentPage - 1}`} className="join-item btn">
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
        <a key={currentPage + 1} href={`/latest?page=${currentPage + 1}`} className="join-item btn">
          {currentPage + 1}
        </a>
      );
    }
  
    if (currentPage < pages - 2) {
      pagination.push(
        <a key={currentPage + 2} href={`/latest?page=${currentPage + 2}`} className="join-item btn">
          {currentPage + 2}
        </a>
      );
    }
  
    if (currentPage < pages - 2) {
      pagination.push(
        <a key="next" href={`/latest?page=${currentPage + 1}`} className="join-item btn">
          &gt;
        </a>
      );
    }
  
    if (currentPage < pages) {
      pagination.push(
        <a key="last" href={`/latest?page=${pages}`} className="join-item btn">
          {pages}
        </a>
      );
    }
  
    return pagination;
  };

  return (
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
          <div className="join">{renderPagination()}</div>
        </div>
      </div>
  );
}
