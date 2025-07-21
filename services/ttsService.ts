
import { GEMINI_TTS_MODEL_NAME } from '../constants';
import { getGeminiClient } from './geminiClient';
import { GenerateContentResponse } from "@google/genai";

/**
 * Decodes a base64 string into a Uint8Array.
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

/**
 * Parses the audio mime type string to extract sample rate and bit depth.
 * @example "audio/L16;rate=24000" -> { rate: 24000, bits_per_sample: 16 }
 */
const parseAudioMimeType = (mimeType: string): { rate: number, bits_per_sample: number } => {
    let bits_per_sample = 16; // Default
    let rate = 24000; // Default

    const parts = mimeType.split(';');
    for (const part of parts) {
        const trimmedPart = part.trim();
        if (trimmedPart.toLowerCase().startsWith('rate=')) {
            const rateStr = trimmedPart.split('=')[1];
            if (rateStr) {
                const parsedRate = parseInt(rateStr, 10);
                if (!isNaN(parsedRate)) rate = parsedRate;
            }
        } else if (trimmedPart.match(/^audio\/L(8|16|24|32)$/i)) {
            bits_per_sample = parseInt(trimmedPart.substring(7), 10);
        }
    }
    return { rate, bits_per_sample };
}

const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}

/**
 * Creates a WAV file header and combines it with the raw audio data to create
 * a playable audio data URL.
 * @param audioDataBytes Raw audio data (PCM).
 * @param mimeType Mime type of the raw audio, used to extract parameters.
 * @returns A base64 encoded WAV data URL string.
 */
const convertToWav = (audioDataBytes: Uint8Array, mimeType: string): string => {
    const { rate, bits_per_sample } = parseAudioMimeType(mimeType);

    const numChannels = 1;
    const dataSize = audioDataBytes.length;
    const bytesPerSample = bits_per_sample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = rate * blockAlign;
    const chunkSize = 36 + dataSize;
    const headerSize = 44;

    const buffer = new ArrayBuffer(headerSize);
    const view = new DataView(buffer);

    // http://soundfile.sapp.org/doc/WaveFormat/
    writeString(view, 0, "RIFF");
    view.setUint32(4, chunkSize, true); // little-endian
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bits_per_sample, true);
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    const wavBytes = new Uint8Array(headerSize + dataSize);
    wavBytes.set(new Uint8Array(buffer), 0);
    wavBytes.set(audioDataBytes, headerSize);
    
    // ** FIX FOR STACK OVERFLOW **
    // The original method `btoa(String.fromCharCode.apply(null, wavBytes))` fails on large
    // arrays by exceeding the call stack. We must process the array in chunks.
    const CHUNK_SIZE = 8192; // A safe chunk size
    let binaryString = '';
    for (let i = 0; i < wavBytes.length; i += CHUNK_SIZE) {
        const chunk = wavBytes.subarray(i, i + CHUNK_SIZE);
        // `as any` is used here as TypeScript can sometimes struggle with the type inference for `apply` on a Uint8Array chunk.
        binaryString += String.fromCharCode.apply(null, chunk as any);
    }
    
    const b64 = btoa(binaryString);
    return `data:audio/wav;base64,${b64}`;
};

/**
 * Generates audio for the given text using the Gemini TTS API.
 * Follows the official documentation for gemini-2.5-flash-preview-tts.
 * @param text The text to synthesize.
 * @returns A promise that resolves to a playable WAV data URL.
 */
export const generateAudio = async (text: string): Promise<string> => {
    // Gracefully disable TTS if the model is not specified (see constants.ts) or text is empty.
    if (!GEMINI_TTS_MODEL_NAME || !text || !text.trim()) {
        return Promise.resolve("");
    }
    
    const gemini = getGeminiClient();

    // The model can be instructed on tone within the prompt itself.
    const prompt = `In a warm, welcoming, and clear voice, say: ${text}`;

    try {
        const response: GenerateContentResponse = await gemini.models.generateContent({
            model: GEMINI_TTS_MODEL_NAME,
            contents: [{ parts: [{ text: prompt }] }],
            // The configuration for TTS is specific and might not be fully typed yet.
            // Using the structure from the official documentation.
            // @ts-ignore
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        // Using one of the high-quality voices from the original user request.
                        prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                    },
                },
            },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];

        if (part && 'inlineData' in part && part.inlineData?.data) {
            const audioDataB64 = part.inlineData.data;
            // The API should provide the mimeType, but have a fallback.
            const mimeType = part.inlineData.mimeType || 'audio/L16;rate=24000';
            const audioBytes = base64ToUint8Array(audioDataB64);
            return convertToWav(audioBytes, mimeType);
        }

        throw new Error("No audio data received from API. The response structure was unexpected.");

    } catch (error) {
        console.error("Full error details from Gemini TTS:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        // Attempt to parse a nested error if it exists, for better user feedback.
        const detailedError = (error as any)?.error?.message || errorMessage;
        throw new Error(`Gemini TTS API call failed. Details: ${detailedError}`);
    }
};
