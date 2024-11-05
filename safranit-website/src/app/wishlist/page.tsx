import BookPreviewCard from "@/components/BookPreviewCard";
import MainDrawer from "@/components/MainDrawer";
import Link from "next/link";

export default function Home() {
    return (
      <MainDrawer>
        <div className="max-w-screen-lg w-full mx-auto flex flex-col items-center">
          <div className="flex w-full items-start justify-start p-2">
            <h2 className="font-bold text-xl p-2">Your Wishlist:</h2>
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
      </MainDrawer>
    );
}