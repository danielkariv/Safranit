import Link from 'next/link'
import MainDrawer from '../components/MainDrawer';
import BookPreviewCard from '../components/BookPreviewCard';
import BookPreviewHero from '../components/BookPreviewHero';
import {fetchLastestBookData, fetchLastestBooks} from '../libs/data';
export default async function Home() {
  const hero_book = await fetchLastestBookData();
  const lastest_books = await fetchLastestBooks(1,5);
  return (
    <div>
      <MainDrawer>
        <div className="flex flex-grow p-0">
          <div className="w-full content-start flex flex-wrap justify-center gap-6">
            <div className="flex w-full flex-col">
              {/* Hero, featured book on front page  */}
              <BookPreviewHero
                href={hero_book.href ? hero_book.href : "/"}
                imageSrc={hero_book.imageSrc}
                title={hero_book.title}
                writer={hero_book.writer}
                badges={hero_book.badges}
                des={hero_book.des}
              />
              <div className="divider" />
              <div className="max-w-screen-xl w-full mx-auto">
                <div className="flex w-full flex-row items-center justify-between p-2">
                  <h2 className="font-bold text-xl p-2">Lastest Books:</h2>
                  <Link href="/lastest" className="btn btn-ghost btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>

                <div className="card p-0 ml-6 mr-6 grid min-h-20 place-items-center">
                  {lastest_books.map((book, index) => (
                    <BookPreviewCard
                      key={index} // Use a unique key (preferably an ID, but index will work for now)
                      href={book.href} // Assuming each book has a unique 'id' field
                      imageSrc={book.imageSrc}
                      title={book.title}
                      writer={book.writer}
                      badges={book.badges}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainDrawer>
    </div>
  );
}
