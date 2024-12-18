import Link from "next/link";
import Image from "next/image";
interface BookPreviewHeroProps {
    href: string;
    imageSrc: string;
    title: string;
    writer: string;
    badges: string[];
    des: string;
  }

export default function BookPreviewHero({
  href,
  imageSrc,
  title,
  writer,
  badges,
  des,
}: BookPreviewHeroProps) {
  return (
    <div className="hero" dir="rtl">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${imageSrc})`,
          WebkitMaskImage:
            "-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.8)), to(rgba(0,0,0,0)))",
          backgroundPosition: "0% 25%",
          backgroundSize: "cover",
          filter: "blur(8px) brightness(100%) saturate(100%)",
          transform: "scale(1.0)",
          zIndex: "-10",
          overflow: "hidden",
        }}
      ></div>
      <div className="hero-content text-neutral-content flex flex-col sm:flex-row items-center mb-20 mt-10 bg-opacity-50 bg-base-100 rounded-lg sm:mr-8 sm:ml-8">
        {/* Left Section - Image */}
        <div className="sm:w-1/5 mb-5 sm:mb-0 sm:h-auto flex w-1/2 justify-center sm:justify-start">
          <Image
          alt={title}
          src={imageSrc}
          width={300}
          height={464}
          className="justify-self-center rounded-lg shadow-lg aspect-[3/4]"
        />
        </div>

        {/* Right Section - Title, Description, Badges */}
        <Link
          className="w-full sm:w-3/4 sm:text-left px-5 flex flex-col items-middle sm:items-start"
          href={href}
        >
          <h1 className="text-5xl font-bold mb-2 text-base-content">{title}</h1>
          <h1 className="text-lg font-bold mb-2 text-base-content">{writer}</h1>
          {/* Badges Section */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            {badges.map((badge: string, index: number) => (
              <span key={index} className="badge badge-secondary">
                {badge}
              </span>
            ))}
          </div>

          <p className="mb-1 sm:block hidden font-medium text-base-content text-wrap text-right">
            {des}
          </p>
        </Link>
      </div>
    </div>
  );
}