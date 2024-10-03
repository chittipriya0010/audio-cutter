export type AudioFile = File;

export interface AudioProcessingOptions {
  startTime: number;
  endTime: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  outputFormat: string;
}