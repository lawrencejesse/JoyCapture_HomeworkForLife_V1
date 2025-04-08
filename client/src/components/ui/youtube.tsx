import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YouTubeProps {
  videoId: string;
  title: string;
}

export function YouTube({ videoId, title }: YouTubeProps) {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full object-cover"
      ></iframe>
    </AspectRatio>
  );
}
