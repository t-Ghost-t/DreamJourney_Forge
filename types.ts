

export interface CharacterState {
  isNSFW: boolean;
  rephraseSeed?: number; // Controls global phrasing randomization
  enhancedOutput?: string | null; // Stores AI-enhanced text
  lastEnhancedOutput?: string | null; // Stores previous AI text for Redo functionality
  // Identity
  name: string;
  age: string;
  gender: string;
  customGender: string;
  pronouns: string;
  role: string;
  genre: string;
  // Appearance
  ethnicity: string;
  skinTone: string;
  hairColor: string;
  hairLength: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: string;
  topSize: string; // Male Chest (Single)
  bottomSize: string; // Male Lower Body (Single)
  height: string;
  
  // Custom Anatomy (Gender: Other) & Female Split
  upperBodyPreference: string; // 'breasts' | 'chest'
  customAnatomy: string[]; // ['penis', 'vagina']
  
  // Split Fields
  breastSize: string;
  breastShape: string;
  chestSize: string;
  buttSize: string;
  buttShape: string;
  
  penisSize: string[];
  vaginaSize: string[];

  genitals: string[]; // Standard Male/Female
  pubicStyle: string;
  // Personality
  archetype: string;
  backstoryType: string;
  customBackstorySnippet?: string; // New field for manual backstory entry
  tropes: string[];
  relationship: string;
  motivation: string;
  speechStyle: string;
  mannerisms: string[];
  nickname: string;
  // Interests
  fashionVibe: string;
  hobbies: string[];
  // Intimacy
  domSub: string;
  topBottom: string;
  kinks: string[];
  [key: string]: any; // Index signature for dynamic access
}

export interface Option {
  label: string;
  value?: string;
  icon?: string;
  color?: string;
  personaDesc?: string; // New field for the header/persona section
}

export interface Group {
  title: string;
  key: keyof CharacterState;
  customEx?: string;
  multi?: boolean;
  disableCustom?: boolean;
  options: Option[];
  max?: number;
}

export interface Section {
  type: 'input' | 'select' | 'textarea';
  key: keyof CharacterState;
  label: string;
  placeholder?: string;
  optional?: boolean;
  options?: Option[];
}

export interface Step {
  id: string;
  title: string;
  desc: string;
  type: 'mixed' | 'grid-group' | 'summary';
  sections?: Section[];
  groups?: Group[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
