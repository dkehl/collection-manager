import Link from "next/link";

type UPCItemTileProps = {
  id: number;
  title: string;
  imageUrl: string;
};

const UPCItemTile = ({
  id,
  title,
  imageUrl,
}: UPCItemTileProps) => {
  return (
    <Link
      href={`/upcitem/detail/${id}`}
      className="block overflow-hidden rounded-lg border border-zinc-300 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-zinc-100">
        {imageUrl ? (
          // External provider image hosts are dynamic, so Next.js remote image configuration is not assumed.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No image
          </div>
        )}
      </div>
      <h2 className="px-4 py-3 font-medium">{title || "Untitled item"}</h2>
    </Link>
  );
};

export { UPCItemTile };
