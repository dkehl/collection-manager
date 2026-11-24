import Link from "next/link";

const Home = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Collection Manager</h1>
      <nav className="mt-6 flex flex-wrap gap-3" aria-label="UPC item actions">
        <Link
          href="/upcitem"
          className="rounded border px-4 py-2"
        >
          View UPC items
        </Link>
        <Link
          href="/upcitem/add"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add UPC item
        </Link>
      </nav>
    </main>
  );
};

export default Home;
