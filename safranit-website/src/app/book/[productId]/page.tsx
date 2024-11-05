"use client";
import MainDrawer from "@/components/MainDrawer";
import { useState } from "react";

export default function Home() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Toggle expand state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Book details
    const bookDetails = {
        image: "https://d-steimatzky.co.il/wp-content/uploads/2024/08/1572-533019-300x468.jpg",
        title: "המלך הרועה 1: חלון אחד חשוך",
        writer: "רייצ'ל גיליג",
        tags: ["פנטזיה אפית", "חלומות", "גותיקה"],
        description: (
            <>
                <p>
                    אלספת ספינדל לא יכולה להרשות לעצמה לחשוב על אהבה. היא צריכה
                    לשרוד בממלכה אפופת הערפל שבה היא גרה, ולשם כך היא זקוקה למפלצת
                    – לסיוט: רוח עתיקה ומסתורית הכלואה בתוך ראשה ומגינה עליה ועל
                    סודותיה.
                </p>
                <p>
                    כאשר אלספת פוגשת את רייבן, חייה מקבלים תפנית חדה. היא נכנסת אל
                    תוך עולם של צללים ורמייה ומצטרפת למסע מסוכן, במטרה לרפא את
                    הממלכה מהקסם האפל שאוחז בה. אלא שככל שמסעם מתקדם, הסיכון גדל
                    והמשיכה הבלתי ניתנת להכחשה בינה ובין רייבן מתעצמת. אלספת נאלצת
                    להתמודד עם העובדה שאין דבר שניתן בלי תמורה, במיוחד קסם. הסיוט
                    הולך ומשתלט עליה, ואולי היא לא תוכל לעצור אותו.
                </p>
                <p>
                    <strong>חלון אחד חשוך</strong> הוא הספר הראשון בדואט המלך
                    הרועה של <strong>רייצ’ל גיליג</strong>, שכבש את צמרת טבלת
                    רבי־המכר של <strong>הניו יורק טיימס</strong> והפך לסנסציית{" "}
                    <strong>BOOKTOK</strong>.
                </p>
                <p>
                    <strong>&nbsp;</strong>
                </p>
                <p>
                    <strong>&nbsp;</strong>
                </p>
                <p>
                    <strong>שני כתרים מפותלים</strong>
                </p>
                <p>
                    <strong>מסע רווי סכנות,</strong>
                    <strong>
                        <br />
                    </strong>
                    <strong>שלושה סיפורי אהבה,</strong>
                    <strong>
                        <br />
                    </strong>
                    <strong>נפש חצויה לשניים,</strong>
                    <strong>
                        <br />
                    </strong>
                    <strong>סיוט אחד.</strong>
                </p>
                <p>
                    היחיד שיכול להביא את המסע להצלת הממלכה לסיומו המוצלח הוא
                    הסיוט, המפלצת שחולקת עם אלספת את גופה ואת נפשה. אבל כזכור, אין
                    דבר שניתן בלי תמורה, ולא בטוח שאלספת ורייבן יוכלו לעמוד במחיר
                    שהסיוט תובע מהם.
                </p>
                <p>
                    <strong>שני כתרים מפותלים</strong> חותם את דואט{" "}
                    <strong>המלך הרועה</strong> של <strong>רייצ’ל גיליג</strong>{" "}
                    בסיום מותח ומחמם לב.
                </p>
            </>
        ),
        storeLinks: {
            steimatzky: "https://d-steimatzky.co.il/product/%d7%94%d7%9E%d7%9c%d7%9a-%d7%94%d7%a8%d7%95%d7%a2%d7%94-1-%d7%97%d7%9c%d7%95%d7%9f-%d7%90%d7%97%d7%93-%d7%97%d7%a9%d7%95%d7%9a/",
            booknet: "https://www.booknet.co.il/%D7%9E%D7%95%D7%A6%D7%A8%D7%99%D7%9D/%D7%97%D7%9C%D7%95%D7%9F-%D7%90%D7%97%D7%93-%D7%97%D7%A9%D7%95%D7%9A--%D7%94%D7%9E%D7%9C%D7%9A-%D7%94%D7%A8%D7%95%D7%A2%D7%94-1-157205330194",
        }
    };

    return (
        <MainDrawer>
            <div className="hero bg-base-200 min-h-screen">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url(${bookDetails.image})`,
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
                <div className="hero-content text-center">
                    <div
                        className="max-w-2xl mx-auto text-right shadow-lg sm:p-10 p-2 bg-opacity-50 bg-base-100"
                        dir="rtl"
                    >
                        <h1 className="text-5xl font-bold">{bookDetails.title}</h1>
                        <p className="text-xl mt-2">{bookDetails.writer}</p>

                        <div className="mt-4 flex justify-center gap-2">
                            {/* Tags */}
                            {bookDetails.tags.map((tag, index) => (
                                <span key={index} className={`badge badge-${index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/* Description */}
                        <div className={`py-6 ${isExpanded ? "" : "line-clamp-3"}`} dir="rtl">
                            {bookDetails.description}
                        </div>
                        <button
                            className="text-blue-500 underline mt-2"
                            onClick={toggleExpand}
                        >
                            {isExpanded ? "Show Less" : "Read More"}
                        </button>
                        {/* Store Buttons */}
                        <div className="flex justify-center gap-2 mt-4">
                            <a
                                href={bookDetails.storeLinks.steimatzky}
                                className="btn btn-outline btn-primary"
                            >
                                סטימצקי
                            </a>
                            <a
                                href={bookDetails.storeLinks.booknet}
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
        </MainDrawer>
    );
}
