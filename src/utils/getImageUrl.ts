export const getImageUrl = (url: string | null | undefined): string => {
  const imageUrl = url?.trim();

  if (!imageUrl) return "/images/no-image.png";
  if (imageUrl.startsWith("http") || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
  const normalizedUrl = imageUrl.replace(/^\/api\/v1\//, "/").replace(/^api\/v1\//, "");

  if (normalizedUrl.startsWith("/uploads/")) {
    return `${baseUrl}${normalizedUrl}`;
  }

  if (normalizedUrl.startsWith("uploads/")) {
    return `${baseUrl}/${normalizedUrl}`;
  }

  if (normalizedUrl.startsWith("/")) {
    return normalizedUrl;
  }

  return `${baseUrl}/uploads/${normalizedUrl}`;
};
