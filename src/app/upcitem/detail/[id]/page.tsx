import {
  notFound,
} from "next/navigation";
import {
  getUPCItem,
} from "@/lib/upcitem-database";

type UPCItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const instant = false;

const UPCItemDetailPage = async ({
  params,
}: UPCItemDetailPageProps) => {
  const { id: idParameter } = await params;
  const id = Number(idParameter);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const item = getUPCItem(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">
        {item.title || "Untitled item"}
      </h1>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="overflow-hidden rounded-lg border border-zinc-300 bg-zinc-50">
          {item.imageUrl ? (
            // External provider image hosts are dynamic, so Next.js remote image configuration is not assumed.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title || "UPC item"}
              className="aspect-square w-full object-contain"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-zinc-500">
              No image
            </div>
          )}
        </div>
        <dl className="grid gap-4">
          <div>
            <dt className="font-medium">Barcode</dt>
            <dd>{item.barcode}</dd>
          </div>
          <div>
            <dt className="font-medium">Brand</dt>
            <dd>{item.brand || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium">Category</dt>
            <dd>{item.category || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium">Model</dt>
            <dd>{item.model || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium">Description</dt>
            <dd>{item.description || "-"}</dd>
          </div>
        </dl>
      </div>
      <a
        href="/upcitem"
        className="mt-6 inline-block rounded border px-4 py-2"
      >
        Back to UPC items
      </a>
    </main>
  );
};

export default UPCItemDetailPage;
