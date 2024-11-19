import BookPreviewCard from "@/components/BookPreviewCard";

export default function Home() {
    return (
        <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
          <div className="flex w-full items-center justify-center p-2">
            <label className="input input-bordered flex items-center gap-2 max-w-screen-md w-full">
              <input type="text" className="grow" placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          <div className="card p-0 ml-6 mr-6 grid min-h-20 place-items-center w-full">
            <BookPreviewCard
              href="/test"
              imageSrc="https://d-steimatzky.co.il/wp-content/uploads/2024/10/1285-172-300x467.jpg"
              title="הפרי האסור 1: טעימה אסורה"
              writer="עדן בל"
              badges={["בדיקה", "ניסיון 1"]}
            />
            <BookPreviewCard
              href="/test"
              imageSrc="https://d-steimatzky.co.il/wp-content/uploads/2024/10/1245-4853-300x467.jpg"
              title="אושר"
              writer="דניאל סטיל"
              badges={["סיפור משפחתי", "אנגליה", "לונדון"]}
            />
            <BookPreviewCard
              href="/test"
              imageSrc="https://d-steimatzky.co.il/wp-content/uploads/2024/08/5-7029-695-300x466.jpg"
              title="שקרים גדולים בעיירה קטנה"
              writer="דיאן צ׳מברליין"
              badges={["דרום ארה״ב", "גזענות", "עיירה קטנה"]}
            />
          </div>
        </div>
    );
}