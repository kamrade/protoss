export function decodeNoteText(encoded?: string | null): string {
  if (!encoded) {
    return "";
  }

  try {
    if (typeof window === "undefined") {
      return Buffer.from(encoded, "base64").toString("utf-8");
    }

    const binary = window.atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return encoded;
  }
}