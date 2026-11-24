import { NextResponse } from "next/server";

type LookupRequest = {
  barcode: string;
};

type UPCItemDBItem = {
  title?: unknown;
  description?: unknown;
  brand?: unknown;
  category?: unknown;
  model?: unknown;
  upc?: unknown;
  ean?: unknown;
  asin?: unknown;
  elid?: unknown;
  images?: unknown;
};

type UPCItemDBResponse = {
  code?: unknown;
  total?: unknown;
  items?: unknown;
};

export type UPCItemLookupRecord = {
  barcode: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  model: string;
  imageUrl: string;
};

const normalizeString = (value: unknown) => (
  typeof value === "string" ? value.trim() : ""
);

const normalizeBarcode = (barcode: string) => {
  const trimmedBarcode = barcode.trim();

  if (!/^\d{12}$|^\d{13}$/.test(trimmedBarcode)) {
    return null;
  }

  return trimmedBarcode;
};

const normalizeLookupRecord = (
  barcode: string,
  payload: UPCItemDBResponse,
) => {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const item = items.find((candidate) => (
    typeof candidate === "object"
    && candidate !== null
  )) as UPCItemDBItem | undefined;

  if (!item) {
    return {
      barcode,
      title: "",
      description: "",
      brand: "",
      category: "",
      model: "",
      imageUrl: "",
    };
  }

  const images = Array.isArray(item.images)
    ? item.images.filter((image) => typeof image === "string")
    : [];

  return {
    barcode,
    title: normalizeString(item.title),
    description: normalizeString(item.description),
    brand: normalizeString(item.brand),
    category: normalizeString(item.category),
    model: normalizeString(item.model),
    imageUrl: normalizeString(images[0]),
  };
};

const parseLookupRequest = async (request: Request) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return null;
  }

  if (typeof body !== "object" || body === null) {
    return null;
  }

  const barcode = normalizeBarcode(
    normalizeString((body as LookupRequest).barcode),
  );

  return barcode;
};

const lookupUPCItem = async (barcode: string) => {
  const lookupUrl = new URL(
    process.env.UPCITEMDB_API_URL
      ?? "https://api.upcitemdb.com/prod/trial/lookup",
  );
  lookupUrl.searchParams.set("upc", barcode);

  const timeoutValue = Number(
    process.env.UPCITEMDB_REQUEST_TIMEOUT_MS ?? "10000",
  );
  const timeoutMilliseconds = Number.isFinite(timeoutValue)
    ? timeoutValue
    : 10000;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMilliseconds,
  );
  const headers: HeadersInit = {
    accept: "application/json",
  };
  const apiKey = process.env.UPCITEMDB_API_KEY?.trim();

  if (apiKey) {
    headers["user_key"] = apiKey;
  }

  try {
    const response = await fetch(lookupUrl, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false as const,
        status: response.status,
        message: "UPCItemDB lookup failed.",
      };
    }

    const payload = await response.json() as UPCItemDBResponse;

    return {
      ok: true as const,
      record: normalizeLookupRecord(barcode, payload),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false as const,
        status: 504,
        message: "UPCItemDB lookup timed out.",
      };
    }

    return {
      ok: false as const,
      status: 502,
      message: "UPCItemDB could not be reached.",
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const POST = async (request: Request) => {
  const barcode = await parseLookupRequest(request);

  if (!barcode) {
    return NextResponse.json(
      { message: "Enter a valid 12-digit UPC-A or 13-digit EAN-13 barcode." },
      { status: 400 },
    );
  }

  const lookupResult = await lookupUPCItem(barcode);

  if (!lookupResult.ok) {
    return NextResponse.json(
      { message: lookupResult.message },
      { status: lookupResult.status },
    );
  }

  return NextResponse.json({ record: lookupResult.record });
};
