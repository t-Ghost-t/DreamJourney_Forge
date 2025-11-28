# Character Forge Option Phrasing Guide

This document outlines the grammatical rules for adding new options to `constants.ts` or `App.tsx`. Because the application uses a strict sentence template system, adhering to these rules is critical for natural-sounding natural language generation.

## General Rules
1. **Lowercase**: Almost all values should be lowercased (unless they are proper nouns like "German"). The engine handles capitalization at the start of sentences.
2. **No Articles**: Do not include "a", "an", or "the" in the value. The engine calculates these automatically.
3. **No Punctuation**: Do not include periods at the end of values.

---

## Identity & Roles

### Role / Occupation
* **Template**: `{{Name}} works as [article] [role].` / `...life as [article] [role].`
* **Rule**: Noun phrase.
* **Bad**: "is a student", "Studying"
* **Good**: "student", "knight", "corporate executive"

### Gender (Custom)
* **Template**: `{{Name}} is [article] [age]-year-old [gender]...`
* **Rule**: Noun.
* **Good**: "demigod", "android", "non-binary person"

---

## Appearance

### Hair Style
* **Context**: Used in two ways based on keywords (mass noun vs singular).
* **Template A (Singular)**: `...hair, worn in [article] [style].`
* **Template B (Mass)**: `...hair, which falls in [style].`
* **Rule**: Noun phrase describing the style.
* **Good**: "pixie cut", "high ponytail", "messy waves"

### Body Type
* **Template**: `...possesses [article] [type] physique.`
* **Rule**: Adjective.
* **Good**: "slim", "muscular", "chubby"

### Custom Gender Body Parts
* **Torso**: `features [article] [value] torso.`
* **Lower Body**: `and [value] lower body.`
* **Rule**: Adjective. Avoid nouns like "large breast" (which becomes "features a large breast torso" - incorrect).
* **Good**: "small-breasted", "broad", "wide", "curvy"

---

## Personality & Habits

### Mannerisms
* **Template**: `{{He/She}} often [mannerism].`
* **Rule**: Verb phrase, 3rd person singular present tense.
* **Note**: Any mentions of "hair", "arms", or "face" are post-processed to inject pronouns, so you can just write the noun.
* **Good**: "bites lip", "crosses arms", "avoids eye contact"

### Hobbies
* **Template**: `...finds time for [hobby].`
* **Rule**: Noun or Gerund (Verb+ing).
* **Good**: "gaming", "the occult", "taxidermy"

---

## Backstory

### Backstory Type (Key)
* **Template**: `{{He/She}} is [article] [Type]; ...`
* **Rule**: Noun.
* **Good**: "Survivor", "Prodigy"

### Backstory Snippet (Value)
* **Template**: `{{He/She}} is [article] [Type]; {{he/she}} [snippet].`
* **Rule**: Full sentence fragment starting with a **verb** (usually past tense).
* **Good**: "fought through a difficult past", "grew up in a lab"
* **Bad**: "As a survivor...", "She fought..." (Do not repeat the subject)

---

## NSFW (Intimacy)

### Role (Dom/Sub)
* **Template**: `{{He/She}} is [article] [role]...`
* **Rule**: Noun.
* **Good**: "switch", "submissive", "brat"

### Position
* **Template**: `...who prefers to [value].`
* **Rule**: Verb (infinitive without 'to').
* **Exceptions**: "versatile" and "pillow princess" have hardcoded overrides in `utils.ts`.
* **Good**: "top", "bottom", "power bottom"

### Kinks
* **Template**: `...particularly interested in [kink].`
* **Rule**: Noun phrase.
* **Good**: "breeding", "praise", "sensory deprivation"
