import { UPCItemAddForm } from "./upc-item-add-form";

const UPCItemAddPage = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Add UPC or EAN item</h1>
      <UPCItemAddForm />
    </main>
  );
};

export default UPCItemAddPage;
