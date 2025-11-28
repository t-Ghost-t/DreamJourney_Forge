
import { CharacterState } from './types';
import { BACKSTORY_ARCHETYPES } from './constants';
import { GoogleGenAI } from "@google/genai";

// --- HELPERS ---
export const lower = (str: string) => str ? str.toLowerCase() : "";
export const cap = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// Robust article detector
export const article = (str: string) => {
    if (!str) return "";
    const s = lower(str);
    // Silent H and specific starts
    if (/^(hour|honest|honor|8|11|18|8\d)/.test(s)) return "an";
    if (/^(uni|use|one|eu)/.test(s)) return "a"; // university, user, one, europe
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(s[0]) ? "an" : "a";
};

// Clean article if the value already starts with one (e.g. "an average cock" -> "average cock")
// Also handles user inputs like "The Loner" -> "Loner"
const stripArticle = (str: string) => str ? str.replace(/^(a|an|the)\s+/i, "") : "";

// Safe clean function for inputs that might have articles
const clean = (str: string) => stripArticle(lower(str));

// Converts "sighs" -> "sighing", "bites" -> "biting"
const toGerund = (str: string) => {
    const parts = str.split(' ');
    let verb = parts[0];
    
    // Convert to base first
    if (verb.endsWith('ches') || verb.endsWith('sses') || verb.endsWith('shes') || verb.endsWith('xes') || verb.endsWith('zes')) {
        verb = verb.slice(0, -2);
    } else if (verb.endsWith('ies')) {
        verb = verb.slice(0, -3) + 'y';
    } else if (verb.endsWith('s') && !verb.endsWith('ss')) {
         verb = verb.slice(0, -1);
    }

    // Then to gerund
    if (verb.endsWith('ie')) verb = verb.slice(0, -2) + 'ying';
    else if (verb.endsWith('e') && !verb.endsWith('ee')) verb = verb.slice(0, -1) + 'ing';
    else verb = verb + 'ing';
    
    parts[0] = verb;
    return parts.join(' ');
};

// Converts "touches" -> "touch", "tries" -> "try"
const toBaseVerb = (str: string) => {
    const parts = str.split(' ');
    let verb = parts[0];
    if (verb.endsWith('ches') || verb.endsWith('sses') || verb.endsWith('shes') || verb.endsWith('xes') || verb.endsWith('zes')) {
        verb = verb.slice(0, -2); 
    } else if (verb.endsWith('ies')) {
        verb = verb.slice(0, -3) + 'y'; 
    } else if (verb.endsWith('s') && !verb.endsWith('ss')) {
        verb = verb.slice(0, -1); 
    }
    parts[0] = verb;
    return parts.join(' ');
};

export const formatList = (arr: string[]) => {
    if (!arr || arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    const last = arr[arr.length - 1];
    const rest = arr.slice(0, -1);
    return `${rest.join(", ")}, and ${last}`;
};

const getSectionSeed = (baseSeed: number, ...args: any[]) => {
    const str = args.map(a => JSON.stringify(a)).join('');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash + baseSeed);
};

// --- DATA EXTRACTORS ---

const getHairPhrase = (s: CharacterState) => {
    if (s.hairLength === 'Bald') {
        const style = lower(s.hairStyle);
        // If the bald style is a noun phrase (e.g., "polished, smooth scalp"), add article
        if (style.includes('scalp') || style.includes('shave') || style.includes('cut') || style.includes('mohawk') || style.includes('fuzz') || style.includes('shadow')) {
             return `${article(style)} ${style}`;
        }
        return style || "a bald scalp"; 
    }
    const style = lower(s.hairStyle) || "natural style";
    const color = lower(s.hairColor) || "dark";
    const len = lower(s.hairLength) || "medium";
    
    // Plural styles do not need "a" (dreads, braids, waves)
    // Singular styles need "a" (bob, pixie cut, ponytail)
    const isPlural = ['waves', 'curls', 'braids', 'dreads', 'locks', 'cornrows', 'twists', 'buns', 'tails', 'ringlets', 'spikes', 'roots', 'sheets', 'mass'].some(k => style.includes(k));
    
    const articlePrefix = isPlural ? "" : `${article(style)} `;
    
    return `${len} ${color} hair worn in ${articlePrefix}${style}`;
};

const getNsfwDesc = (s: CharacterState, p: any, isPlural: boolean) => {
    const genderType = s.gender === 'female' ? 'female' : s.gender === 'male' ? 'male' : 'other';
    const pubic = clean(s.pubicStyle) || "natural";
    const pSize = formatList((s.penisSize || []).map(x => lower(x)));
    const vSize = formatList((s.vaginaSize || []).map(x => lower(x)));
    
    let genDesc = "";
    if (genderType === 'female') {
         const gStr = formatList((s.genitals || []).map(g => lower(g)));
         genDesc = gStr ? `${gStr} vulva` : "vulva";
    } else if (genderType === 'male') {
         const gStr = formatList((s.genitals || []).map(g => lower(g)));
         genDesc = gStr ? `${gStr} cock` : "cock";
    } else {
         const hasPenis = s.customAnatomy?.includes('penis');
         const hasVagina = s.customAnatomy?.includes('vagina');
         if (hasPenis && hasVagina) genDesc = `a ${pSize || 'average'} cock and a ${vSize || 'average'} vulva`;
         else if (hasPenis) genDesc = `a ${pSize || 'average'} cock`;
         else if (hasVagina) genDesc = `a ${vSize || 'average'} vulva`;
         else genDesc = "smooth anatomy";
    }

    const cleanGenDesc = stripArticle(genDesc);

    const isShape = ['landing strip', 'triangle', 'heart', 'lightning bolt'].some(x => pubic.includes(x));
    const isShaven = pubic === 'shaven';
    const vKeep = isPlural ? "keep" : "keeps";
    const vGroom = isPlural ? "groom" : "grooms";
    
    if (isShape) return `${p.Sub} ${vGroom} ${p.pos} pubic hair into a ${pubic}, framing ${p.pos} ${cleanGenDesc}`;
    if (isShaven) return `${p.Sub} ${vKeep} ${p.pos} pubic area shaven, exposing ${p.pos} ${cleanGenDesc}`;
    // Fallback for Natural/Hairy etc
    return `${p.Sub} ${vKeep} ${p.pos} pubic area ${pubic}, framing ${p.pos} ${cleanGenDesc}`;
};

const getFeaturesPhrase = (s: CharacterState) => {
    // Helper to join non-empty, comma separated
    const join = (...args: string[]) => args.filter(Boolean).join(", ");

    // 1. CHEST / BREASTS
    let chestDesc = "";
    // Check if user has breasts (Female OR Other+Breasts)
    if (s.gender === 'female' || (s.gender === 'other' && s.upperBodyPreference === 'breasts')) {
         const bSize = clean(s.breastSize);
         const bShape = clean(s.breastShape);
         const desc = join(bSize, bShape) || "average";
         // Breasts are plural, no article needed unless it acts as part of a larger noun phrase, 
         // but here we are listing features: "... characterized by large, round breasts..."
         chestDesc = `${desc} breasts`; 
    } else {
         // Male OR Other+Chest
         const cSize = clean(s.gender === 'male' ? s.topSize : s.chestSize);
         const desc = cSize || "average";
         chestDesc = `${article(desc)} ${desc} chest`;
    }

    // 2. REAR / LOWER BODY
    // Now unified for all genders
    const rSize = clean(s.buttSize);
    const rShape = clean(s.buttShape);
    let rearStr = join(rSize, rShape) || "average";
    
    // Rear is singular: "... and a round rear."
    const rearDesc = `${article(rearStr)} ${rearStr} rear`;

    return `${chestDesc} and ${rearDesc}`;
};

// --- TEMPLATE GENERATORS ---

const renderIntro = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.name, s.age, s.gender, s.role, s.ethnicity);
    const genderLabel = s.gender === 'female' ? 'woman' : s.gender === 'male' ? 'man' : (s.customGender ? clean(s.customGender) : 'person');
    const name = s.name || "Unknown";
    const role = clean(s.role);
    const arch = clean(s.archetype);
    const eth = clean(s.ethnicity) || "unknown";
    
    const skin = s.skinTone ? `, who has ${clean(s.skinTone)} skin` : "";
    
    const templates = [
        // V1: Classic Narrative
        () => `${name} is a ${s.age}-year-old ${genderLabel} of ${eth} heritage${skin}. Currently, ${p.sub} ${v('works', 'work')} as ${article(role)} ${role}, a position that suits ${p.pos} ${arch} personality.`,
        
        // V2: Reputation Focus
        () => `Known as ${article(role)} ${role} by trade, ${name} cuts a distinct figure. At ${s.age} years old, this ${genderLabel} carries the soul of ${article(arch)} ${arch}.`,
        
        // V3: Active Voice
        () => `Life as ${article(role)} ${role} has shaped ${name}, a ${s.age}-year-old ${genderLabel} of ${eth} descent. ${p.Sub} ${v('moves', 'move')} through the world with the instincts of ${article(arch)} ${arch}.`,
        
        // V4: Direct
        () => `${name} is ${article(role)} ${role} with ${eth} features${skin}. At ${s.age}, ${p.pos} demeanor is unmistakably that of ${article(arch)} ${arch}.`
    ];
    
    let text = templates[seed % templates.length]();
    if (s.relationship) text += ` To {{user}}, ${p.sub} ${v('is', 'are')} ${article(clean(s.relationship))} ${clean(s.relationship)}.`;
    return text;
};

const renderAppearance = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.hairLength, s.hairColor, s.hairStyle, s.eyeColor, s.bodyType);
    const name = s.name || "Unknown";
    const hair = getHairPhrase(s);
    const eyes = `${clean(s.eyeColor)} eyes`;
    const bodyAdj = clean(s.bodyType);
    const features = getFeaturesPhrase(s);
    const isPlural = s.pronouns === 'other';

    const isBald = s.hairLength === 'Bald';
    // Fix: "A polished scalp is exposed" vs "Medium hair frames the face"
    // getHairPhrase now includes articles for bald noun phrases
    const hairAction = isBald ? "is exposed" : "frames the face";
    
    // Capitalize Hair phrase correctly
    const hairCap = cap(hair);

    const templates = [
        // V1: Standard
        () => `${name} has ${article(bodyAdj)} ${bodyAdj} build defined by ${features}. ${p.Pos} face ${isBald ? 'features' : 'is framed by'} ${hair} and striking ${eyes}.`,
        
        // V2: Top Down
        () => `${hairCap} ${hairAction}, drawing attention to ${p.pos} ${eyes}. Below, ${p.pos} ${bodyAdj} frame is notable for ${features}.`,
        
        // V3: Atmospheric (Fixed missing features)
        () => `There is an intensity to ${name}, anchored by ${p.pos} ${eyes}. ${p.Pos} ${bodyAdj} physique is distinctive, marked by ${features}, while ${hair} creates a striking silhouette.`,
        
        // V4: Distinctive
        () => `${hairCap} and ${eyes} make ${name} hard to miss. ${p.Sub} ${v('has', 'have')} ${article(bodyAdj)} ${bodyAdj} figure with ${features}.`,

        // V5: Body First
        () => `${p.Sub} ${v('possesses', 'possess')} ${article(bodyAdj)} ${bodyAdj} figure, characterized by ${features}. ${p.Pos} face is highlighted by ${hair} and ${eyes}.`
    ];

    let text = templates[seed % templates.length]();
    if (s.isNSFW) text += ` ${getNsfwDesc(s, p, isPlural)}.`;
    return text;
};

const renderSpeech = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.speechStyle, s.nickname, JSON.stringify(s.mannerisms));
    const name = s.name || "Unknown";
    const style = clean(s.speechStyle);
    const tonePhrase = `${article(style)} ${style} tone`;
    const nickname = s.nickname ? s.nickname.replace(/^"|"$/g, '') : "you"; 

    let mText = "";
    if (s.mannerisms && s.mannerisms.length > 0) {
        const rawMannerisms = s.mannerisms.map(m => {
            let str = lower(m);
            if (str.includes("hair")) return `plays with ${p.pos} hair`;
            if (str.includes("arms")) return `crosses ${p.pos} arms`;
            if (str.includes("lip")) return `bites ${p.pos} lip`;
            if (str.includes("touches user")) return `touches {{user}}`;
            return str;
        });
        const gerundList = rawMannerisms.map(m => toGerund(m));
        
        const mTemplates = [
            () => ` ${p.Sub} often ${v('pauses', 'pause')} to ${formatList(rawMannerisms.map(m => toBaseVerb(m)))}.`,
            () => ` ${p.Sub} ${v('has', 'have')} a habit of ${formatList(gerundList)}.`,
            () => ` Conversation is often punctuated by ${formatList(gerundList)}.`
        ];
        mText = mTemplates[seed % mTemplates.length]();
    }

    const templates = [
        () => `${name} speaks in ${tonePhrase}.`,
        () => `The way ${name} talks is defined by ${tonePhrase}.`,
        () => `${name} usually adopts ${tonePhrase} in conversation.`
    ];

    let text = templates[seed % templates.length]();
    
    if (s.nickname) {
        text += ` ${p.Sub} ${v('refers', 'refer')} to {{user}} as "${nickname}".`;
    }
    
    text += mText;
    return text;
};

const renderAttire = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.fashionVibe, s.bodyType, s.role);
    const style = clean(s.fashionVibe);
    const body = clean(s.bodyType);
    const role = clean(s.role);
    
    const templates = [
        () => `${p.Pos} wardrobe leans heavily into the ${style} aesthetic. The clothes are chosen to accentuate ${p.pos} ${body} frame.`,
        () => `${p.Sub} ${v('dresses', 'dress')} in a ${style} style. It is a look that fits ${p.pos} role as ${article(role)} ${role} while flattering ${p.pos} ${body} build.`,
        () => `Unapologetically ${style}, ${p.pos} outfit wraps tightly around ${article(body)} ${body} figure, making a statement.`
    ];
    return templates[seed % templates.length]();
};

const renderLifestyle = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.role, JSON.stringify(s.hobbies));
    const name = s.name || "Unknown";
    const role = clean(s.role);
    const hobbies = s.hobbies && s.hobbies.length > 0 ? formatList(s.hobbies.map(h => lower(h))) : "";
    const hobbiesPlural = s.hobbies && s.hobbies.length > 1;

    if (!hobbies) {
        return `Life as ${article(role)} ${role} keeps ${name} busy.`;
    }

    const templates = [
        () => `Dedication to being ${article(role)} ${role} defines ${name}'s schedule. Yet, ${p.sub} ${v('remains', 'remain')} devoted to ${hobbies}.`,
        () => `While ${name} works as ${article(role)} ${role}, ${p.pos} real passion lies elsewhere. ${cap(hobbies)} ${hobbiesPlural ? 'allow' : 'allows'} ${p.obj} to relax.`,
        () => `Striking a balance between work and life, ${name} spends free time on ${hobbies}.`
    ];

    return templates[seed % templates.length]();
};

const renderBackstory = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.backstoryType, s.motivation, s.role);
    const name = s.name || "Unknown";
    const role = clean(s.role);
    
    // Check for custom snippet if provided, otherwise fallback to lookup
    let snippet = s.customBackstorySnippet || "";
    
    if (!snippet && s.backstoryType && BACKSTORY_ARCHETYPES[s.backstoryType]) {
        snippet = BACKSTORY_ARCHETYPES[s.backstoryType];
    }
    
    // Process snippet pronouns
    if (snippet) {
        if (s.pronouns !== 'other') {
            snippet = snippet.replace(/\bthem\b/gi, p.obj);
            snippet = snippet.replace(/\btheir\b/gi, p.pos);
            snippet = snippet.replace(/\bthemselves\b/gi, p.ref);
            snippet = snippet.replace(/\bthey\b/gi, p.sub);
            // Fix conjugations for singular
            snippet = snippet.replace(/\bwere\b/gi, 'was');
        } else {
            snippet = snippet.replace(/\bhimself|herself\b/gi, 'themselves');
            // Fix conjugations for plural
            snippet = snippet.replace(/\bwas\b/gi, 'were');
        }
    }
    
    const type = clean(s.backstoryType);
    const introTemplates = [
        () => `${name} became ${article(role)} ${role} through a twist of fate.`,
        () => `Necessity demanded ${name} become ${article(role)} ${role}.`,
        () => `Ambition drove ${name} to the station of ${article(role)} ${role}.`,
        () => `Years of discipline molded ${name} into ${article(role)} ${role}.`
    ];
    
    let text = introTemplates[seed % introTemplates.length]();

    if (snippet) {
         if (['sheltered', 'mystery'].includes(type)) {
            text += ` ${p.Sub} ${v('is', 'are')} ${type === 'sheltered' ? 'a sheltered soul' : 'shrouded in mystery'}; ${p.sub} ${snippet}.`;
        } else {
            text += ` ${p.Sub} ${v('is', 'are')} ${article(type)} ${type}; ${p.sub} ${snippet}.`;
        }
    }

    if (s.motivation) {
        let motiv = s.motivation;
        if (s.pronouns !== 'other') {
            motiv = motiv.replace(/\btheir\b/gi, p.pos).replace(/\bthey\b/gi, p.sub);
        }
        text += `\n\nCurrent Goal: ${cap(motiv)}.`;
    }
    return text;
};

const renderSexual = (s: CharacterState, p: any, v: any) => {
    const seed = getSectionSeed(s.rephraseSeed || 0, s.domSub, s.topBottom, JSON.stringify(s.kinks));
    let role = clean(s.domSub); 
    
    // Fix for slash options
    if (role === 'mommy/daddy') {
        if (p.sub === 'she') role = 'mommy';
        else if (p.sub === 'he') role = 'daddy';
        else role = 'caregiver'; // neutral term
    }

    const pos = clean(s.topBottom);
    const kinks = (s.kinks || []).map(k => lower(k));

    let posPhrase = "";
    if (pos === 'versatile') posPhrase = `${v('is', 'are')} versatile in bed`;
    else if (pos === 'pillow princess') posPhrase = `${v('acts', 'act')} as a pillow princess`;
    else if (pos === 'passive') posPhrase = `${v('is', 'are')} passive in bed`;
    else if (pos) posPhrase = `${v('prefers', 'prefer')} to be a ${pos}`;

    // Sentence construction logic
    let sentence = "";
    if (role && posPhrase) {
        sentence = `${p.Sub} ${v('is', 'are')} ${article(role)} ${role} who ${posPhrase}.`;
    } else if (role) {
        sentence = `${p.Sub} ${v('is', 'are')} ${article(role)} ${role}.`;
    } else if (posPhrase) {
        sentence = `${p.Sub} ${posPhrase}.`;
    }

    if (kinks.length > 0) {
        const kStr = formatList(kinks);
        const kTemplates = [
            () => ` Additionally, ${p.sub} ${v('is', 'are')} interested in ${kStr}.`,
            () => ` ${p.Sub} also ${v('has', 'have')} a keen interest in ${kStr}.`
        ];
        
        if (sentence) {
            sentence += kTemplates[seed % kTemplates.length]();
        } else {
            sentence = `Intimacy for ${p.obj} often involves ${kStr}.`;
        }
    }

    return sentence ? `## Sexual Quirks\n${sentence}` : "";
};

// --- MAIN GENERATOR ---
export const generateTextParts = (s: CharacterState) => {
    const isPlural = s.pronouns === 'other';
    let p = {
        sub:'they', obj:'them', pos:'their', ref: 'themselves',
        Sub:'They', Pos:'Their'
    };
    if (s.pronouns === 'female') p = {sub:'she', obj:'her', pos:'her', ref: 'herself', Sub:'She', Pos:'Her'};
    if (s.pronouns === 'male') p = {sub:'he', obj:'him', pos:'his', ref: 'himself', Sub:'He', Pos:'His'};

    const v = (singular: string, plural: string) => isPlural ? plural : singular;

    // Header (Static)
    const tropes = (s.tropes || []).map(t => lower(t));
    const hairDesc = s.hairLength === 'Bald' ? 'bald scalp' : `${lower(s.hairLength)} hair`;
    const header = `[Name: ${s.name || "Unknown"}; Persona: ${clean(s.archetype)}, ${clean(s.role)}; Appearance: ${hairDesc}, ${clean(s.eyeColor)} eyes, ${clean(s.bodyType)} build; Tropes: ${formatList(tropes)}; Genre: ${s.genre}]`;

    // Sections
    const intro = renderIntro(s, p, v);
    const appearance = renderAppearance(s, p, v);
    const speech = renderSpeech(s, p, v);
    const attire = renderAttire(s, p, v);
    const lifestyle = renderLifestyle(s, p, v);
    const backstory = renderBackstory(s, p, v);
    const sexual = s.isNSFW ? renderSexual(s, p, v) : "";

    const personaSection = `## Persona\n${header}\n\n${intro}`;
    
    const detailsSection = `## Appearance
${appearance}

## Speech and Mannerisms
${speech}

## Attire and Style
${attire}

## Hobbies and Occupation
${lifestyle}

## Backstory
${backstory}

${sexual}`;

    return {
        persona: personaSection,
        details: detailsSection,
        full: `${personaSection}\n\n${detailsSection}`.trim()
    };
};

export const generateText = (s: CharacterState): string => {
    return generateTextParts(s).full;
};

// --- HELPER FOR UI SPLIT ---
export const parseEnhancedOutput = (text: string) => {
    if (!text) return { persona: "", details: "" };
    
    // Attempt to split by ## Appearance
    const splitIndex = text.indexOf("## Appearance");
    
    if (splitIndex !== -1) {
        return {
            persona: text.substring(0, splitIndex).trim(),
            details: text.substring(splitIndex).trim()
        };
    }
    
    return { persona: text, details: "" };
};

export const validateApiKey = (key: string): boolean => {
    if (!key) return false;
    const trimmed = key.trim();
    return trimmed.startsWith("AIza") && trimmed.length > 30;
};

export const verifyApiKey = async (apiKey: string): Promise<boolean> => {
    if (!validateApiKey(apiKey)) return false;
    
    // We strictly use the provided apiKey by trimming it. 
    // This helps prevent cases where surrounding whitespace might be ignored by some checks but fail others.
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    try {
        // Lightweight test call
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: 'Test' }] },
            config: { maxOutputTokens: 1, thinkingConfig: { thinkingBudget: 0 } }
        });
        
        // Ensure we actually got a response, otherwise it might be a silent failure.
        if (!response || !response.text) {
             return false;
        }
        return true;
    } catch (error) {
        console.error("API Key verification failed:", error);
        return false;
    }
};

// --- AI ENHANCEMENT ---

const ENHANCING_GUIDELINE = `
This document outlines how to convert character information from any format into the standardized structure.

## Document Structure

The character document is divided into several key sections. The primary sections, in order, are:

1. Persona (starts with ## Persona)
2. Appearance (starts with ## Appearance)
3. Speech and Mannerisms (starts with ## Speech and Mannerisms)
4. Attire and Style (starts with ## Attire and Style)
5. Hobbies and Occupation (starts with ## Hobbies and Occupation)
6. Backstory (starts with ## Backstory)
7. Additional Insights (starts with ## Additional Insights)
8. Sexual Quirks (starts with ## Sexual Quirks) - Include ONLY if the content is NSFW.
`;

export const enhanceCharacterWithAI = async (state: CharacterState, apiKey: string): Promise<string> => {
    // Strictly use the passed API key to avoid accidental environment variable leakage
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const { full } = generateTextParts(state);
    
    const prompt = `${ENHANCING_GUIDELINE}

    Input Character Data:
    ${JSON.stringify(state, null, 2)}

    Current Generated Draft:
    ${full}

    Instructions:
    Rewrite the character profile to be vivid, engaging, and professionally written. 
    Follow the section headers defined in the Document Structure.
    Expand on the provided details with creative flair, but do not contradict the facts.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "";
};

export const downloadFile = (state: CharacterState) => {
    const { full } = generateTextParts(state);
    const element = document.createElement("a");
    const file = new Blob([full], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${state.name || "character"}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
};