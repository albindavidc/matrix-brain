import { BrainRegion, WordData } from './types';
import * as THREE from 'three';

// Constants for brain geometry
const SCALE = 1.0;

// Helper to generate a position within a volume roughly corresponding to a brain lobe
// Uses two hemispheres logic
const getRegionPosition = (region: BrainRegion, index: number, total: number): [number, number, number] => {
  const isLeft = index % 2 === 0;
  const xHemisphereOffset = isLeft ? -0.5 : 0.5; // Separate the two hemispheres
  
  // Normalized vector for direction
  let x = 0, y = 0, z = 0;
  
  // Random spread helpers
  const r = () => Math.random();
  const rs = () => Math.random() - 0.5;

  switch (region) {
    case BrainRegion.FRONTAL: 
      // Front (Positive Z), Top-ish (Positive Y)
      x = (isLeft ? -1 : 1) * (0.2 + r() * 0.4);
      y = 0.2 + r() * 0.8;
      z = 0.5 + r() * 1.0; 
      break;

    case BrainRegion.PARIETAL: 
      // Top (Positive Y), Back-ish (Negative Z)
      x = (isLeft ? -1 : 1) * (0.3 + r() * 0.4);
      y = 0.6 + r() * 0.6;
      z = -0.5 + rs() * 0.8;
      break;

    case BrainRegion.TEMPORAL: 
      // Sides (High X magnitude), Lower Y, Mid Z
      x = (isLeft ? -1 : 1) * (0.7 + r() * 0.4);
      y = -0.5 + r() * 0.6;
      z = 0.2 + rs() * 1.0;
      break;

    case BrainRegion.OCCIPITAL: 
      // Far Back (Negative Z)
      x = (isLeft ? -1 : 1) * (0.2 + r() * 0.4);
      y = 0.1 + r() * 0.5;
      z = -1.5 + rs() * 0.6;
      break;

    case BrainRegion.CEREBELLUM: 
      // Bottom Back (Negative Y, Negative Z), smaller
      x = (isLeft ? -1 : 1) * (0.2 + r() * 0.3);
      y = -1.0 + r() * 0.4;
      z = -1.2 + rs() * 0.5;
      break;

    case BrainRegion.BRAIN_STEM: 
      // Bottom Center (Negative Y), Central X
      x = rs() * 0.2; // Central
      y = -1.5 + rs() * 0.6;
      z = -0.2 + rs() * 0.4;
      break;

    default: // Pathways/General - Scatter across the cortex surface
      const phi = Math.acos( -1 + ( 2 * index ) / total );
      const theta = Math.sqrt( total * Math.PI ) * phi;
      x = (isLeft ? -1 : 1) * Math.abs(Math.cos(theta) * Math.sin(phi));
      y = Math.sin(theta) * Math.sin(phi);
      z = Math.cos(phi);
      break;
  }

  // Normalize direction to project onto brain surface shape
  const vec = new THREE.Vector3(x, y, z);
  if (region !== BrainRegion.BRAIN_STEM) {
      vec.normalize();
      
      // Apply "Brain Shape" scaling to the sphere (making it an ellipsoid)
      // Brains are longer (Z) and reasonably tall (Y)
      vec.x *= 0.85; // Slightly thinner width per hemisphere
      vec.y *= 1.1;  // Tall height
      vec.z *= 1.3;  // Long length
  }

  // Add hemisphere offset
  if (region !== BrainRegion.BRAIN_STEM) {
    vec.x += xHemisphereOffset;
  }

  // Add some organic surface noise so it's not a perfect smooth shell
  // Gyri and Sulci simulation
  const surfaceNoise = 1.0 + (Math.random() - 0.5) * 0.15;
  vec.multiplyScalar(surfaceNoise);

  // Global Scale
  vec.multiplyScalar(SCALE);

  return [vec.x, vec.y, vec.z];
};

const rawData = [
  // Frontal
  { r: BrainRegion.FRONTAL, t: "TRANSFORM_YOUR_THINKING", i: "Your reality is a mirror of your internal narrative." },
  { r: BrainRegion.FRONTAL, t: "CHANGE_YOUR_REALITY", i: "Perception shapes the physical world." },
  { r: BrainRegion.FRONTAL, t: "PROBLEMS_ARE_FEATURES", i: "Obstacles are merely specifications for a better solution." },
  { r: BrainRegion.FRONTAL, t: "INNOVATIVE_SOLUTIONS", i: "Creativity is intelligence having fun." },
  { r: BrainRegion.FRONTAL, t: "STRATEGIC_TIMING", i: "Patience is a weapon. Strike when the iron is hot." },
  { r: BrainRegion.FRONTAL, t: "MANIFESTATION_POWER", i: "Thoughts become things. Choose good ones." },
  { r: BrainRegion.FRONTAL, t: "CREATE_YOUR_LUCK", i: "Luck is the residue of design." },
  { r: BrainRegion.FRONTAL, t: "PREPARATION_WINS", i: "Victory is won in the planning phase." },
  { r: BrainRegion.FRONTAL, t: "FOCUS_CONCENTRATION", i: "Where focus goes, energy flows." },
  { r: BrainRegion.FRONTAL, t: "PRESENCE_EXCELLENCE", i: "Be here now. Nowhere else exists." },
  { r: BrainRegion.FRONTAL, t: "DECISION_PROTOCOL", i: "Logic dictates, emotion guides." },
  { r: BrainRegion.FRONTAL, t: "EXECUTIVE_FUNCTION", i: "Mastery of self is the ultimate command." },

  // Temporal
  { r: BrainRegion.TEMPORAL, t: "PHOTOGRAPHIC_MEMORY", i: "The mind records everything; the key is retrieval." },
  { r: BrainRegion.TEMPORAL, t: "UNDERSTANDING", i: "Knowledge is knowing. Wisdom is doing." },
  { r: BrainRegion.TEMPORAL, t: "COMPREHENSION", i: "True learning changes behavior." },
  { r: BrainRegion.TEMPORAL, t: "MEMORY_HACKS", i: "Associate the new with the known." },
  { r: BrainRegion.TEMPORAL, t: "MICRO_LEARNING", i: "Sip knowledge daily, do not binge." },
  { r: BrainRegion.TEMPORAL, t: "READ_REMEMBER", i: "Input dictates output." },
  { r: BrainRegion.TEMPORAL, t: "QUESTIONS_ANSWERS", i: "The quality of the question determines the life." },
  { r: BrainRegion.TEMPORAL, t: "LEARN_SMART", i: "Efficiency is the soul of speed." },
  { r: BrainRegion.TEMPORAL, t: "KNOWLEDGE_RETENTION", i: "What you teach, you learn twice." },
  { r: BrainRegion.TEMPORAL, t: "WISDOM_LIBRARY", i: "You are the sum of the books you read." },
  { r: BrainRegion.TEMPORAL, t: "AUDITORY_PROCESSING", i: "Listen to the silence between words." },

  // Parietal
  { r: BrainRegion.PARIETAL, t: "EXPECTATION", i: "Raise your standards to meet your destiny." },
  { r: BrainRegion.PARIETAL, t: "CONFIDENCE", i: "Confidence is the memory of success." },
  { r: BrainRegion.PARIETAL, t: "EMOTIONAL_IQ", i: "Feelings are data, not directives." },
  { r: BrainRegion.PARIETAL, t: "COMPOSURE", i: "Calmness is a superpower." },
  { r: BrainRegion.PARIETAL, t: "AWARENESS_HUB", i: "Notice what others miss." },
  { r: BrainRegion.PARIETAL, t: "FILTER_NOISE", i: "Ignore the trivial to focus on the vital." },
  { r: BrainRegion.PARIETAL, t: "AMPLIFY_PURPOSE", i: "Make your why stronger than your excuses." },
  { r: BrainRegion.PARIETAL, t: "DISCERNMENT", i: "Judgment is the better part of valor." },
  { r: BrainRegion.PARIETAL, t: "MINDFULNESS", i: "The present moment is the only reality." },
  { r: BrainRegion.PARIETAL, t: "CLARITY_ZONE", i: "Clear minds make sharp decisions." },
  { r: BrainRegion.PARIETAL, t: "SPATIAL_SENSE", i: "Navigate your reality with precision." },

  // Occipital
  { r: BrainRegion.OCCIPITAL, t: "REJECTION_REDIRECTION", i: "A 'no' is just a detour to a better 'yes'." },
  { r: BrainRegion.OCCIPITAL, t: "PERSPECTIVE", i: "Change the way you look at things." },
  { r: BrainRegion.OCCIPITAL, t: "ATTITUDE_ALTITUDE", i: "Your outlook determines your outcome." },
  { r: BrainRegion.OCCIPITAL, t: "VISION_MANIFEST", i: "See it clearly to build it effectively." },
  { r: BrainRegion.OCCIPITAL, t: "OPPORTUNITY", i: "Opportunity dances with those already on the floor." },
  { r: BrainRegion.OCCIPITAL, t: "FUTURE_CREATOR", i: "Predict the future by inventing it." },
  { r: BrainRegion.OCCIPITAL, t: "VISUALIZATION", i: "The mind cannot distinguish vivid imagination from reality." },
  { r: BrainRegion.OCCIPITAL, t: "SUCCESS_PATH", i: "Walk the path before it appears." },
  { r: BrainRegion.OCCIPITAL, t: "ACHIEVEMENT", i: "Small wins build big empires." },
  { r: BrainRegion.OCCIPITAL, t: "DREAM_ARCHITECT", i: "Design your life, don't just live it." },
  { r: BrainRegion.OCCIPITAL, t: "PATTERN_RECOGNITION", i: "See the code behind the chaos." },

  // Cerebellum
  { r: BrainRegion.CEREBELLUM, t: "STILLNESS", i: "In the void, everything is possible." },
  { r: BrainRegion.CEREBELLUM, t: "BALANCE", i: "Extremes are easy. Balance is mastery." },
  { r: BrainRegion.CEREBELLUM, t: "ANGER_UNDERSTANDING", i: "Anger is a signal, not a solution." },
  { r: BrainRegion.CEREBELLUM, t: "PRESENCE", i: "Occupy your space fully." },
  { r: BrainRegion.CEREBELLUM, t: "RECONCILIATION", i: "Forgiveness frees the forgiver." },
  { r: BrainRegion.CEREBELLUM, t: "MASTERY", i: "Repetition is the mother of skill." },
  { r: BrainRegion.CEREBELLUM, t: "HARMONY", i: "Flow like water." },
  { r: BrainRegion.CEREBELLUM, t: "EQUILIBRIUM", i: "Center yourself." },
  { r: BrainRegion.CEREBELLUM, t: "CENTERED", i: "The eye of the storm is calm." },
  { r: BrainRegion.CEREBELLUM, t: "PEACEFUL_WARRIOR", i: "Strong enough to fight, wise enough not to." },
  { r: BrainRegion.CEREBELLUM, t: "COORDINATION", i: "Sync mind and body." },

  // Brain Stem
  { r: BrainRegion.BRAIN_STEM, t: "RESILIENCE", i: "Bounce back higher." },
  { r: BrainRegion.BRAIN_STEM, t: "BUMBLEBEE", i: "Impossible is just an opinion." },
  { r: BrainRegion.BRAIN_STEM, t: "DEFY_LIMITS", i: "The only limits are self-imposed." },
  { r: BrainRegion.BRAIN_STEM, t: "ENERGY_FIELDS", i: "We are all connected energy." },
  { r: BrainRegion.BRAIN_STEM, t: "SOURCE_CODE", i: "Tap into the universal operating system." },
  { r: BrainRegion.BRAIN_STEM, t: "FOUNDATION", i: "Build on rock, not sand." },
  { r: BrainRegion.BRAIN_STEM, t: "LIFE_FORCE", i: "Vitality is the currency of life." },
  { r: BrainRegion.BRAIN_STEM, t: "INNER_POWER", i: "The kingdom is within." },
  { r: BrainRegion.BRAIN_STEM, t: "FREQUENCY", i: "Tune into the station you want to hear." },
  { r: BrainRegion.BRAIN_STEM, t: "ALIGNMENT", i: "When you align, you shine." },
];

export const BRAIN_WORDS: WordData[] = rawData.map((item, index) => {
  const pos = getRegionPosition(item.r, index, rawData.length);
  // Calculate lookAt rotation towards center 0,0,0 approximately, but flip it so text faces out
  const rotation: [number, number, number] = [0, 0, 0]; // Will be handled by LookAt in component

  return {
    id: `word-${index}`,
    text: item.t,
    region: item.r,
    position: pos,
    rotation: rotation,
    isHighlight: Math.random() > 0.8, // 20% start slightly brighter
    insight: item.i,
  };
});