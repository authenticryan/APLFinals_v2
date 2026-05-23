import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key.startsWith('YOUR_')) return null;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
