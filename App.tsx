import React, { useState, useMemo, useEffect } from 'react';
import { CharacterState, Step, Option } from './types';
import { 
  getInitialState, HAIR_DATA, RANDOM_PREFILLS, ARCHETYPES, BACKSTORY_ARCHETYPES, 
  TROPES, ETHNICITIES, SKIN_TONES, EYE_COLORS, HAIR_COLORS, BODY_TYPES, 
  SPEECH_STYLES, MANNERISMS, FASHION_STYLES, HOBBIES, NSFW_ROLES, 
  NSFW_POSITIONS, NSFW_KINKS, BODY_PARTS,
  BREAST_SIZES, BREAST_SHAPES, BUTT_SIZES, BUTT_SHAPES, CHEST_OPTIONS, LOWER_BODY_OPTIONS, PENIS_OPTIONS, VAGINA_OPTIONS, PUBIC_OPTIONS
} from './constants';
import { Sidebar } from './components/Sidebar';
import { StepContent } from './components/StepContent';
import { downloadFile } from './utils';

const App: React.FC = () => {
  // Use function call to avoid reference mutation issues
  const [state, setState] = useState<CharacterState>(getInitialState());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [invalidKeys, setInvalidKeys] = useState<string[]>([]);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [resetCount, setResetCount] = useState(0); // Used to force remount on reset

  // Randomizer Utilities
  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const getRandomSubset = <T,>(arr: T[], count: number): T[] => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
  };
  const getOptVal = (opt: Option) => opt.value || opt.label;

  // Compute steps first to use in handleRandomize for navigation
  const steps = useMemo<Step[]>(() => {
    const s = state;
    const stepList: Step[] = [];

    // --- 1. IDENTITY STEP ---
    const identitySections: any[] = [
      { type: "input", key: "name", label: "Name", placeholder: "e.g. Kassandra, Jaxon" },
      { type: "select", key: "gender", label: "Gender", options: [
          { label: "Female", value: "female", icon: "♀️" }, 
          { label: "Male", value: "male", icon: "♂️" }, 
          { label: "Custom", value: "other", icon: "⚙️" }
      ]},
    ];

    if (s.gender === 'other') {
      identitySections.push(
        { type: "input", key: "customGender", label: "Gender Name", placeholder: "e.g. Non-Binary, Futanari" },
        { type: "select", key: "pronouns", label: "Pronouns", options: [
            { label: "She/Her", value: "female" },
            { label: "He/Him", value: "male" },
            { label: "They/Them", value: "other" }
        ]}
      );
    }

    identitySections.push(
      { type: "input", key: "age", label: "Age", placeholder: "e.g. 26, 500" },
      { type: "input", key: "role", label: "Occupation", placeholder: "e.g. Xenobiologist, Barista" },
      { type: "input", key: "genre", label: "Genre", placeholder: "e.g. Cyberpunk Noir, Regency Romance" },
      { type: "input", key: "relationship", label: "Relationship to User", placeholder: "e.g. Ex-Spouse, Rival" },
      { type: "textarea", key: "motivation", label: "Motivation", placeholder: "e.g. to avenge their clan, to pay off a debt", optional: true }
    );

    stepList.push({
      id: "identity",
      title: "Identity",
      desc: "The Basics",
      type: "mixed",
      sections: identitySections
    });

    // --- 2. ARCHETYPE (Prev. Personality) ---
    stepList.push({
      id: "persona",
      title: "Archetype",
      desc: "Background & Tropes",
      type: "grid-group",
      groups: [
        {
            title: "Archetype", key: "archetype", customEx: "e.g. Noir Detective, Femme Fatale",
            options: ARCHETYPES
        },
        {
            title: "Backstory", key: "backstoryType",
            options: Object.keys(BACKSTORY_ARCHETYPES).map(k => ({ label: k, value: k }))
        },
        {
            title: "Tropes (Max 3)", key: "tropes", multi: true, customEx: "e.g. Redemption Arc, Reluctant Hero",
            options: TROPES,
            max: 3
        }
      ]
    });

    // --- 3. APPEARANCE (HEAD) ---
    let headGroups = [
      {
          title: "Heritage / Ethnicity", key: "ethnicity", customEx: "e.g. Elven, Martian",
          options: ETHNICITIES
      },
      {
          title: "Skin Tone", key: "skinTone", customEx: "e.g. sun-kissed, orc-green",
          options: SKIN_TONES
      },
      {
          title: "Eye Color", key: "eyeColor", customEx: "e.g. glowing red, heterochromia",
          options: EYE_COLORS
      },
      {
          title: "Hair Color", key: "hairColor", customEx: "e.g. silver fox, neon pink",
          options: HAIR_COLORS
      },
      {
          title: "Hair Length", key: "hairLength", customEx: "e.g. floor-length, shaved",
          options: [ 
            { label: "Bald", value: "Bald" }, { label: "Short", value: "Short" }, 
            { label: "Medium", value: "Medium" }, { label: "Long", value: "Long" }, 
            { label: "Extra Long", value: "Extra Long" } 
          ]
      }
    ];

    if (s.hairLength) {
        let opts = HAIR_DATA[s.hairLength];
        if (!opts) opts = []; 
        
        // @ts-ignore
        headGroups.push({ title: "Hair Style", key: "hairStyle", customEx: "e.g. victory rolls, mohawk", options: opts });
    }

    // @ts-ignore
    stepList.push({ id: "head", title: "Appearance", desc: "Head/Face Features", type: "grid-group", groups: headGroups });

    // --- 4. PHYSIQUE ---
    let bodyGroups = [];
    bodyGroups.push({ title: "Body Type", key: "bodyType", customEx: "e.g. swimmer's build, dad bod", options: BODY_TYPES });
    
    // --- BODY LOGIC ---
    if (s.gender === 'female') {
        bodyGroups.push({ title: "Breast Size", key: "breastSize", customEx: "e.g. asymmetrical", options: BREAST_SIZES });
        bodyGroups.push({ title: "Breast Shape", key: "breastShape", customEx: "e.g. heavy", options: BREAST_SHAPES });
        
        bodyGroups.push({ title: "Butt Size", key: "buttSize", customEx: "e.g. non-existent", options: BUTT_SIZES });
        bodyGroups.push({ title: "Butt Shape", key: "buttShape", customEx: "e.g. shelf", options: BUTT_SHAPES });
    } else if (s.gender === 'male') {
        bodyGroups.push({ title: "Chest Build", key: "topSize", customEx: "e.g. hairy, scarred", options: BODY_PARTS.male.top });
        // Replaced "Lower Body" with Butt Options for parity
        bodyGroups.push({ title: "Butt Size", key: "buttSize", customEx: "e.g. flat, muscular", options: BUTT_SIZES });
        bodyGroups.push({ title: "Butt Shape", key: "buttShape", customEx: "e.g. square", options: BUTT_SHAPES });
    } else {
        // CUSTOM GENDER PHYSIQUE
        // 1. Upper Body Type Toggle
        bodyGroups.push({ 
          title: "Upper Body Type", 
          key: "upperBodyPreference", 
          customEx: "N/A", 
          disableCustom: true,
          options: [{label: "Breasts", value: "breasts"}, {label: "Chest", value: "chest"}] 
        });

        // 2. Conditional Size Options
        if (s.upperBodyPreference === 'breasts') {
           bodyGroups.push({ title: "Breast Size", key: "breastSize", customEx: "e.g. surgical, natural", options: BREAST_SIZES });
           bodyGroups.push({ title: "Breast Shape", key: "breastShape", customEx: "e.g. heavy", options: BREAST_SHAPES });
        } else if (s.upperBodyPreference === 'chest') {
           bodyGroups.push({ title: "Chest Build", key: "chestSize", customEx: "e.g. concave, barrel", options: CHEST_OPTIONS });
        }

        // 3. Butt Size (Universal for Custom)
        bodyGroups.push({ title: "Butt Size", key: "buttSize", customEx: "e.g. bubble, square", options: BUTT_SIZES });
        bodyGroups.push({ title: "Butt Shape", key: "buttShape", customEx: "e.g. shelf", options: BUTT_SHAPES });
    }
    
    // @ts-ignore
    stepList.push({ id: "body", title: "Physique", desc: "Body Structure", type: "grid-group", groups: bodyGroups });

    // --- 5. PERSONALITY (Prev. Context) ---
    stepList.push({
      id: "context",
      title: "Personality",
      desc: "Speech & Habits",
      type: "mixed", // Now supports both sections and groups
      sections: [
        { type: "select", key: "speechStyle", label: "Speech Style", options: SPEECH_STYLES },
        { type: "input", key: "nickname", label: "Nickname for User (Optional)", placeholder: "e.g. Slick, Your Highness", optional: true }
      ],
      groups: [
        {
            title: "Mannerisms (Max 2)", key: "mannerisms", multi: true, customEx: "e.g. cracks knuckles, hums",
            options: MANNERISMS,
            max: 2
        }
      ]
    });

    // --- 6. INTERESTS (Prev. Style) ---
    stepList.push({
      id: "style",
      title: "Interests",
      desc: "Fashion & Hobbies",
      type: "grid-group",
      groups: [
        {
            title: "Fashion", key: "fashionVibe", customEx: "e.g. Dark Academia, Y2K",
            options: FASHION_STYLES
        },
        {
            title: "Hobbies (Max 3)", key: "hobbies", multi: true, customEx: "e.g. Mixology, Lockpicking",
            options: HOBBIES,
            max: 3
        }
      ]
    });

    // --- 7. NSFW ANATOMY ---
    if (s.isNSFW) {
        let genitalGroups = [];
        
        if (s.gender === 'female') {
             genitalGroups.push({ title: "Pubic Style", key: "pubicStyle", customEx: "e.g. lightning bolt, dyed", options: PUBIC_OPTIONS });
             genitalGroups.push({ title: "Genitals (Multi)", key: "genitals", multi: true, customEx: "e.g. pierced, two-toned", options: VAGINA_OPTIONS });
        } else if (s.gender === 'male') {
             genitalGroups.push({ title: "Pubic Style", key: "pubicStyle", customEx: "e.g. faded, manscaped", options: BODY_PARTS.male.pubic });
             genitalGroups.push({ title: "Genitals (Multi)", key: "genitals", multi: true, customEx: "e.g. ribbed, knotted", options: BODY_PARTS.male.genitals });
        } else {
             // CUSTOM NSFW - ANATOMY CHECKLIST
             genitalGroups.push({
              title: "Anatomy Checklist",
              key: "customAnatomy",
              multi: true,
              disableCustom: true,
              options: [
                { label: "Penis", value: "penis" },
                { label: "Vagina", value: "vagina" },
              ]
            });

             const hasPenis = s.customAnatomy?.includes('penis');
             const hasVagina = s.customAnatomy?.includes('vagina');

             genitalGroups.push({ title: "Pubic Style", key: "pubicStyle", customEx: "e.g. natural, patterned", options: PUBIC_OPTIONS });
             
             if (hasPenis) {
               genitalGroups.push({ title: "Penis Detail (Multi)", key: "penisSize", multi: true, customEx: "e.g. prehensile, girthy", options: PENIS_OPTIONS });
             }
             if (hasVagina) {
               genitalGroups.push({ title: "Vulva Detail (Multi)", key: "vaginaSize", multi: true, customEx: "e.g. sensitive, hooded", options: VAGINA_OPTIONS });
             }
        }
        
        // @ts-ignore
        stepList.push({ id: "nsfw_anatomy", title: "NSFW: Anatomy", desc: "Private Parts", type: "grid-group", groups: genitalGroups });
    }

    // --- 8. NSFW DYNAMICS ---
    if (s.isNSFW) {
        stepList.push({
          id: "nsfw_dynamic",
          title: "NSFW: Dynamics",
          desc: "Role & Position",
          type: "grid-group",
          groups: [
              {
                  title: "Role", key: "domSub", customEx: "e.g. Brat, Service Top",
                  options: NSFW_ROLES
              },
              {
                  title: "Position", key: "topBottom", customEx: "e.g. Power Bottom, Side",
                  options: NSFW_POSITIONS
              }
          ]
        });
        
        // --- 9. NSFW KINKS ---
        stepList.push({
          id: "nsfw_kinks",
          title: "NSFW: Kinks",
          desc: "Activities",
          type: "grid-group",
          groups: [
              {
                  title: "Kinks (Multi)", key: "kinks", multi: true, customEx: "e.g. Knife Play, Shibari",
                  options: NSFW_KINKS
              }
          ]
        });
    }

    stepList.push({ id: "summary", title: "Review", desc: "Rephrase/Enhance", type: "summary" });
    return stepList;
  }, [state.gender, state.hairLength, state.isNSFW, state.upperBodyPreference, state.customAnatomy, state.customGender]);

  // SAFEGUARD: If steps array shrinks (e.g. NSFW toggle off), clamp index immediately to prevent crash
  // We calculate the safe index here to be used in the render if necessary
  const safeCurrentIndex = Math.min(currentStepIndex, steps.length - 1);

  useEffect(() => {
    // If we detected that we were out of bounds, sync state
    if (currentStepIndex > steps.length - 1) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [steps.length, currentStepIndex]);

  const handleRandomize = () => {
    // Identity
    const gender = getRandom(['female', 'male', 'other']);
    const name = getRandom(RANDOM_PREFILLS.name);
    const age = getRandom(RANDOM_PREFILLS.age);
    const role = getRandom(RANDOM_PREFILLS.role);
    const genre = getRandom(RANDOM_PREFILLS.genre);
    
    let pronouns = gender === 'female' ? 'female' : gender === 'male' ? 'male' : 'other';
    let customGender = "";
    if (gender === 'other') {
      pronouns = getRandom(['female', 'male', 'other']);
      customGender = getRandom(RANDOM_PREFILLS.customGender);
    }

    // Appearance
    const ethnicity = getOptVal(getRandom(ETHNICITIES));
    const skinTone = getOptVal(getRandom(SKIN_TONES));
    const eyeColor = getOptVal(getRandom(EYE_COLORS));
    const hairColor = getOptVal(getRandom(HAIR_COLORS));
    const bodyType = getOptVal(getRandom(BODY_TYPES));
    
    // Hair
    const hairLengthKeys = Object.keys(HAIR_DATA);
    const hairLength = getRandom(hairLengthKeys);
    const hairStyle = getOptVal(getRandom(HAIR_DATA[hairLength]));

    // Body Parts logic
    let topSize = "";
    let bottomSize = ""; // Deprecated but initialized
    let pubicStyle = "";
    let genitals: string[] = [];
    let customAnatomy: string[] = [];
    
    let breastSize = "";
    let breastShape = "";
    let chestSize = "";
    
    let buttSize = "";
    let buttShape = "";
    
    let penisSize: string[] = [];
    let vaginaSize: string[] = [];
    let upperBodyPreference = "";

    if (gender === 'female') {
      breastSize = getOptVal(getRandom(BREAST_SIZES));
      breastShape = getOptVal(getRandom(BREAST_SHAPES));
      buttSize = getOptVal(getRandom(BUTT_SIZES));
      buttShape = getOptVal(getRandom(BUTT_SHAPES));
      
      genitals = getRandomSubset(VAGINA_OPTIONS, 1).map(getOptVal);
      pubicStyle = getOptVal(getRandom(PUBIC_OPTIONS));
    } else if (gender === 'male') {
      topSize = getOptVal(getRandom(BODY_PARTS.male.top));
      // Replaced bottomSize with Butt Logic for Male
      buttSize = getOptVal(getRandom(BUTT_SIZES));
      buttShape = getOptVal(getRandom(BUTT_SHAPES));
      
      genitals = getRandomSubset(BODY_PARTS.male.genitals, 1).map(getOptVal);
      pubicStyle = getOptVal(getRandom(BODY_PARTS.male.pubic));
    } else {
      // CUSTOM GENDER LOGIC
      // 1. Upper Body Selection
      upperBodyPreference = Math.random() > 0.5 ? 'breasts' : 'chest';
      if (upperBodyPreference === 'breasts') {
         breastSize = getOptVal(getRandom(BREAST_SIZES));
         breastShape = getOptVal(getRandom(BREAST_SHAPES));
      } else {
         chestSize = getOptVal(getRandom(CHEST_OPTIONS));
      }

      // 2. Butt Size
      buttSize = getOptVal(getRandom(BUTT_SIZES));
      buttShape = getOptVal(getRandom(BUTT_SHAPES));

      // 3. Genitals
      const hasPenis = Math.random() > 0.5;
      const hasVagina = Math.random() > 0.5;
      if (hasPenis) { customAnatomy.push('penis'); penisSize = getRandomSubset(PENIS_OPTIONS, 1).map(getOptVal); }
      if (hasVagina) { customAnatomy.push('vagina'); vaginaSize = getRandomSubset(VAGINA_OPTIONS, 1).map(getOptVal); }
      
      pubicStyle = getOptVal(getRandom(PUBIC_OPTIONS));
    }
    
    // NSFW (Respect current toggle)
    let nsfwState: Partial<CharacterState> = {};
    if (state.isNSFW) {
       nsfwState = {
         pubicStyle,
         genitals, // For standard genders
         penisSize, // For custom
         vaginaSize, // For custom
         domSub: getOptVal(getRandom(NSFW_ROLES)),
         topBottom: getOptVal(getRandom(NSFW_POSITIONS)),
         kinks: getRandomSubset(NSFW_KINKS, Math.floor(Math.random() * 3) + 1).map(getOptVal)
       };
    } else {
       nsfwState = { pubicStyle: "", genitals: [], penisSize: [], vaginaSize: [], domSub: "", topBottom: "", kinks: [] };
    }

    // Personality
    const archetype = getOptVal(getRandom(ARCHETYPES));
    const backstoryKeys = Object.keys(BACKSTORY_ARCHETYPES).map(k => ({label: k, value: k}));
    const backstoryType = getOptVal(getRandom(backstoryKeys));
    const tropes = getRandomSubset(TROPES, Math.floor(Math.random() * 2) + 1).map(getOptVal);

    // Context
    const speechStyle = getOptVal(getRandom(SPEECH_STYLES));
    const nickname = getRandom(RANDOM_PREFILLS.nickname);
    const relationship = getRandom(RANDOM_PREFILLS.relationship);
    const motivation = getRandom(RANDOM_PREFILLS.motivation);

    // Interests
    const fashionVibe = getOptVal(getRandom(FASHION_STYLES));
    const mannerisms = getRandomSubset(MANNERISMS, Math.floor(Math.random() * 2) + 1).map(getOptVal);
    const hobbies = getRandomSubset(HOBBIES, Math.floor(Math.random() * 3) + 1).map(getOptVal);

    const newState: CharacterState = {
      ...getInitialState(),
      isNSFW: state.isNSFW,
      name, age, gender, customGender, pronouns, role, genre,
      ethnicity, skinTone, eyeColor, hairColor, bodyType,
      hairLength, hairStyle,
      
      topSize, bottomSize,
      breastSize, breastShape, chestSize,
      buttSize, buttShape,
      
      upperBodyPreference, customAnatomy, penisSize, vaginaSize,
      archetype, backstoryType, tropes,
      speechStyle, nickname, relationship, motivation,
      fashionVibe, mannerisms, hobbies,
      ...nsfwState
    };

    setState(newState);
    setInvalidKeys([]); 
    
    // Navigate to Review Page
    const summaryIndex = steps.length - 1;
    setMaxStepReached(summaryIndex); 
    setCurrentStepIndex(summaryIndex);
  };

  const updateState = (key: keyof CharacterState, value: any) => {
    setState(prev => {
      const newState = { ...prev, [key]: value };
      
      // Auto-set pronouns if standard gender selected
      if (key === 'gender') {
        if (value === 'female') {
          newState.pronouns = 'female';
          newState.customGender = '';
          newState.customAnatomy = [];
          newState.topSize = ""; 
          newState.bottomSize = "";
          newState.chestSize = ""; // Reset custom chest
        } else if (value === 'male') {
          newState.pronouns = 'male';
          newState.customGender = '';
          newState.customAnatomy = [];
          newState.breastSize = ""; 
          newState.breastShape = "";
          newState.chestSize = ""; // Reset custom chest
          // Note: we KEEP buttSize/buttShape as they are now shared
        } else {
           // Reset for custom
           newState.pronouns = 'other';
           newState.customAnatomy = []; 
           newState.topSize = "";
           newState.bottomSize = "";
           if (!newState.upperBodyPreference) newState.upperBodyPreference = "breasts";
        }
      }
      
      // Clear data when toggling upper body type
      if (key === 'upperBodyPreference') {
        newState.breastSize = "";
        newState.breastShape = "";
        newState.chestSize = "";
      }

      // Reset anatomy selections if unchecking from checklist
      if (key === 'customAnatomy') {
         const list = value as string[];
         if (!list.includes('penis')) newState.penisSize = [];
         if (!list.includes('vagina')) newState.vaginaSize = [];
      }

      // Reset hair style if length changes to prevent stale data
      if (key === 'hairLength' && prev.hairLength !== value) {
        newState.hairStyle = "";
      }
      return newState;
    });
  };

  const validateStep = (index: number) => {
    const step = steps[index];
    const invalid: string[] = [];

    if (step.sections) {
      step.sections.forEach(sec => {
        if (!sec.optional) {
          const val = state[sec.key];
          if (!val || (Array.isArray(val) && val.length === 0)) {
            invalid.push(sec.key as string);
          }
        }
      });
    }

    if (step.groups) {
      step.groups.forEach(grp => {
        // Validation Logic for Conditional Groups
        if (state.gender === 'other') {
           if (grp.key === 'penisSize' && !state.customAnatomy?.includes('penis')) return;
           if (grp.key === 'vaginaSize' && !state.customAnatomy?.includes('vagina')) return;
           if (grp.key === 'breastSize' && state.upperBodyPreference !== 'breasts') return;
           if (grp.key === 'breastShape' && state.upperBodyPreference !== 'breasts') return;
           if (grp.key === 'chestSize' && state.upperBodyPreference !== 'chest') return;
        }

        const val = state[grp.key];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          invalid.push(grp.key as string);
        }
      });
    }

    if (invalid.length > 0) {
      setInvalidKeys(invalid);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStepIndex)) return;

    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (nextIndex > maxStepReached) setMaxStepReached(nextIndex);
    } else {
      downloadFile(state);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setInvalidKeys([]); 
    }
  };
  
  const handleStartOver = () => {
    // Force a fresh state object
    setState({ ...getInitialState(), isNSFW: state.isNSFW }); 
    setCurrentStepIndex(0);
    setMaxStepReached(0);
    setInvalidKeys([]);
    // Increment reset count to force remount of components via key
    setResetCount(prev => prev + 1);
  };

  useEffect(() => {
    if (invalidKeys.length > 0) setShowErrorMsg(true);
    else setShowErrorMsg(false);
  }, [invalidKeys]);
  
  useEffect(() => {
    setShowErrorMsg(false);
  }, [currentStepIndex]);

  return (
    <div className="flex flex-col md:items-center md:justify-center min-h-screen bg-[#050505] md:p-4 font-inter">
      <div className="w-full md:max-w-6xl bg-[#09090b] md:border md:border-[#27272a] md:rounded-xl md:shadow-2xl flex flex-col md:flex-row h-[100dvh] md:h-[85vh] md:min-h-[600px] overflow-hidden relative">
        
        <Sidebar 
          steps={steps} 
          currentStepIndex={safeCurrentIndex}
          maxStepReached={maxStepReached}
          isNSFW={state.isNSFW}
          onJumpToStep={(idx) => { setCurrentStepIndex(idx); setInvalidKeys([]); }}
          onToggleNSFW={(val) => updateState('isNSFW', val)}
          onRandomize={handleRandomize}
          onStartOver={handleStartOver}
        />

        <div className="flex-grow flex flex-col relative bg-[#09090b] overflow-hidden">
          <div className="w-full h-1 bg-[#18181b] flex-shrink-0">
            <div 
              className="h-full bg-rose-500 transition-all duration-300" 
              style={{ width: `${((safeCurrentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="flex-grow p-4 md:p-8 overflow-y-auto relative scrollbar-thin">
             <div className="mb-6 md:mb-8 animate-fade-in">
               <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{steps[safeCurrentIndex].title}</h2>
               <p className="text-sm md:text-base text-zinc-400">{steps[safeCurrentIndex].desc}</p>
             </div>

             <StepContent 
               key={`${safeCurrentIndex}-${resetCount}`}
               step={steps[safeCurrentIndex]} 
               state={state} 
               updateState={updateState} 
               invalidKeys={invalidKeys}
             />
          </div>

          <div className="p-4 md:p-6 border-t border-[#27272a] bg-[#09090b] flex justify-between items-center z-10 flex-shrink-0">
            <button 
              onClick={handlePrev}
              disabled={safeCurrentIndex === 0}
              className={`px-4 md:px-6 py-2 rounded border border-[#3f3f46] text-xs md:text-sm font-medium transition 
                ${safeCurrentIndex === 0 ? 'invisible' : 'visible hover:bg-[#27272a] text-zinc-300'}`}
            >
              Back
            </button>
            
            <div className={`text-rose-500 text-xs md:text-sm font-bold transition-opacity duration-300 absolute left-1/2 transform -translate-x-1/2 ${showErrorMsg ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
              Required fields missing
            </div>

            <button 
              onClick={handleNext}
              className="px-6 md:px-8 py-2 rounded text-xs md:text-sm shadow-lg shadow-rose-900/20 bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors"
            >
              {safeCurrentIndex === steps.length - 1 ? "Download .txt" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;