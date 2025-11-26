export interface PhotoData {
  id: number;
  url: string;
}

export enum ViewState {
  MOSAIC = 'MOSAIC',
  FOCUSED = 'FOCUSED'
}

export interface CelebrationMessage {
  text: string;
  isGenerating: boolean;
}