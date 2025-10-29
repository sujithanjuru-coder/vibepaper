
export interface GeneratedImage {
  id: string;
  url: string; // base64 data URL
}

export type AspectRatio = "9:16" | "16:9" | "3:4" | "4:3" | "1:1";

export const aspectRatios: AspectRatio[] = ["9:16", "16:9", "3:4", "4:3", "1:1"];
