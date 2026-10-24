import Image from "next/image";
import { cn } from "@/lib/utils";

type CatalogImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Fills its (relatively positioned) parent. SVG placeholders skip the optimizer. */
export function CatalogImage({ src, alt, sizes, priority, className }: CatalogImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("object-cover", className)}
    />
  );
}
