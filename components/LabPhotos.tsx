import { photos } from './design-lab/options';

/* Renders every alternative hero photo; CSS shows the one picked in the Design Lab (html[data-image]).
   Pass the class of the default image so a variant takes exactly its place. */
export function LabPhotos({ className }: { className?: string }) {
  return (
    <>
      {photos
        .filter((photo) => photo.base)
        .map((photo) => (
          <img
            key={photo.id}
            className={className}
            data-photo={photo.id}
            src={`${photo.base}-800.webp`}
            srcSet={[400, 800, 1400].map((w) => `${photo.base}-${w}.webp ${w}w`).join(', ')}
            sizes="100vw"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
    </>
  );
}
