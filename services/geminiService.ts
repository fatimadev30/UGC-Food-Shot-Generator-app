import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not found.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT_WITH_PERSON = `
You are an AI that generates realistic UGC (User Generated Content) lifestyle photos.
Use the person’s facial features, hairstyle, and skin tone from the provided person image.
Generate a realistic photo where this person is naturally interacting with the food item from the provided food image.
Keep lighting, pose, and environment casual and natural — like a smartphone photo or social media post.
The person should look happy, authentic, and genuinely engaged with the food.

General Style Guidelines:
- Use lifestyle lighting (soft, natural light).
- Add slight imperfections for realism (soft blur, handheld framing).
- Keep proportions and skin tones natural.
- Output a photo that looks like authentic user-generated content, not an advertisement.
`;

const BASE_PROMPT_WITHOUT_PERSON = `
You are an AI that generates realistic UGC (User Generated Content) lifestyle photos.
Generate a realistic UGC-style image with a random natural-looking person (not a professional model). The model must be the same person in all images: a woman in her early 20s with a friendly smile and brown hair, wearing a simple, stylish casual outfit (like a neutral-colored sweater or t-shirt).
The person should appear to be enjoying or interacting with the food from the provided food image.
Make the setting look relatable — like a cafe, kitchen, picnic, or restaurant. The mood should feel warm, friendly, and real.
The model's face must be clearly visible and they should have a natural, engaging expression.
The setting should be a bright, modern, and aesthetically pleasing environment like a trendy cafe or a stylish home kitchen with soft, natural lighting.
The food from the user's image should be the hero of the shot, presented beautifully. The overall vibe must feel authentic and relatable, like a genuine post from a food influencer.

General Style Guidelines:
- Use lifestyle lighting (soft, natural light).
- Add slight imperfections for realism (soft blur, handheld framing).
- Keep proportions and skin tones natural.
- Output a photo that looks like authentic user-generated content, not an advertisement.
`;


const PROMPT_VARIATIONS = [
  `In this shot, the person is happily presenting the dish towards the camera with both hands, smiling warmly as if she's about to share it.`,
  `In this shot, the person is captured mid-action, taking a joyful, delicious bite of the dish. Her eyes can be closed in enjoyment.`,
  `This is a candid lifestyle shot. The person is interacting naturally with the dish off to the side, perhaps laughing or looking at it with delight, not looking directly at the camera. The focus is on a genuine moment of enjoyment.`,
];


const generateSingleImage = async (
    foodImage: { base64: string, type: string },
    personImage: { base64: string, type: string } | null,
    prompt: string
  ): Promise<string | null> => {

    // Fix: Explicitly type `parts` as `Part[]` to allow for a mix of image (`inlineData`) and text parts.
    // This prevents a TypeScript error where the array type was inferred too narrowly from its first element.
    const parts: Part[] = [
        {
            inlineData: {
                data: foodImage.base64,
                mimeType: foodImage.type,
            },
        },
    ];

    if (personImage) {
        parts.push({
            inlineData: {
                data: personImage.base64,
                mimeType: personImage.type,
            }
        });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
}


export const generateUgcImages = async (
    foodImage: { base64: string, type: string },
    personImage: { base64: string, type: string } | null
  ): Promise<(string | null)[]> => {
  try {
    const basePrompt = personImage ? BASE_PROMPT_WITH_PERSON : BASE_PROMPT_WITHOUT_PERSON;
    const prompts = PROMPT_VARIATIONS.map(variation => `${basePrompt}\n${variation}`);

    const imagePromises = prompts.map(prompt => generateSingleImage(foodImage, personImage, prompt));
    const results = await Promise.all(imagePromises);
    return results;
  } catch (error) {
    console.error("Error generating images with Gemini API:", error);
    throw new Error("Failed to generate images. Please check the console for details.");
  }
};