export type FileCategory = "image" | "pdf" | "video" | "audio" | "other";

export interface DroppedFile {
  id: string;
  file: File;
}

export function getFileCategory(file: File): FileCategory {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createDroppedFile(file: File): DroppedFile {
  return {
    id: crypto.randomUUID(),
    file,
  };
}

export const FILE_INPUT_ACCEPT =
  "image/*,.pdf,.doc,.docx,.txt,.zip,.mp4,.mp3,.wav,.webm,.png,.jpg,.jpeg,.gif,.webp,.svg";
