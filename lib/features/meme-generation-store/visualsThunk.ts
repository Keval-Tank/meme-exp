"use client"
import { createAsyncThunk } from "@reduxjs/toolkit";
import Replicate from "replicate"
import { groq } from "@/app/actions/index-data";
import { generateText } from "ai";
import { generateImagePrompt } from "@/app/actions/generate-image-prompt";

// const replicate = new Replicate({
//     auth : process.env.REPLICATE_AUTH_TOKEN
// })

 export const characters_data = {
    "data": {
        "brand_characters": [
            {
                "id": "char_001",
                "character_name": "Axel Blaze",
                "zodiac_sign": "Aries",
                "character_description": "A fiery, muscular male in his late 20s with sharp jawline and intense piercing eyes. Shoulder-length crimson-red hair tied in a half-bun, or closely cropped and styled upward. Wears bold red leather jacket over black graphic tee, combat boots, and silver chain accessories. Has visible tattoos on arms depicting flames or warrior symbols. Exudes confident, go-getter energy with a slight smirk.",
                "zodiac_traits": ["courageous", "passionate", "competitive", "impulsive", "bold", "direct"],
                "character_personality": "Axel is the initiator and trailblazer—always first to jump into action without overthinking. They're fearless, confrontational, and love a good challenge. Their humor is direct, sometimes cutting, but never malicious. They inspire others through their confidence and don't tolerate slow pace or weakness.",
                "tone": ["bold", "aggressive", "competitive", "motivational", "impatient", "humorous sarcasm"],
                "behavioral_traits": ["takes charge immediately", "speaks first thinks later", "thrives on competition", "gets bored easily", "jumps to conclusions", "inspires through action"],
                "use_cases": ["motivation memes", "competitive scenarios", "action-packed narratives", "startup culture", "gym/fitness", "call-outs", "challenges"],
                "tags": ["warrior", "leader", "impulsive", "bold", "action", "competition", "fire_energy"],
                "keywords": ["Aries", "fire", "warrior", "bold", "courage", "action", "leader", "challenge"],
                "meme_scenarios": ["first to try something risky", "calling out laziness", "competing for spotlight", "hype man energy", "no fear attitude", "pushing boundaries"],
                "name_rationale": "Axel = axe-wielding warrior energy; Blaze = fire and passion"
            },
            {
                "id": "char_002",
                "character_name": "Sterling Oak",
                "zodiac_sign": "Taurus",
                "character_description": "A sturdy, grounded male in his early 30s with warm brown eyes and a calm, reassuring presence. Thick, neat dark brown hair, strong facial features with a well-groomed beard. Wears quality earth-tone clothing—caramel sweater, tan chinos, expensive leather shoes. Carries himself with ease and stability. Often seen holding coffee or luxury items. Aesthetic is 'reliable and affluent'.",
                "zodiac_traits": ["reliable", "patient", "practical", "stable", "sensual", "stubborn", "materialistic"],
                "character_personality": "Sterling is the solid foundation everyone leans on. They're methodical, patient, and value quality and comfort. They don't rush decisions and stick to their guns—sometimes to a fault. Their humor is dry, rooted in reality, and they find amusement in life's simple pleasures. Deeply loyal but can be possessive.",
                "tone": ["steady", "dry wit", "practical", "comfort-seeking", "grounded", "patient", "slightly stubborn"],
                "behavioral_traits": ["takes time to decide", "loyal to the end", "resistant to change", "loves comfort and luxury", "slow to anger but explosive when pushed", "values stability over risk"],
                "use_cases": ["stability vs chaos", "comfort food culture", "relationship loyalty", "financial decisions", "slow and steady wins race", "stubbornness", "quality over speed"],
                "tags": ["reliable", "stable", "stubborn", "luxury", "comfort", "foundation", "grounded"],
                "keywords": ["Taurus", "earth", "stable", "practical", "loyal", "comfort", "quality", "steady"],
                "meme_scenarios": ["refusing to change plans", "defending comfort choices", "loyalty tests", "picking quality over trend", "moving at own pace", "comfort food justification"],
                "name_rationale": "Sterling = high-quality precious metal; Oak = strong, ancient tree symbolizing stability"
            },
            {
                "id": "char_003",
                "character_name": "Pixel Jasper",
                "zodiac_sign": "Gemini",
                "character_description": "An animated, youthful character in mid-20s with expressive facial features and constantly changing expressions. Light skin tone, honey-blonde or brunette hair—styled in a modern, sometimes mismatched way (one side shaved, other side long, or constantly dyed different colors). Wears eclectic, pattern-mixed outfits—oversized vintage tees, colorful sneakers, multiple piercings and rings. Always seems to be gesturing or moving. Dual nature—can appear both innocent and mischievous simultaneously.",
                "zodiac_traits": ["communicative", "curious", "adaptable", "inconsistent", "superficial", "clever", "restless"],
                "character_personality": "Pixel is the multi-tasker and conversationalist. They thrive on variety, novelty, and communication. They know a little about everything and love to share it. Their humor is quick-witted, clever, and often sarcastic. They get bored easily and jump between topics. Can seem scattered but are actually brilliant at connecting dots others miss.",
                "tone": ["witty", "sarcastic", "scattered", "energetic", "playful", "gossipy", "quick-witted"],
                "behavioral_traits": ["talks excessively", "changes mind frequently", "curious about everything", "makes jokes constantly", "gets bored quickly", "excellent at networking", "spreads information (gossip)"],
                "use_cases": ["conversation chaos", "multi-tasking failures", "gossip and tea", "quick changes of opinion", "clever wordplay", "juggling projects", "curiosity memes"],
                "tags": ["communicator", "clever", "scattered", "witty", "curious", "adaptable", "gossip"],
                "keywords": ["Gemini", "air", "communication", "clever", "curious", "adaptable", "scattered", "gossip"],
                "meme_scenarios": ["starting multiple projects not finishing one", "spreading tea/gossip", "changing opinion mid-sentence", "info-dumping about obscure topics", "juggling conversations", "witty comebacks"],
                "name_rationale": "Pixel = digital, connected, scattered bits of data; Jasper = gemstone with multiple colors, changeable and varied"
            },
            {
                "id": "char_004",
                "character_name": "Luna Heartwell",
                "zodiac_sign": "Cancer",
                "character_description": "A soft, approachable female in late 20s with round facial features and warm, soulful eyes. Pale or light complexion with long, flowing hair (brown, sandy blonde, or black)—often in waves or braids. Wears cozy, soft textures—oversized cardigans, comfortable sweaters, vintage dresses, fuzzy socks. Often photographed with comfort items like tea, blankets, or pets. Expression is gentle and concerned, sometimes wistful. Radiates maternal, protective energy.",
                "zodiac_traits": ["emotional", "nurturing", "protective", "moody", "intuitive", "clingy", "family-oriented"],
                "character_personality": "Luna is the caregiver and emotional anchor. They lead with their heart and are deeply intuitive about others' feelings. They're fiercely protective of loved ones but can retreat into their shell when hurt. Their humor is gentle, often self-deprecating, and rooted in shared emotional experiences. They remember everything and hold grudges quietly.",
                "tone": ["caring", "emotional", "protective", "moody", "nostalgic", "empathetic", "self-sacrificing"],
                "behavioral_traits": ["puts others first", "remembers every detail", "mood-dependent energy", "holds grudges quietly", "overly sensitive to criticism", "creates safe spaces", "deeply intuitive"],
                "use_cases": ["emotional support narratives", "family loyalty", "protecting loved ones", "mood swings", "self-sacrifice", "nostalgic memories", "comfort and care"],
                "tags": ["nurturer", "emotional", "protective", "moody", "intuitive", "family", "caring"],
                "keywords": ["Cancer", "water", "emotional", "nurturing", "protective", "intuitive", "moody", "home"],
                "meme_scenarios": ["sacrificing for others", "remembering old hurts", "sudden mood shifts", "protecting friends fiercely", "emotional support role", "guilt-tripping with love"],
                "name_rationale": "Luna = moon, intuitive and emotional; Heartwell = heart-centered, caring nature"
            },
            {
                "id": "char_005",
                "character_name": "Apollo King",
                "zodiac_sign": "Leo",
                "character_description": "A charismatic, striking male in early 30s with commanding presence and confident posture. Golden or sandy blonde hair—voluminous, styled with pride, sometimes maned or long. Warm tan or olive skin tone with bright, expressive eyes. Wears statement pieces—gold jewelry, silk shirts, designer clothes, luxury watches. Always impeccably groomed. Center-of-attention aesthetic with dramatic flair. Expression ranges from regal to playfully mischievous.",
                "zodiac_traits": ["confident", "creative", "generous", "arrogant", "attention-seeking", "proud", "dramatic"],
                "character_personality": "Apollo is the star and natural performer. They love the spotlight and aren't shy about pursuing admiration. They're generous to those they care about and fiercely loyal. Their humor is bold, theatrical, and often self-promotional. They take criticism personally and need constant validation, but their infectious enthusiasm lifts others up.",
                "tone": ["confident", "theatrical", "generous", "dramatic", "playful", "proud", "attention-seeking"],
                "behavioral_traits": ["seeks admiration constantly", "generous with loved ones", "takes center stage naturally", "sensitive to criticism", "creates memorable moments", "motivates through passion", "sometimes self-centered"],
                "use_cases": ["spotlight stealing", "showoff moments", "confidence and bravado", "generous gestures", "dramatic declarations", "attention-seeking", "creative pursuits"],
                "tags": ["performer", "confident", "dramatic", "generous", "proud", "creative", "spotlight"],
                "keywords": ["Leo", "fire", "confident", "generous", "creative", "dramatic", "spotlight", "pride"],
                "meme_scenarios": ["stealing the spotlight", "needing validation", "showing off skills", "generous but expecting praise", "dramatic reactions", "being the main character"],
                "name_rationale": "Apollo = Greek god of sun, light, and glory; King = ruler, authority, deserving admiration"
            },
            {
                "id": "char_006",
                "character_name": "Sage Winters",
                "zodiac_sign": "Virgo",
                "character_description": "A precise, detail-oriented female in mid-20s with sharp, intelligent eyes and composed demeanor. Fair complexion with neat, practical hair styling—usually pulled back, straightened, or in a no-nonsense ponytail. Light or neutral earth-tone clothing—crisp white blouse, minimalist jewelry, organized aesthetic. Often carrying notebooks, planners, or glasses. Expression is observant and slightly critical. Radiates 'I have it all figured out' energy.",
                "zodiac_traits": ["analytical", "organized", "practical", "critical", "perfectionist", "modest", "service-oriented"],
                "character_personality": "Sage is the analyst and perfectionist. They notice everything and can't help pointing out flaws—in systems, plans, and yes, people. They're organized, practical, and genuinely helpful when they care about something. Their humor is witty and observational, often poking fun at inefficiency or illogic. They can seem cold but are deeply caring underneath.",
                "tone": ["critical", "analytical", "dry", "organized", "practical", "perfectionistic", "helpful"],
                "behavioral_traits": ["notices everything", "corrects constantly", "loves organization", "struggles with perfectionism", "overly analytical", "quietly helpful", "difficulty with feelings"],
                "use_cases": ["pointing out obvious flaws", "organizing chaos", "productivity hacks", "correcting people", "analysis paralysis", "service and help", "quality control"],
                "tags": ["analyst", "organized", "critical", "perfectionist", "practical", "detailed", "logical"],
                "keywords": ["Virgo", "earth", "analytical", "organized", "practical", "perfectionist", "detail", "critical"],
                "meme_scenarios": ["correcting everyone constantly", "organizing chaos", "finding flaws in perfect things", "over-analyzing situations", "productivity obsession", "service without recognition"],
                "name_rationale": "Sage = wise, analytical, herbal remedy for ailments; Winters = cold, precise, minimal aesthetic"
            },
            {
                "id": "char_007",
                "character_name": "Iris Haven",
                "zodiac_sign": "Libra",
                "character_description": "An attractive, balanced character in late 20s with symmetrical facial features and charming demeanor. Medium skin tone, perfectly styled hair—often balanced aesthetic, sometimes split dyed or symmetrically arranged. Wears aesthetically pleasing, fashionable outfits—designer brands, coordinated colors, trendy accessories. Radiates grace and social ease. Expression is always diplomatic, weighing options carefully. Present an 'Instagram-perfect' image.",
                "zodiac_traits": ["diplomatic", "aesthetic-focused", "indecisive", "people-pleasing", "charming", "superficial", "fair-minded"],
                "character_personality": "Iris is the diplomat and peacemaker. They see multiple perspectives and struggle to make decisions because both sides seem valid. They're charming, social, and hate conflict. Their humor is pleasant and inclusive, though sometimes lacking depth. They value appearance and aesthetics highly and can be superficial, but genuinely want everyone to get along.",
                "tone": ["diplomatic", "charming", "indecisive", "aesthetic", "people-pleasing", "gracious", "balanced"],
                "behavioral_traits": ["can't make decisions", "seeks approval constantly", "peacemaker nature", "prioritizes appearance", "socially graceful", "avoids conflict obsessively", "weighs options endlessly"],
                "use_cases": ["indecision paralysis", "aesthetics and fashion", "mediating conflicts", "people-pleasing fails", "balanced takes", "relationship dynamics", "weighing pros/cons"],
                "tags": ["diplomat", "indecisive", "aesthetic", "charming", "balanced", "people-pleaser", "social"],
                "keywords": ["Libra", "air", "balanced", "diplomatic", "indecisive", "aesthetic", "charming", "fair"],
                "meme_scenarios": ["unable to choose between options", "seeing both sides of argument", "mediating drama", "aesthetic obsession", "people-pleasing leading to problems", "waiting for others' opinions"],
                "name_rationale": "Iris = rainbow (balance of colors); Haven = safe place, sanctuary of peace and harmony"
            },
            {
                "id": "char_008",
                "character_name": "Raven Obsidian",
                "zodiac_sign": "Scorpio",
                "character_description": "An intense, mysterious character in early 30s with penetrating gaze and magnetic presence. Deep tan or olive complexion with sharp facial features and strong bone structure. Dark hair (black, deep brown)—sleek, sometimes long, often styled dramatically. Wears dark, edgy clothing—black leather, burgundy, deep jewel tones, mysterious accessories like rings or chains. Expression is calculating and intense. Radiates danger and allure simultaneously.",
                "zodiac_traits": ["intense", "secretive", "passionate", "vengeful", "mysterious", "jealous", "powerful"],
                "character_personality": "Raven is the enigma and powerhouse. They feel everything intensely but reveal little. They're strategic, observant, and don't forgive easily. Their humor is dark, cutting, and sometimes cruel—but hilarious to those in the inner circle. They're fiercely loyal to their chosen few but ruthless to enemies. Mystery is their brand.",
                "tone": ["intense", "dark humor", "secretive", "calculated", "powerful", "mysterious", "vengeful"],
                "behavioral_traits": ["reveals nothing", "holds grudges forever", "passionately invested", "strategic thinker", "magnetic but intimidating", "dark humor", "fiercely protective of few"],
                "use_cases": ["mystery and secrets", "dark humor", "revenge narratives", "intensity and passion", "calculated moves", "protective of inner circle", "power dynamics"],
                "tags": ["mysterious", "intense", "powerful", "secretive", "dark", "calculated", "vengeful"],
                "keywords": ["Scorpio", "water", "intense", "secretive", "mysterious", "powerful", "dark", "revenge"],
                "meme_scenarios": ["holding grudges eternally", "mysterious inner knowledge", "intense loyalty tests", "dark jokes", "calculated revenge", "knowing everyone's secrets"],
                "name_rationale": "Raven = dark, mysterious bird; Obsidian = dark volcanic glass, sharp and intense"
            },
            {
                "id": "char_009",
                "character_name": "Sage Phoenix",
                "zodiac_sign": "Sagittarius",
                "character_description": "An adventurous, energetic character in late 20s with restless energy and infectious enthusiasm. Sun-kissed or tanned complexion with warm, sparkling eyes full of wanderlust. Hair is often flowing, sun-bleached, or in adventure-friendly styles—dreadlocks, braids, or loose waves. Wears travel-ready, boho-inspired clothing—colorful patterns, adventure gear, cultural accessories from different countries. Expression is perpetually curious and playful. Radiates freedom and optimism.",
                "zodiac_traits": ["adventurous", "optimistic", "honest", "reckless", "tactless", "philosophical", "freedom-loving"],
                "character_personality": "Phoenix is the adventurer and truth-teller. They crave freedom, new experiences, and wisdom. They're optimistic to a fault and believe everything will work out. Their humor is loud, often laugh-out-loud funny, and involves brutal honesty. They can be tactless and irresponsible but inspire others to take risks and explore.",
                "tone": ["adventurous", "optimistic", "honest", "loud", "playful", "reckless", "philosophical"],
                "behavioral_traits": ["tells brutal truths", "optimistic always", "plans spontaneously", "offends without malice", "inspires adventure", "seeks freedom", "commitment-phobic"],
                "use_cases": ["travel adventures", "blunt honesty", "optimism in chaos", "spontaneous decisions", "reckless fun", "inspiring others", "freedom-seeking"],
                "tags": ["adventurer", "optimistic", "honest", "free-spirited", "reckless", "philosophical", "wanderer"],
                "keywords": ["Sagittarius", "fire", "adventurous", "optimistic", "free", "honest", "reckless", "wanderer"],
                "meme_scenarios": ["spontaneous travel decisions", "saying offensive truths", "optimism in disaster", "commitment anxiety", "inspiring risky behavior", "cultural misunderstandings abroad"],
                "name_rationale": "Phoenix = mythical bird reborn from ashes, symbolizing freedom and adventure; Sage = wisdom, philosophy"
            },
            {
                "id": "char_010",
                "character_name": "Victor Stone",
                "zodiac_sign": "Capricorn",
                "character_description": "An ambitious, serious character in early-to-mid 30s with composed demeanor and goal-focused presence. Fair or medium complexion with strong, structured facial features. Dark or black hair—neatly styled, professional cut, sometimes greying at temples. Wears formal, high-quality business attire—tailored suits, expensive watches, leather accessories. Expression is focused and calculating. Radiates 'climbing the ladder' energy with zero nonsense.",
                "zodiac_traits": ["ambitious", "disciplined", "responsible", "pessimistic", "cold", "status-focused", "patient"],
                "character_personality": "Victor is the climber and pragmatist. They have a master plan and execute it methodically. They're responsible, reliable, and take everything seriously. Their humor is dry, often rooted in cynicism or dark observations. They struggle with work-life balance and emotions but are deeply committed to their goals. Success is their language.",
                "tone": ["serious", "pragmatic", "disciplined", "dry", "cynical", "cold", "goal-oriented"],
                "behavioral_traits": ["always working", "plans everything meticulously", "emotionally reserved", "respects authority and structure", "pessimistic about timelines", "takes self too seriously", "measures success constantly"],
                "use_cases": ["corporate ladder", "work obsession", "pessimism", "long-term planning", "discipline and sacrifice", "climbing status", "responsibility"],
                "tags": ["ambitious", "serious", "disciplined", "pragmatic", "cold", "goal-focused", "climber"],
                "keywords": ["Capricorn", "earth", "ambitious", "disciplined", "pragmatic", "serious", "climber", "success"],
                "meme_scenarios": ["working while others play", "long-term planning obsession", "pessimistic predictions", "sacrificing fun for goals", "measuring self-worth by success", "micromanaging projects"],
                "name_rationale": "Victor = conqueror, winner, ambitious achiever; Stone = solid, cold, impenetrable like stone"
            }
        ],
        "meta": {
            "total_characters": 10,
            "format": "Zodiac-based brand characters with unique names",
            "purpose": "Meme generation with astrological archetypes",
            "character_names_breakdown": {
                "Axel Blaze": "Aries warrior energy",
                "Sterling Oak": "Taurus stability and luxury",
                "Pixel Jasper": "Gemini scattered communication",
                "Luna Heartwell": "Cancer emotional nurturing",
                "Apollo King": "Leo dramatic confidence",
                "Sage Winters": "Virgo analytical precision",
                "Iris Haven": "Libra balanced diplomacy",
                "Raven Obsidian": "Scorpio mysterious power",
                "Phoenix Sage": "Sagittarius adventurous philosophy",
                "Victor Stone": "Capricorn ambitious discipline"
            },
            "usage_notes": [
                "Each name reflects character's personality, aesthetic, and zodiac nature",
                "Names are memorable and brandable for marketing",
                "First and last names create full character identity",
                "Names hint at character archetype without explicit labeling"
            ],
            "character_combinations": {
                "conflict_pairs": [
                    "Axel Blaze vs Iris Haven (action vs indecision)",
                    "Raven Obsidian vs Phoenix Sage (secrecy vs brutal honesty)",
                    "Pixel Jasper vs Sage Winters (chaos vs perfectionism)",
                    "Victor Stone vs Luna Heartwell (ambition vs emotions)"
                ],
                "harmony_pairs": [
                    "Axel Blaze + Apollo King (fire duo confidence)",
                    "Sterling Oak + Victor Stone (earth stability)",
                    "Pixel Jasper + Iris Haven (air communication)",
                    "Luna Heartwell + Raven Obsidian (water depth)"
                ]
            }
        }
    }
}

export const fetchVisualThunk = createAsyncThunk("generateVisualsThunk/generate", async(prompt : string, thunkAPI) => {
    try{
//         const {text} = await generateText({
//             model : groq('openai/gpt-oss-120b'),
//             prompt : `You are an expert meme scenario designer and prompt engineer.
// You will be given a user prompt:
// user_prompt = ${prompt}
// You also have access to character data:
// ${characters_data.data.brand_characters}
// Your task:
// - Analyze the user prompt and extract:
// - main context
// - emotions
// - tone
// Based on the extracted context, create one clear, single-scene meme scenario that best represents the prompt.
// The scenario must be visually understandable in one cartoon-style image
// Avoid multiple timelines or panels
// Create a compact, cartoonish image-generation prompt for this scenario:
// bright, colorful, exaggerated cartoon style
// bold outlines, expressive faces, exaggerated body language
// meme-friendly composition
// clear spatial relationships (who is where, who is reacting to whom)
// no realism, no photorealism
// From ${characters_data.data.brand_characters}, select only characters whose personality, tone, and behavioral traits naturally fit the scenario.
// For each selected character:
// assign one short caption (max 1 sentence)
// the caption must match the character’s personality, tone, and traits
// captions should feel like meme text or speech-bubble lines
// IMPORTANT RULES:
// Use cartoonish tone only (no cinematic realism)
// Keep the image prompt compact and linear (avoid headings or lists inside it)
// Do not invent new character traits
// Do not include eplanations or analysis in the output
// Output only in the specified format
// OUTPUT FORMAT (STRICT):
// {
//   "output": {
//     "prompt": "<single cartoonish image-generation prompt>",
//     "captions": {
//       "<character_name>": "<short caption>",
//       "<character_name>": "<short caption>"
//     }
//   }
// }`
//         })
//         console.log("text -> ", text)
//         return {
//             success : true,
//             error : null,
//             data : text
//         }
        const data = await generateImagePrompt(prompt)
        const generated_prompt = JSON.parse(data?.text as string) 
        // console.log(generated_prompt)
        const image_generation_prompt = `${generated_prompt.output.prompt}, and add these captions {${Object.values(generated_prompt.output.captions).map((caption) => `"${caption}"`)}} at right place in the image and make sure the captions MUST be readable and clear. and expressions on characters faces MUST be relevant to thier caption and tone.`
        // console.log(image_generation_prompt)
        const response = await fetch("api/generate-image", {
            method : "POST",
            body : JSON.stringify({image_generation_prompt:image_generation_prompt})
        })
        const output = await response.json()
        // console.log("response output -> ", output)
        return {
            data : output.imageUrl[0],
            success : true,
            error : null
        }

    }catch(error:any){
        return thunkAPI.rejectWithValue(error.message || "Failed to generate visual")
    }
})