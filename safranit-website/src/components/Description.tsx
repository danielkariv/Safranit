"use client";

import { useState } from "react";

export default function Description({ des }: { des: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className={`py-6 ${isExpanded ? "" : "line-clamp-3"}`} dir="rtl">
        {des}
      </div>
      <button className="text-blue-500 underline mt-2" onClick={toggleExpand}>
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
