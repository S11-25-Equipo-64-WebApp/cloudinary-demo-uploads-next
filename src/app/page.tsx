"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <CldUploadWidget signatureEndpoint="api/sign">
        {({ open }) => {
          return (
            <button
              className="w-50 h-20 bg-amber-100 text-black rounded-2xl"
              onClick={() => open()}
            >
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
