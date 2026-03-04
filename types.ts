export enum BrainRegion {
  FRONTAL = 'Frontal Lobe',
  TEMPORAL = 'Temporal Lobe',
  PARIETAL = 'Parietal Lobe',
  OCCIPITAL = 'Occipital Lobe',
  CEREBELLUM = 'Cerebellum',
  BRAIN_STEM = 'Brain Stem',
  PATHWAYS = 'Neural Pathways',
  GENERAL = 'General Wisdom'
}

export interface WordData {
  id: string;
  text: string;
  region: BrainRegion;
  position: [number, number, number];
  rotation: [number, number, number];
  isHighlight: boolean;
  insight: string; // Detail text for modal
}

export interface BrainState {
  isHovered: boolean;
  activeWord: WordData | null;
}