'use server';

import { ai } from "@/ai/genkit";
import { z } from "zod";

const GuideResponseSchema = z.object({
  script: z.string(),
  didYouKnow: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
});

const FALLBACK_SCRIPTS: Record<string, { script: string, trivia: { question: string, answer: string }[] }> = {
  "Hunza Valley": {
    script: "Welcome to the Hunza Valley, often called the 'Shangri-La' of Pakistan. As you look around this 360-degree view, you can see the majestic peaks of Rakaposhi and Ultar Sar towering over the turquoise Hunza River. This valley has been a crossroad for Silk Road travelers for centuries. Notice the terraced fields—local farmers have perfected this high-altitude agriculture over generations. It's a place where time seems to slow down.",
    trivia: [
      { question: "How old are the forts here?", answer: "Altit and Baltit forts are over 700 to 1100 years old." },
      { question: "What is the literacy rate?", answer: "Hunza has one of the highest literacy rates in Pakistan, nearly 100% in some villages." },
      { question: "What is the secret to their long life?", answer: "Locals attribute their longevity to fresh glacier water and dried apricots." }
    ]
  },
  "Badshahi Mosque, Lahore": {
    script: "You are standing in the courtyard of the Badshahi Mosque, a masterpiece of Mughal architecture commissioned by Emperor Aurangzeb in 1671. The red sandstone you see was brought from Rajasthan. Notice the three white marble domes—they provide a stunning contrast against the evening sky. This mosque was the largest in the world for over 300 years and remains a symbol of Lahore's rich imperial history.",
    trivia: [
      { question: "How many people can fit?", answer: "The courtyard can hold up to 100,000 worshippers at once." },
      { question: "What's in the museum?", answer: "The upper floors contain relics belonging to the Prophet Muhammad (PBUH)." },
      { question: "Who is buried nearby?", answer: "The great philosopher-poet Allama Iqbal's tomb is just outside the main gate." }
    ]
  },
  "Faisal Mosque, Islamabad": {
    script: "Welcome to the iconic Faisal Mosque. Unlike traditional mosques with domes, this structure was designed to resemble a Bedouin tent. It's nestled right at the foot of the Margalla Hills, providing a spiritual sanctuary for the capital city. The four minarets reach 80 meters high, inspired by Turkish architecture. It's not just a place of worship, but a marvel of modern engineering and design.",
    trivia: [
      { question: "Who funded the mosque?", answer: "It was a gift from King Faisal of Saudi Arabia, costing over $120 million today." },
      { question: "Who was the architect?", answer: "Turkish architect Vedat Dalokay won an international competition to design it." },
      { question: "Can you see it from far?", answer: "Yes, its white marble and unique shape make it visible from almost anywhere in Islamabad." }
    ]
  },
  "Swat Valley": {
    script: "Explore the 'Switzerland of the East.' Swat Valley is a lush emerald paradise of flowing rivers and snow-capped peaks. In this view, you can feel the serenity of the Kalam forest. Swat was once a major center for Buddhist learning, and you can still find ancient stupas carved into the hillsides. Whether it's the trout in the river or the apples in the orchards, Swat is a feast for the senses.",
    trivia: [
      { question: "Is there skiing here?", answer: "Yes, Malam Jabba is Pakistan's premier ski resort located in Swat." },
      { question: "What is the ancient name?", answer: "In ancient times, it was known as Uddiyana." },
      { question: "Where is the famous lake?", answer: "Mahodand Lake is a stunning alpine lake reachable by a jeep trek from Kalam." }
    ]
  },
  "Skardu": {
    script: "Welcome to Skardu, the gateway to the world's highest peaks, including K2. This high-altitude desert is where the Indus River widens into a serene lake-like expanse. You are surrounded by the Karakoram range. Notice the unique 'Cold Desert' dunes nearby—it's one of the few places on Earth where you can see sand dunes surrounded by snow-capped mountains.",
    trivia: [
      { question: "What is the 'Roof of the World'?", answer: "The Deosai National Park nearby is the second highest plateau on Earth." },
      { question: "How high is Skardu?", answer: "The city sits at an elevation of approximately 2,500 meters (8,200 feet)." },
      { question: "What is Shangrila Lake?", answer: "It's a heart-shaped lake nearby, famous for its red-roofed resort cottages." }
    ]
  },
  "Mohenjo-daro": {
    script: "Step back 4,500 years into the Indus Valley Civilization. Mohenjo-daro was one of the world's earliest major urban settlements. Notice the sophisticated grid layout of the brick streets and the advanced drainage systems—features that wouldn't be seen again for millennia. This was a city of traders, artisans, and engineers who lived in harmony with the great Indus River.",
    trivia: [
      { question: "What does the name mean?", answer: "Mohenjo-daro translates to 'Mound of the Dead' in Sindhi." },
      { question: "Was there a king?", answer: "Archaeologists haven't found evidence of a monarchy; it may have been an egalitarian society." },
      { question: "Is it a UNESCO site?", answer: "Yes, it was one of the first sites in South Asia to be designated a World Heritage site." }
    ]
  },
  "Khunjerab Pass": {
    script: "You are standing at 4,693 meters above sea level—the highest paved international border crossing in the world. This is the meeting point of Pakistan and China. The air is thin but the views are infinite. This pass is part of the Karakoram Highway, the 'Eighth Wonder of the World.' If you're lucky, you might spot a rare Himalayan Ibex or even a Snow Leopard in the distance.",
    trivia: [
      { question: "Is there an ATM?", answer: "Yes, the world's highest ATM (National Bank of Pakistan) is located right here." },
      { question: "When is it open?", answer: "The border is usually closed in winter (Jan-April) due to heavy snowfall." },
      { question: "What does the name mean?", answer: "In the local Wakhi language, it means 'Valley of Blood' due to the red ore in the mountains." }
    ]
  },
  "Neelum Valley": {
    script: "Welcome to the Neelum Valley, the jewel of Azad Kashmir. This 144-kilometer long valley is a tapestry of thick forests, sparkling streams, and hospitable villages. The Neelum River, with its deep blue waters, follows you throughout the journey. It's a land of folklore and natural beauty, where every turn in the road reveals a new waterfall or a hidden glade.",
    trivia: [
      { question: "Which river is it?", answer: "The river was originally called the Kishanganga before being renamed Neelum." },
      { question: "Where is the university?", answer: "The valley is home to a campus of the University of Azad Jammu and Kashmir in Athmuqam." },
      { question: "Is there a famous lake?", answer: "Chitta Katha Lake is a high-altitude alpine lake famous for its milky white water." }
    ]
  }
};

export async function generateAiTourGuide(locationName: string) {
  try {
    const prompt = `You are an expert Pakistani tourism guide for InsightTravelPK. 
    Location: ${locationName}
    
    Provide a warm, engaging 60-second audio tour script. Include: 
    - Historical significance
    - Cultural importance
    - What the visitor is seeing right now in this 360 view
    - One fascinating fact
    
    Keep it conversational and inspiring. Max 120 words.
    
    Also provide 3 "Did you know?" questions related to this location with short, interesting answers.`;

    // Attempt AI Generation
    const response = await ai.generate(prompt);
    
    // If successful, we still use the fallback trivia for better UI consistency 
    // unless we want to parse the response text. 
    // For now, let's return the AI text + fallback trivia to be safe.
    const fallback = FALLBACK_SCRIPTS[locationName] || FALLBACK_SCRIPTS["Hunza Valley"];
    
    return {
      script: response.text || fallback.script,
      didYouKnow: fallback.trivia
    };

  } catch (error: any) {
    console.warn(`AI Generation failed for ${locationName}, using generic fallback:`, error.message);
    
    // Return high-quality fallback based on location name or a generic one
    const fallback = FALLBACK_SCRIPTS[locationName] || {
      script: `Welcome to ${locationName}. This beautiful spot is a hidden gem in Pakistan's diverse landscape. As you explore this area, notice the unique local geography and the peaceful atmosphere. Pakistan is a land of untold stories, and this location is part of that rich tapestry.`,
      trivia: [
        { question: "Where is this located?", answer: `This spot is in the beautiful regions of Pakistan.` },
        { question: "Is it worth visiting?", answer: "Absolutely! Hidden gems like these offer the most authentic travel experiences." },
        { question: "What is the best time to visit?", answer: "Generally, spring and autumn are the best times to explore Pakistan's diverse terrain." }
      ]
    };
    
    return {
      script: fallback.script,
      didYouKnow: fallback.trivia
    };
  }
}
