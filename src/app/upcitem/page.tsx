import {
  listUPCItems,
} from "@/lib/upcitem-database";
import {
  UPCItemTile,
} from "@/lib/ui/upc-item-tile";

export const instant = false;

const UPCItemsPage = async () => {
  const items = listUPCItems();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">UPC items</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <UPCItemTile
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-600">No UPC items have been saved.</p>
      )}
    </main>
  );
};

export default UPCItemsPage;
