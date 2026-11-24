import {
  mkdirSync,
} from "node:fs";
import {
  join,
} from "node:path";
import {
  DatabaseSync,
} from "node:sqlite";
import {
  z,
} from "zod";

export type UPCItemRecord = {
  id: number;
  barcode: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  model: string;
  imageUrl: string;
};

export type UPCItemInput = Omit<UPCItemRecord, "id">;

const UPCItemInputSchema = z.object({
  barcode: z.string().regex(/^\d{12}$|^\d{13}$/),
  title: z.string(),
  description: z.string(),
  brand: z.string(),
  category: z.string(),
  model: z.string(),
  imageUrl: z.string(),
});

const DATABASE_DIRECTORY = join(process.cwd(), "databases");
const DATABASE_PATH = join(DATABASE_DIRECTORY, "upcitem.sqlite");

const createUPCItemDatabase = () => {
  mkdirSync(DATABASE_DIRECTORY, {
    recursive: true,
  });

  const database = new DatabaseSync(DATABASE_PATH);

  database.exec(`
    CREATE TABLE IF NOT EXISTS upc_items (
      id INTEGER PRIMARY KEY,
      barcode TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      brand TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      model TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT ''
    )
  `);

  return database;
};

const upcItemDatabase = createUPCItemDatabase();

const insertUPCItem = (input: UPCItemInput) => {
  const parsedInput = UPCItemInputSchema.parse(input);
  const statement = upcItemDatabase.prepare(`
    INSERT INTO upc_items (
      barcode,
      title,
      description,
      brand,
      category,
      model,
      image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = statement.run(
      parsedInput.barcode,
      parsedInput.title,
      parsedInput.description,
      parsedInput.brand,
      parsedInput.category,
      parsedInput.model,
      parsedInput.imageUrl,
    );

    return {
      ok: true as const,
      id: Number(result.lastInsertRowid),
    };
  } catch (error) {
    if (
      error instanceof Error
      && error.message.includes("UNIQUE constraint failed")
    ) {
      return {
        ok: false as const,
        message: "An item with this barcode already exists.",
      };
    }

    throw error;
  }
};

const listUPCItems = (): UPCItemRecord[] => {
  const statement = upcItemDatabase.prepare(`
    SELECT
      id,
      barcode,
      title,
      description,
      brand,
      category,
      model,
      image_url AS imageUrl
    FROM upc_items
    ORDER BY id DESC
  `);

  return statement.all() as UPCItemRecord[];
};

const getUPCItem = (id: number): UPCItemRecord | null => {
  const statement = upcItemDatabase.prepare(`
    SELECT
      id,
      barcode,
      title,
      description,
      brand,
      category,
      model,
      image_url AS imageUrl
    FROM upc_items
    WHERE id = ?
  `);
  const item = statement.get(id);

  return item as UPCItemRecord | null;
};

export {
  UPCItemInputSchema,
  getUPCItem,
  insertUPCItem,
  listUPCItems,
};
