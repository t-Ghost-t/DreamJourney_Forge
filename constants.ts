
import { CharacterState, Option } from './types';

// Changed to a function to ensure a fresh object is returned every time, fixing the Reset bug
export const getInitialState = (): CharacterState => ({
  isNSFW: false,
  rephraseSeed: 0,
  enhancedOutput: null,
  lastEnhancedOutput: null,
  // Identity
  name: "", age: "", gender: "female", customGender: "", pronouns: "female", role: "", genre: "", 
  // Appearance
  ethnicity: "", skinTone: "", hairColor: "", hairLength: "", hairStyle: "", eyeColor: "", 
  bodyType: "", topSize: "", bottomSize: "", height: "", genitals: [], pubicStyle: "",
  
  // Custom Anatomy
  upperBodyPreference: "",
  customAnatomy: [],
  breastSize: "", breastShape: "",
  chestSize: "", 
  buttSize: "", buttShape: "",
  penisSize: [], vaginaSize: [],

  // Personality
  archetype: "", backstoryType: "", customBackstorySnippet: "", tropes: [], relationship: "", motivation: "", 
  speechStyle: "", mannerisms: [], nickname: "",
  // Interests
  fashionVibe: "", hobbies: [],
  // Intimacy
  domSub: "", topBottom: "", kinks: []
});

// We keep a constant for the randomizer to use as a fallback if needed, but App.tsx should use getInitialState
export const INITIAL_STATE = getInitialState(); 

export const RANDOM_PREFILLS = {
  name: ["Kaelthas", "Lyra", "Jinx", "Marcus", "Seraphina", "Rogue", "Viper", "Elara", "Dorian", "Nyx", "Cassius", "Isolde", "Thorne", "Nova", "Silas", "Vesper"],
  age: ["18", "19", "21", "24", "25", "28", "30", "35", "40", "100", "500", "2000"],
  role: ["professor", "knight", "detective", "barista", "assassin", "mage", "pilot", "doctor", "artist", "demon hunter", "ceo", "barbarian", "hacker", "royal guard"],
  genre: ["Fantasy", "Cyberpunk", "Slice of Life", "Dark Romance", "Sci-Fi", "Horror", "Urban Fantasy", "Isekai", "Dystopian", "Space Opera"],
  nickname: ["darling", "pet", "idiot", "honey", "boss", "babe", "partner", "my love", "mortal", "senpai", "rookie"],
  relationship: ["rival", "childhood friend", "enemy", "lover", "servant", "master", "classmate", "stranger", "ex-partner", "roommate", "bodyguard"],
  motivation: [
    "to find the lost artifact",
    "to avenge their family",
    "to survive the night",
    "to win the tournament",
    "to hide their true identity",
    "to seduce the hero",
    "to escape the city",
    "to protect the innocent",
    "to uncover the conspiracy"
  ],
  customGender: ["demigod", "android", "non-binary person", "changeling", "spirit", "entity"]
};

export const HAIR_DATA: Record<string, Option[]> = {
  "Bald": [
    { label: "Completely Bald", value: "completely bald scalp" },
    { label: "Stubble", value: "layer of stubble" },
    { label: "Clean Shaven", value: "clean-shaven scalp" },
    { label: "Buzzed Sides", value: "buzzed sides" },
    { label: "Patterned Shave", value: "patterned shave" },
    { label: "Mohawk Strip", value: "thin mohawk strip" },
    { label: "Patchy", value: "patchy growth" },
    { label: "Shadow", value: "5 o'clock shadow" },
    { label: "Fuzzy", value: "soft fuzz" },
    { label: "Tattooed", value: "tattooed scalp" },
    { label: "Scarred", value: "scarred scalp" },
    { label: "Polished", value: "polished, smooth scalp" }
  ],
  "Short": [
    { label: "Pixie Cut", value: "pixie cut" }, 
    { label: "Bob", value: "bob" }, 
    { label: "Undercut", value: "undercut" }, 
    { label: "Messy Spikes", value: "messy, spiked style" }, 
    { label: "Buzzcut", value: "buzzcut" }, 
    { label: "Fade", value: "fade" },
    { label: "Bowl Cut", value: "bowl cut" },
    { label: "French Crop", value: "french crop" },
    { label: "Pompadour", value: "pompadour" },
    { label: "Slicked Back", value: "slicked-back style" },
    { label: "Faux Hawk", value: "faux hawk" },
    { label: "Side Part", value: "neat side part" }
  ],
  "Medium": [
    { label: "Layered", value: "layered cut" }, 
    { label: "Wolf Cut", value: "wolf cut" }, 
    { label: "Shag", value: "shag cut" }, 
    { label: "Hime Cut", value: "hime cut" }, 
    { label: "Mullet", value: "mullet" }, 
    { label: "Long Bob (Lob)", value: "long bob" },
    { label: "Blunt Cut", value: "blunt cut" },
    { label: "Curly Fro", value: "curly afro" },
    { label: "Dreadlocks", value: "dreadlocks" },
    { label: "Cornrows", value: "tight cornrows" },
    { label: "Asymmetrical", value: "asymmetrical cut" },
    { label: "Pageboy", value: "pageboy cut" }
  ],
  "Long": [
    { label: "Sleek Straight", value: "sleek, straight style" }, 
    { label: "Loose Waves", value: "loose waves" }, 
    { label: "Twin Tails", value: "twin tails" }, 
    { label: "High Ponytail", value: "high ponytail" }, 
    { label: "Complex Braids", value: "complex braids" }, 
    { label: "Half-up Half-down", value: "half-up, half-down style" },
    { label: "Low Bun", value: "loose low bun" },
    { label: "Fishtail Braid", value: "fishtail braid" },
    { label: "Space Buns", value: "space buns" },
    { label: "Ringlets", value: "cascading ringlets" },
    { label: "Dreadlocks", value: "dreadlocks" },
    { label: "V-Cut", value: "layered V-cut" }
  ],
  "Extra Long": [
    { label: "Straight", value: "straight sheet" },
    { label: "Rapunzel Braid", value: "thick, dragging braid" },
    { label: "Loose Waves", value: "cascading waves" },
    { label: "Dragging Pony", value: "dragging ponytail" },
    { label: "Wrapped Bun", value: "massive wrapped bun" },
    { label: "Drill Curls", value: "massive drill curls" },
    { label: "Twin Tails", value: "sweeping twin tails" },
    { label: "Cloud", value: "massive cloud" },
    { label: "Cascading", value: "unending sheets" },
    { label: "Looped Braids", value: "elaborate looped braids" },
    { label: "Train", value: "bridal train" },
    { label: "Living", value: "seemingly living mass" }
  ]
};

export const BACKSTORY_ARCHETYPES: Record<string, string> = {
  "Prodigy": "excelled at everything until the pressure became too much to bear",
  "Survivor": "fought through a difficult past that left deep emotional scars",
  "Rebel": "rejected the path laid out for them to forge their own identity",
  "Sheltered": "lived a protected life and is now navigating the chaos of the real world",
  "Mystery": "keeps their past a closed book, hiding secrets that shape their every move",
  "Professional": "sacrificed personal connections to dedicate themselves entirely to their craft",
  "Wanderer": "traveled far and wide, never staying in one place long enough to call it home",
  "Outcast": "was shunned by society and forced to learn self-reliance on the fringes",
  "Royal": "grew up in a gilded cage, burdened by the weight of expectation and duty",
  "Chosen One": "was thrust into a destiny they never asked for, carrying the fate of many",
  "Commoner": "lived a simple, unnoticed life until fate intervened",
  "Amnesiac": "woke up with no memory of who they were, searching for fragments of the past"
};

export const ARCHETYPES: Option[] = [
  { label: "The Leader", value: "leader" }, { label: "The Loner", value: "loner" }, 
  { label: "The Jester", value: "jester" }, { label: "The Stoic", value: "stoic" }, 
  { label: "The Caregiver", value: "caregiver" }, { label: "The Rebel", value: "rebel" },
  { label: "The Intellectual", value: "intellectual" }, { label: "The Charmer", value: "charmer" },
  { label: "The Innocent", value: "innocent" }, { label: "The Wildcard", value: "wildcard" },
  { label: "The Traditionalist", value: "traditionalist" }, { label: "The Dreamer", value: "dreamer" }
];

export const TROPES: Option[] = [
  { label: "Enemies to Lovers", value: "enemies to lovers" }, { label: "Slow Burn", value: "slow burn" }, 
  { label: "Unexpected Ally", value: "unexpected ally" }, { label: "Secret Crush", value: "secret crush" }, 
  { label: "Bully", value: "bully" }, { label: "Childhood Friend", value: "childhood friend" },
  { label: "Fish out of Water", value: "fish out of water" }, { label: "Power Imbalance", value: "power imbalance" },
  { label: "Forbidden Love", value: "forbidden love" }, { label: "Forced Proximity", value: "forced proximity" },
  { label: "Soulmates", value: "soulmates" }, { label: "Grumpy x Sunshine", value: "grumpy x sunshine" }
];

export const ETHNICITIES: Option[] = [
  { label: "European", value: "European" }, { label: "East Asian", value: "East Asian" }, 
  { label: "South Asian", value: "South Asian" }, { label: "Southeast Asian", value: "Southeast Asian" },
  { label: "African", value: "African" }, { label: "African-American", value: "African-American" },
  { label: "Hispanic/Latino", value: "Hispanic" }, { label: "Middle Eastern", value: "Middle Eastern" },
  { label: "Pacific Islander", value: "Pacific Islander" }, { label: "Indigenous", value: "Indigenous" },
  { label: "Caribbean", value: "Caribbean" }, { label: "Mixed Heritage", value: "Mixed" }
];

export const SKIN_TONES: Option[] = [
  { label: "Ghostly", value: "ghostly", color: "#f8f9fa" }, { label: "Pale", value: "pale", color: "#fce4d6" },
  { label: "Fair", value: "fair", color: "#f3cbb4" }, { label: "Light", value: "light", color: "#eec1a0" },
  { label: "Beige", value: "beige", color: "#e4c6a6" }, { label: "Olive", value: "olive", color: "#b98e60" },
  { label: "Tan", value: "tan", color: "#a87747" }, { label: "Bronze", value: "bronze", color: "#cd7f32" },
  { label: "Brown", value: "brown", color: "#8d5e32" }, { label: "Dark Brown", value: "dark brown", color: "#603d1e" },
  { label: "Ebony", value: "ebony", color: "#231307" }, { label: "Obsidian", value: "obsidian", color: "#080402" }
];

export const EYE_COLORS: Option[] = [
  { label: "Dark Brown", value: "dark brown", color: "#3e2723" }, { label: "Brown", value: "brown", color: "#5d4037" }, 
  { label: "Light Brown", value: "light brown", color: "#8d6e63" }, { label: "Amber", value: "amber", color: "#ffc107" },
  { label: "Hazel", value: "hazel", color: "#d4e157" }, { label: "Green", value: "green", color: "#66bb6a" }, 
  { label: "Dark Green", value: "dark green", color: "#1b5e20" }, { label: "Grey", value: "grey", color: "#9e9e9e" }, 
  { label: "Dark Grey", value: "dark grey", color: "#616161" }, { label: "Blue", value: "blue", color: "#42a5f5" }, 
  { label: "Dark Blue", value: "dark blue", color: "#1565c0" }, { label: "Ice Blue", value: "ice blue", color: "#b3e5fc" }
];

export const HAIR_COLORS: Option[] = [
  { label: "Black", value: "black", color: "#000000" }, { label: "Dark Brown", value: "dark brown", color: "#3e2723" }, 
  { label: "Brown", value: "brown", color: "#795548" }, { label: "Light Brown", value: "light brown", color: "#a1887f" }, 
  { label: "Dirty Blonde", value: "dirty blonde", color: "#d4c4a8" }, { label: "Blonde", value: "blonde", color: "#ffee58" },
  { label: "Platinum", value: "platinum blonde", color: "#fff9c4" }, { label: "Strawberry", value: "strawberry blonde", color: "#ffccbc" },
  { label: "Auburn", value: "auburn", color: "#bf360c" }, { label: "Red", value: "red", color: "#d32f2f" },
  { label: "Ginger", value: "ginger", color: "#ff5722" }, { label: "White", value: "white", color: "#eeeeee" }
];

export const BODY_TYPES: Option[] = [
  { label: "Slim", value: "slim" }, { label: "Athletic", value: "athletic" }, 
  { label: "Curvy", value: "curvy" }, { label: "Chubby", value: "chubby" }, 
  { label: "Muscular", value: "muscular" }, { label: "Petite", value: "petite" },
  { label: "Lanky", value: "lanky" }, { label: "Voluptuous", value: "voluptuous" },
  { label: "Stocky", value: "stocky" }, { label: "Plus-sized", value: "plus-sized" },
  { label: "Toned", value: "toned" }, { label: "Wiry", value: "wiry" }
];

export const SPEECH_STYLES: Option[] = [
  { label: "Formal", value: "formal", personaDesc: "disciplined and polite demeanor" }, 
  { label: "Casual/Slang", value: "casual", personaDesc: "laid-back and modern attitude" },
  { label: "Bubbly", value: "bubbly", personaDesc: "cheerful and energetic presence" }, 
  { label: "Witty/Sharp", value: "sharp", personaDesc: "direct and cutting wit" },
  { label: "Seductive", value: "seductive", personaDesc: "alluring and magnetic charm" }, 
  { label: "Shy", value: "shy", personaDesc: "timid and reserved nature" },
  { label: "Boisterous", value: "boisterous", personaDesc: "loud and commanding presence" }, 
  { label: "Cryptic", value: "cryptic", personaDesc: "mysterious and enigmatic aura" },
  { label: "Monotone", value: "monotone", personaDesc: "calm and detached disposition" }, 
  { label: "Intellectual", value: "intellectual", personaDesc: "analytical and observant mind" },
  { label: "Drawling", value: "drawling", personaDesc: "relaxed and unhurried composure" }, 
  { label: "Poetic", value: "poetic", personaDesc: "eloquent and flowery expression" }
];

export const MANNERISMS: Option[] = [
  { label: "Eye Contact", value: "maintains eye contact" }, { label: "No Eye Contact", value: "avoids eye contact" }, 
  { label: "Plays Hair", value: "plays with hair" }, { label: "Touches User", value: "touches {{user}}" }, 
  { label: "Crosses Arms", value: "crosses arms" }, { label: "Smirks", value: "smirks" }, 
  { label: "Sighs", value: "sighs" }, { label: "Bites Lip", value: "bites lip" },
  { label: "Fidgets", value: "fidgets" }, { label: "Tilts Head", value: "tilts head" },
  { label: "Paces", value: "paces" }, { label: "Giggles", value: "giggles" }
];

export const FASHION_STYLES: Option[] = [
  { label: "Streetwear", value: "streetwear" }, { label: "High Fashion", value: "high fashion" }, 
  { label: "Gothic", value: "gothic" }, { label: "Athleisure", value: "athleisure" }, 
  { label: "Business Chic", value: "business chic" }, { label: "Techwear", value: "techwear" }, 
  { label: "Cottagecore", value: "cottagecore" }, { label: "Preppy", value: "preppy" },
  { label: "Punk", value: "punk" }, { label: "Bohemian", value: "bohemian" },
  { label: "Vintage", value: "vintage" }, { label: "Grunge", value: "grunge" }
];

export const HOBBIES: Option[] = [
  { label: "Gaming", value: "gaming" }, { label: "Fitness", value: "fitness" }, 
  { label: "Shopping", value: "shopping" }, { label: "Reading", value: "reading" },
  { label: "The Occult", value: "the occult" }, { label: "Social Media", value: "social media" }, 
  { label: "Art", value: "art" }, { label: "Cooking", value: "cooking" },
  { label: "Gardening", value: "gardening" }, { label: "Music", value: "music" },
  { label: "Writing", value: "writing" }, { label: "Hiking", value: "hiking" }
];

export const NSFW_ROLES: Option[] = [
  { label: "Dominant", value: "dominant" }, 
  { label: "Submissive", value: "submissive" }, 
  { label: "Switch", value: "switch" },
  { label: "Master", value: "master" }, 
  { label: "Slave", value: "slave" }, 
  { label: "Mistress", value: "mistress" }, 
  { label: "Pet", value: "pet" }, 
  { label: "Handler", value: "handler" },
  { label: "Brat", value: "brat" }, 
  { label: "Brat Tamer", value: "brat tamer" }, 
  { label: "Mommy/Daddy", value: "mommy/daddy" }, 
  { label: "Primal", value: "primal" }
];

export const NSFW_POSITIONS: Option[] = [
  { label: "Top", value: "top" }, 
  { label: "Bottom", value: "bottom" }, 
  { label: "Versatile", value: "versatile" }, 
  { label: "Pillow Princess", value: "pillow princess" }, 
  { label: "Power Top", value: "power top" }, 
  { label: "Power Bottom", value: "power bottom" }, 
  { label: "Soft Top", value: "soft top" }, 
  { label: "Soft Bottom", value: "soft bottom" }, 
  { label: "Service Top", value: "service top" }, 
  { label: "Service Bottom", value: "service bottom" }, 
  { label: "Cuck/Observer", value: "cuck/observer" }, 
  { label: "Passive", value: "passive" }
];

export const NSFW_KINKS: Option[] = [
  { label: "Bondage", value: "bondage" }, 
  { label: "Spanking", value: "spanking" }, 
  { label: "Sensory Deprivation", value: "sensory deprivation" }, 
  { label: "Rough Play", value: "rough play" }, 
  { label: "Overstimulation", value: "overstimulation" }, 
  { label: "Edging / Denial", value: "edging and denial" }, 
  { label: "Degradation", value: "degradation" }, 
  { label: "Praise", value: "praise" }, 
  { label: "Exhibitionism", value: "exhibitionism" }, 
  { label: "Voyeurism", value: "voyeurism" }, 
  { label: "Pet Play", value: "pet play" }, 
  { label: "Roleplay", value: "roleplay" }
];

// GRANULAR ANATOMY OPTIONS
export const BREAST_SIZES: Option[] = [
  {label: "Flat", value: "flat"}, {label: "Small", value: "small"}, {label: "Medium", value: "medium"},
  {label: "Large", value: "large"}, {label: "Very Large", value: "very large"}, {label: "Massive", value: "massive"}
];

export const BREAST_SHAPES: Option[] = [
  {label: "Perky", value: "perky"}, {label: "Round", value: "round"}, {label: "Natural", value: "natural"},
  {label: "Wide-Set", value: "wide-set"}, {label: "Fake", value: "surgically enhanced"}, {label: "Soft", value: "soft"},
  {label: "Teardrop", value: "teardrop-shaped"}, {label: "Heavy", value: "heavy"}
];

export const CHEST_OPTIONS: Option[] = [
  {label: "Narrow", value: "narrow"}, {label: "Broad", value: "broad"}, {label: "Defined", value: "defined"}, {label: "Barrel", value: "barrel"},
  {label: "Flat", value: "flat"}, {label: "Scrawny", value: "scrawny"}, {label: "Sculpted", value: "sculpted"}, {label: "Herculean", value: "herculean"}, 
  {label: "Lean", value: "lean"}, {label: "Heavy", value: "heavy"}
];

export const BUTT_SIZES: Option[] = [
  {label: "Flat", value: "flat"}, {label: "Small", value: "small"}, {label: "Medium", value: "medium"},
  {label: "Large", value: "large"}, {label: "Very Large", value: "very large"}, {label: "Massive", value: "massive"}
];

export const BUTT_SHAPES: Option[] = [
  {label: "Heart Shaped", value: "heart-shaped"}, {label: "Bubble", value: "bubble"}, {label: "Toned", value: "toned"},
  {label: "Bouncy", value: "bouncy"}, {label: "Plump", value: "plump"}, {label: "Firm", value: "firm"},
  {label: "Shelf", value: "shelf-like"}, {label: "Round", value: "round"}
];

// Kept for backward compat but male logic now uses Butt options
export const LOWER_BODY_OPTIONS: Option[] = [
  {label: "Slim", value: "slim"}, {label: "Average", value: "average"}, {label: "Thick", value: "thick"},
  {label: "Stout", value: "stout"}, {label: "Powerful", value: "powerful"}, {label: "Lean", value: "lean"}, {label: "Heavy-set", value: "heavy-set"}, {label: "Solid", value: "solid"}
];

export const PENIS_OPTIONS: Option[] = [
  {label: "Average", value: "average"}, {label: "Thick", value: "thick"}, {label: "Long", value: "long"}, {label: "Curved", value: "curved"},
  {label: "Veiny", value: "veiny"}, {label: "Cut", value: "circumcised"}, {label: "Uncut", value: "uncut"}, {label: "Pierced", value: "pierced"},
  {label: "Small", value: "small"}, {label: "Heavy", value: "heavy"}, {label: "Micro", value: "micro"}, {label: "Girthy", value: "girthy"}
];

export const VAGINA_OPTIONS: Option[] = [
  {label: "Innie", value: "innie"}, {label: "Outie", value: "outie"}, {label: "Puffy", value: "puffy"}, 
  {label: "Smooth", value: "smooth"}, {label: "Small", value: "small"}, {label: "Large", value: "large"}, 
  {label: "Pierced", value: "pierced"}, {label: "Pink", value: "pink"}, {label: "Dark", value: "dark"}, 
  {label: "Full Lips", value: "full-lipped"}, {label: "Thin Lips", value: "thin-lipped"}, {label: "Pronounced", value: "pronounced"}
];

export const PUBIC_OPTIONS: Option[] = [
  {label: "Shaven", value: "shaven"}, {label: "Trimmed", value: "trimmed"}, {label: "Natural", value: "natural"}, {label: "Hairy", value: "hairy"},
  {label: "Landing Strip", value: "landing strip"}, {label: "Triangle", value: "triangle"}, {label: "Heart", value: "heart"}, {label: "Lightning", value: "lightning bolt"},
  {label: "Bejeweled", value: "bejeweled"}, {label: "Bushy", value: "bushy"}, {label: "Stubble", value: "stubbly"}, {label: "Faded", value: "faded"}
];

export const BODY_PARTS = {
  male: {
    top: CHEST_OPTIONS,
    bottom: LOWER_BODY_OPTIONS,
    pubic: PUBIC_OPTIONS,
    genitals: PENIS_OPTIONS
  },
  female: {
    pubic: PUBIC_OPTIONS,
    genitals: VAGINA_OPTIONS
  }
};

export const STRUCTURAL_KEYS = ["hairLength", "isNSFW", "gender", "pronouns", "upperBodyPreference", "customAnatomy"];
