import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Missing Cloudinary env vars. Check your .env files.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

type SignPayload = {
  paramsToSign?: Record<string, string | number | boolean | undefined>;
};

export async function POST(request: Request) {
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary env vars are not set" },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as SignPayload | null;
  const paramsToSign = body?.paramsToSign ?? {};

  // Ensure timestamp and folder are present before signing.
  const uploadParams = {
    ...paramsToSign,
    timestamp:
      typeof paramsToSign.timestamp === "number"
        ? paramsToSign.timestamp
        : Math.round(Date.now() / 1000),
    ...(defaultFolder && { folder: paramsToSign.folder ?? defaultFolder }),
  };

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    apiSecret,
  );

  return NextResponse.json({
    signature,
    timestamp: uploadParams.timestamp,
  });
}

