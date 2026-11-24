"use client";

import { useState } from "react";

type ImageUrlFieldProps = {
  imageUrl: string;
  onImageUrlChange: (imageUrl: string) => void;
};

const ImageUrlField = ({
  imageUrl,
  onImageUrlChange,
}: ImageUrlFieldProps) => {
  const [failedImageUrl, setFailedImageUrl] = useState("");

  return (
    <div className="space-y-3 sm:col-span-2">
      <label className="block">
        <span className="mb-1 block font-medium">Image URL</span>
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => onImageUrlChange(event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </label>
      {imageUrl && failedImageUrl !== imageUrl ? (
        <div className="overflow-hidden rounded border border-zinc-300 bg-zinc-50">
          {/* External provider image hosts are dynamic, so Next.js remote image configuration is not assumed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-80 w-full object-contain"
            onError={() => setFailedImageUrl(imageUrl)}
          />
        </div>
      ) : (
        imageUrl && (
          <p className="text-sm text-zinc-600">
            Image preview unavailable.
          </p>
        )
      )}
    </div>
  );
};

export { ImageUrlField };
