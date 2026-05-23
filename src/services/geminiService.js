import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key.startsWith('YOUR_')) return null;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

export const generateSecurityBriefing = async (ticket) => {
  const model = getModel();

  if (!model) {
    return `[Demo Mode — Gemini API key not configured]

Welcome, ${ticket.holderName}. As a ${ticket.tierNumber === 1 ? 'VVIP' : 'VIP'} attendee, you have been allocated ${ticket.seat} in the ${ticket.section}.

Your designated entry is ${ticket.gate}. ${ticket.securityAuthority} will be managing your security perimeter tonight. Please have your access credentials ready at all times and remain in your authorised zones: ${ticket.accessZones?.join(', ')}.

In an emergency, proceed immediately to your nearest steward or SPG/CAPF officer. Do not use general public exits. A dedicated evacuation corridor has been reserved for your tier.

This briefing is powered by Google Gemini AI. Configure VITE_GEMINI_API_KEY in your .env file to generate live, personalised briefings.`;
  }

  const prompt = `You are a professional stadium security briefing officer for an IPL cricket match in India. Generate a concise, personalised security briefing for the following attendee. Keep it professional, reassuring, and under 250 words.

ATTENDEE PROFILE:
- Name: ${ticket.holderName}
- Security Tier: Tier ${ticket.tierNumber} — ${ticket.tierNumber === 1 ? 'High-Risk VVIP' : ticket.tierNumber === 2 ? 'VIP & International Dignitary' : ticket.tierNumber === 3 ? 'Player & Support Staff' : 'Sponsor/Press/Stadium Staff'}
- Designated Seat/Zone: ${ticket.seat}, ${ticket.section}
- Entry Gate: ${ticket.gate}
- Controlling Authority: ${ticket.securityAuthority}
- Verification Protocol: ${ticket.verificationProtocol}
- Authorised Access Zones: ${ticket.accessZones?.join(', ')}
- Match: ${ticket.match} at ${ticket.venue}

Write a briefing with these 4 sections (no headers):
1. A warm but professional welcome acknowledging their tier status
2. What to expect when they arrive — the security protocol at their gate
3. Movement guidelines across their authorised zones during the match
4. Emergency protocols: who to contact, which exits to use, evacuation priority

Use a formal yet approachable tone. Do not use markdown. Write in clear paragraphs.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error('[Gemini] generateContent failed:', e);
    throw new Error('Unable to generate briefing. Please check your Gemini API key and try again.');
  }
};

// ─── Bag Check Chat ───────────────────────────────────────────────────────────

const BAG_CHECK_SYSTEM = `You are a helpful IPL stadium entry advisor for the 2025 season. Attendees will tell you what they plan to bring and you flag any issues.

ALLOWED ITEMS: clear plastic bags (max 30×15×30cm), one sealed water bottle (up to 1L), mobile phones, prescription medications with prescription, sunscreen in sealed containers under 100ml, valid ticket and photo ID, baby food/milk/diapers, non-zoom binoculars, IPL merchandise (jerseys/caps/scarves), small sealed personal snacks.

PROHIBITED ITEMS: glass bottles/cans/metal containers, alcohol or illegal substances, professional cameras with detachable or zoom lenses over 3cm, selfie sticks/monopods/tripods, laser pointers/flares/torches, large umbrellas (compact ones OK), horns/vuvuzelas/electronic noisemakers, political banners or offensive material, outside food in bulk quantities, weapons/sharp objects/hazardous items, drones/UAVs/remote-controlled devices, large bags/backpacks/suitcases.

When someone tells you what they plan to bring:
- Use ✅ for clearly allowed items
- Use ⚠️ for prohibited items with a brief reason and alternative if applicable
- Use 💡 for borderline/conditional items with the specific rule
- Be concise and friendly — 3-5 lines max unless many items listed
- If nothing is problematic, confirm they're good to go`;

// Safety settings relaxed so Gemini can respond to weapon/contraband queries
// (e.g. "can I bring a gun?") with a proper "no, prohibited" answer instead of blocking.
const BAG_CHECK_SAFETY = [
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
];

export const createBagCheckSession = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key.startsWith('YOUR_')) return null;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: BAG_CHECK_SYSTEM,
    safetySettings: BAG_CHECK_SAFETY,
  });
  return model.startChat({
    history: [],
    generationConfig: { maxOutputTokens: 350, temperature: 0.2 },
  });
};

export const sendBagCheckMessage = async (session, message) => {
  if (!session) {
    return demoBagResponse(message);
  }
  try {
    const result = await session.sendMessage(message);
    return result.response.text();
  } catch (e) {
    console.error('[Gemini] bagCheck failed:', e);
    throw new Error('Unable to check items. Please try again.');
  }
};

const demoBagResponse = (message) => {
  const lower = message.toLowerCase();
  const lines = [];
  if (/dslr|zoom lens|professional camera/.test(lower)) lines.push('⚠️ Professional/DSLR cameras are not permitted. Your phone camera is perfectly fine.');
  if (/selfie stick|tripod|monopod/.test(lower)) lines.push('⚠️ Selfie sticks and tripods are not allowed.');
  if (/glass bottle|glass flask/.test(lower)) lines.push('⚠️ Glass bottles are not permitted — bring a plastic or metal bottle instead.');
  if (/large umbrella|golf umbrella/.test(lower)) lines.push('⚠️ Large umbrellas are not allowed. A compact folding umbrella is fine.');
  if (/backpack|large bag|suitcase/.test(lower)) lines.push('⚠️ Large bags/backpacks are not permitted. Use a clear plastic bag within 30×15×30cm.');
  if (/drone|uav/.test(lower)) lines.push('⚠️ Drones and UAVs are strictly prohibited.');
  if (/horn|vuvuzela/.test(lower)) lines.push('⚠️ Horns and vuvuzelas are not allowed — noise-making devices are banned.');
  if (/water bottle|bottle of water/.test(lower)) lines.push('✅ One sealed water bottle (up to 1L) is allowed.');
  if (/phone|mobile/.test(lower)) lines.push('✅ Mobile phones are allowed.');
  if (/snack|food|biscuit|chips/.test(lower)) lines.push('💡 Small sealed personal snacks are allowed, but bulk outside food is not.');
  if (/compact umbrella|small umbrella/.test(lower)) lines.push('✅ Compact umbrellas are permitted.');
  if (/binoculars/.test(lower)) lines.push('✅ Non-zoom binoculars are allowed.');
  if (lines.length === 0) return `Looks good! I didn't spot any obvious issues with what you described. When in doubt at the gate, check with security staff. Have a great match! 🏏`;
  return lines.join('\n') + '\n\n[Demo — configure VITE_GEMINI_API_KEY for live AI checking]';
};
