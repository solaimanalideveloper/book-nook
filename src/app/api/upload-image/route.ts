import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE = 32 * 1024 * 1024;

type ImgBBResponse = {
  success?: boolean;
  data?: {
    url?: string;
  };
  error?: {
    message?: string;
  };
};

function isImgBBResponse(value: unknown): value is ImgBBResponse {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Please log in to upload a book cover." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Image uploads are not configured. Set IMGBB_API_KEY on the server." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the image upload." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0 || !image.type.startsWith("image/")) {
    return Response.json(
      { error: "Please upload a valid image file." },
      { status: 400 },
    );
  }

  if (image.size > MAX_IMAGE_SIZE) {
    return Response.json(
      { error: "The image must be 32 MB or smaller." },
      { status: 413 },
    );
  }

  const uploadData = new FormData();
  uploadData.set("image", image, image.name);

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );
  } catch (error) {
    console.error("Could not reach the image upload provider:", error);
    return Response.json(
      { error: "Could not reach the image upload provider. Please try again." },
      { status: 502 },
    );
  }

  let result: unknown;
  try {
    result = await uploadResponse.json();
  } catch (error) {
    console.error("The image upload provider returned invalid JSON:", error);
    return Response.json(
      { error: "The image upload provider returned an invalid response." },
      { status: 502 },
    );
  }

  if (!isImgBBResponse(result)) {
    return Response.json(
      { error: "The image upload provider returned an invalid response." },
      { status: 502 },
    );
  }

  const imageUrl = result.data?.url;
  if (!uploadResponse.ok || !result.success || !imageUrl) {
    return Response.json(
      {
        error:
          result.error?.message ||
          `Image upload failed (HTTP ${uploadResponse.status}).`,
      },
      { status: 502 },
    );
  }

  return Response.json({ imageUrl });
}
