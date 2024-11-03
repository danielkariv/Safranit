import Link from 'next/link'
import MainDrawer from '../components/MainDrawer';
import BookPreviewCard from '../components/BookPreviewCard';
import BookPreviewHero from '../components/BookPreviewHero';

export default function Home() {
  return (
    <div>
      <MainDrawer>
        <div className="flex flex-grow p-0">
          <div className="w-full content-start flex flex-wrap justify-center gap-6">
            <div className="flex w-full flex-col">
              {/* Hero, featured book on front page  */}
              <BookPreviewHero href="/test"
                    imageSrc="https://d-steimatzky.co.il/wp-content/uploads/2024/08/5-7029-695-300x466.jpg"
                    title="המלך הרועה 1: חלון אחד חשוך"
                    writer="רייצ׳ל גיליג"
                    badges={["פנטזיה אפית", "חלומות", "גותיקה"]}
                    des="אלספת ספינדל לא יכולה להרשות לעצמה לחשוב על אהבה. היא צריכה לשרוד בממלכה אפופת הערפל שבה היא גרה, ולשם כך היא זקוקה למפלצת – לסיוט: רוח עתיקה ומסתורית הכלואה בתוך ראשה ומגינה עליה ועל סודותיה.

כאשר אלספת פוגשת את רייבן, חייה מקבלים תפנית חדה. היא נכנסת אל תוך עולם של צללים ורמייה ומצטרפת למסע מסוכן, במטרה לרפא את הממלכה מהקסם האפל שאוחז בה. אלא שככל שמסעם מתקדם, הסיכון גדל והמשיכה הבלתי ניתנת להכחשה בינה ובין רייבן מתעצמת. אלספת נאלצת להתמודד עם העובדה שאין דבר שניתן בלי תמורה, במיוחד קסם. הסיוט הולך ומשתלט עליה, ואולי היא לא תוכל לעצור אותו.

חלון אחד חשוך הוא הספר הראשון בדואט המלך הרועה של רייצ’ל גיליג, שכבש את צמרת טבלת רבי־המכר של הניו יורק טיימס והפך לסנסציית BOOKTOK." />
              <div className="divider" />
              <div>
                <div className="flex w-full flex-row items-center justify-between p-2">
                  <h2 className="font-bold text-2xl p-2">Your Wishlist:</h2>
                  <Link href="/wishlist" className="btn btn-ghost btn-md">
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
            </div>
          </div>
        </div>
      </MainDrawer>
    </div>
  );
}
