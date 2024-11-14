import { fetchBookData } from "@/libs/data";
import { Suspense } from "react";
import MainDrawer from "@/components/MainDrawer";
import Description from "@/components/Description";
import Image from "next/image";
// This page component is async since we're fetching data from a server
export default async function BookPage({ params }: { params:  Promise<{ productId: string }> }) {
  try {
    const final_params = await params;
    // Fetch the book data based on the dynamic productId from the params
    const bookData = await fetchBookData(final_params.productId);
    
    // If no book data is found, return an error message
    if (!bookData) {
      return (
        <MainDrawer>
          <div>Error: Cant find book data!</div>
        </MainDrawer>
      );
    }

    // If book data is found, return the page content
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MainDrawer>
          <div className="hero bg-base-200 min-h-screen">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${bookData.imageSrc})`,
                WebkitMaskImage:
                  "-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.8)), to(rgba(0,0,0,0)))",
                backgroundPosition: "0% 25%",
                backgroundSize: "cover",
                filter: "blur(8px) brightness(50%) saturate(50%)",
                transform: "scale(1.0)",
                zIndex: "0",
                overflow: "hidden",
              }}
            ></div>

            <div className="hero-content text-center flex flex-row-reverse gap-8">
              <div
                className="max-w-2xl mx-auto text-right shadow-lg sm:p-10 p-2 bg-opacity-50 bg-base-100"
                dir="rtl"
              >
                {/* Left side (Title + Author) */}
                <div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:gap-8">
                    {/* Left side (Title + Author) */}
                    <div className="flex flex-col justify-center w-full">
                      <h1 className="text-5xl font-bold">{bookData.title}</h1>
                      <p className="text-xl mt-2">{bookData.writer}</p>
                    </div>

                    {/* Right side (Image) */}
                    <div className="flex justify-center sm:w-1/5 sm:flex sm:justify-center sm:mt-0 mt-4">
                      <Image
                        alt={bookData.title}
                        src={bookData.imageSrc}
                        width={300}
                        height={464}
                        className="rounded-lg shadow-lg aspect-[3/4]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    {bookData.badges.map((tag, index) => (
                      <span
                        key={index}
                        className={`badge badge-secondary badge-md truncate min-w-max`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Client-Side Component for Toggling Description */}
                  <Description des={bookData.des} />

                  {/* Store Buttons */}
                  <div className="flex justify-center gap-2 mt-4">
                    <a
                      href={bookData.storelinks.steimatzky}
                      className="btn btn-outline btn-primary"
                    >
                      סטימצקי
                    </a>
                    <a
                      href={bookData.storelinks.booknet}
                      className="btn btn-outline btn-secondary"
                    >
                      צומת ספרים
                    </a>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <button className="btn btn-primary">Add to Wishlist</button>
                    <button className="btn btn-secondary">Mark as Read</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainDrawer>
      </Suspense>
    );
  } catch {
    // Catch any errors during the async fetch and render an error message
    return (
      <MainDrawer>
        <div>Error: Unable to fetch book data!
        </div>
        
      </MainDrawer>
    );
  }
}
