"use client";

import {
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from "html5-qrcode";
import {
  useEffect,
  useState,
} from "react";
import { ImageUrlField } from "@/lib/ui/image-url-field";

type UPCItemRecord = {
  barcode: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  model: string;
  imageUrl: string;
};

const EMPTY_RECORD: UPCItemRecord = {
  barcode: "",
  title: "",
  description: "",
  brand: "",
  category: "",
  model: "",
  imageUrl: "",
};

const createEmptyRecord = (barcode = "") => ({
  ...EMPTY_RECORD,
  barcode,
});

const UPCItemAddForm = () => {
  const [record, setRecord] = useState<UPCItemRecord>(
    createEmptyRecord(),
  );
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      {
        fps: 10,
        qrbox: {
          width: 320,
          height: 180,
        },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.EAN_13,
        ],
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          Html5QrcodeScanType.SCAN_TYPE_FILE,
        ],
      },
      false,
    );

    scanner.render(
      (decodedBarcode) => {
        setRecord(createEmptyRecord(decodedBarcode));
        setMessage(`Barcode detected: ${decodedBarcode}`);
      },
      () => undefined,
    );

    return () => {
      void scanner.clear();
    };
  }, []);

  const handleBarcodeChange = (
    field: "barcode",
    value: string,
  ) => {
    setRecord((currentRecord) => ({
      ...currentRecord,
      [field]: value,
    }));
  };

  const handleRecordChange = (
    field: Exclude<keyof UPCItemRecord, "barcode">,
    value: string,
  ) => {
    setRecord((currentRecord) => ({
      ...currentRecord,
      [field]: value,
    }));
  };

  const lookupBarcode = async () => {
    setIsLookingUp(true);
    setMessage("");

    try {
      const response = await fetch("/upcitem/lookup/api", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          barcode: record.barcode,
        }),
      });
      const payload = await response.json() as {
        record?: UPCItemRecord;
        message?: string;
      };

      if (!response.ok) {
        setMessage(payload.message ?? "UPCItemDB lookup failed.");
        return;
      }

      if (payload.record) {
        setRecord(payload.record);
        setMessage("Lookup complete. Review and edit the record.");
      }
    } catch {
      setMessage("UPCItemDB lookup could not be reached.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const persistItem = async () => {
    setMessage("");

    try {
      const response = await fetch("/upcitem/api", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(record),
      });
      const payload = await response.json() as {
        message?: string;
      };

      setMessage(
        payload.message
          ?? (response.ok
            ? "UPC item saved."
            : "UPC item could not be saved."),
      );
    } catch {
      setMessage("UPC item could not be saved.");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Capture barcode</h2>
        <div
          id="barcode-reader"
          className="min-h-48 max-w-xl rounded border border-zinc-300"
        />
      </section>

      <section className="space-y-3">
        <label className="block">
          <span className="mb-1 block font-medium">Barcode</span>
          <input
            type="text"
            inputMode="numeric"
            value={record.barcode}
            onChange={(event) => handleBarcodeChange(
              "barcode",
              event.target.value,
            )}
            className="w-full max-w-md rounded border px-3 py-2"
          />
        </label>
        <button
          type="button"
          disabled={isLookingUp}
          onClick={() => void lookupBarcode()}
          className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {isLookingUp ? "Looking up..." : "Lookup barcode"}
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-medium">Title</span>
          <input
            type="text"
            value={record.title}
            onChange={(event) => handleRecordChange(
              "title",
              event.target.value,
            )}
            className="w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Brand</span>
          <input
            type="text"
            value={record.brand}
            onChange={(event) => handleRecordChange(
              "brand",
              event.target.value,
            )}
            className="w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Category</span>
          <input
            type="text"
            value={record.category}
            onChange={(event) => handleRecordChange(
              "category",
              event.target.value,
            )}
            className="w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-medium">Model</span>
          <input
            type="text"
            value={record.model}
            onChange={(event) => handleRecordChange(
              "model",
              event.target.value,
            )}
            className="w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block font-medium">Description</span>
          <textarea
            value={record.description}
            onChange={(event) => handleRecordChange(
              "description",
              event.target.value,
            )}
            className="min-h-24 w-full rounded border px-3 py-2"
          />
        </label>
        <ImageUrlField
          imageUrl={record.imageUrl}
          onImageUrlChange={(imageUrl) => handleRecordChange(
            "imageUrl",
            imageUrl,
          )}
        />
      </section>

      {message && (
        <p role="status" className="rounded border px-4 py-3">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={() => void persistItem()}
        className="rounded bg-green-700 px-4 py-2 text-white"
      >
        Save item
      </button>
    </div>
  );
};

export { UPCItemAddForm };
