import Link from 'next/link';

interface BookPreviewCardProps {
  href: string;
  imageSrc: string;
  title: string;
  writer: string;
  badges: string[];
}

export default function BookPreviewCard ({ href, imageSrc, title, writer, badges }:BookPreviewCardProps) {
  return (
    <Link href={href} passHref className='w-full'  dir="rtl">
      <div className="flex items-center mb-1 p-1 w-full bg-base-100 shadow-lg rounded-sm hover:bg-base-200 transition-colors cursor-pointer">
        {/* Picture on the left */}
        <img
          src={imageSrc}
          alt={title}
          className="h-20 rounded-lg object-cover mr-4"
        />

        {/* Right section */}
        <div className="flex-1 p-4">
          {/* Title */}
          <h2 className="text-xl font-bold">{title}</h2>

          {/* Writer */}
          <p className="text-sm text-gray-600 mb-2">{writer}</p>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-start">
            {badges.map((badge: string, index: number) => (
              <span key={index} className="badge badge-secondary badge-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
