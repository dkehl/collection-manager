import {
  NextResponse,
} from "next/server";
import {
  UPCItemInputSchema,
  insertUPCItem,
  listUPCItems,
} from "@/lib/upcitem-database";

export const POST = async (request: Request) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The item request is invalid." },
      { status: 400 },
    );
  }

  const parsedInput = UPCItemInputSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      { message: "The UPC item data is invalid." },
      { status: 400 },
    );
  }

  const result = insertUPCItem(parsedInput.data);

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      id: result.id,
      message: "UPC item saved.",
    },
    { status: 201 },
  );
};

export const GET = () => {
  return NextResponse.json({
    items: listUPCItems(),
  });
};
