import Link from 'next/link';
import Image from 'next/image';
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
        <Image
          src={imageSrc}
          width={300}
          height={464}
          alt={title}
          className="aspect-[3/4] rounded-lg mr-4 sm:w-24 w-16"
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
              <span key={index} className="badge badge-secondary badge-sm truncate">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
