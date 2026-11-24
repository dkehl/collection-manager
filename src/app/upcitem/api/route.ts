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
    const detail = parsedInput.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    return NextResponse.json(
      {
        message: "The UPC item data is invalid.",
        detail,
      },
      { status: 400 },
    );
  }

  const result = insertUPCItem(parsedInput.data);

  if (!result.ok) {
    return NextResponse.json(
      {
        message: result.message,
        detail: result.detail,
      },
      { status: result.message.includes("already exists") ? 409 : 500 },
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
