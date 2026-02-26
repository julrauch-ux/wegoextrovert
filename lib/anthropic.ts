import Anthropic from "@anthropic-ai/sdk";
import type { Tone, PostFormat } from "./types";

const apiKey = process.env.ANTHROPIC_API_KEY;
export const isMockMode = !apiKey;

let client: Anthropic | null = null;
if (apiKey) {
  client = new Anthropic({ apiKey });
}

// --- Comment generation ---

const MOCK_COMMENTS = [
  "Great insight! This really resonates with what I've been seeing in the industry. Thanks for sharing.",
  "Couldn't agree more. The key point here is often overlooked — appreciate you bringing it to light.",
  "This is spot on. I've experienced this firsthand and the results were exactly as you described.",
  "Really valuable perspective. Have you found any specific frameworks that help with this approach?",
  "Excellent breakdown. Saving this for our team's next strategy session — very actionable.",
];

export async function generateComments(postText: string, tone: Tone = "professional"): Promise<string[]> {
  if (!client) {
    return MOCK_COMMENTS;
  }

  const prompt = `You are an expert LinkedIn engagement coach. Generate exactly 5 thoughtful, authentic LinkedIn comments for the following post. Each comment should be ${tone} in tone, 1-3 sentences, add genuine value, and avoid being sycophantic.

LinkedIn Post:
"""
${postText}
"""

Return a JSON array of exactly 5 comment strings. No other text.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const raw = content.text.trim();
  const jsonStr = raw.startsWith("[") ? raw : raw.slice(raw.indexOf("["));
  return JSON.parse(jsonStr) as string[];
}

// --- Suggestions generation (prospect outreach) ---

const MOCK_SUGGESTIONS = {
  comments: [
    "Really interesting perspective here. I've been thinking about this exact challenge in my work — would love to connect and swap notes.",
    "This resonates deeply. The framework you're describing is something we've been trying to operationalize at scale. Great post.",
    "Spot on. The nuance you bring to this topic is rare on LinkedIn — following for more of this.",
  ],
  dm: "Hi [Name], I came across your recent post and it really resonated with me. I work in a similar space and thought it'd be great to connect. Would love to hear more about your work at [Company].",
};

export async function generateSuggestions(
  postText: string,
  prospectName: string,
  prospectTitle: string | null,
  tone: Tone = "professional"
): Promise<{ comments: string[]; dm: string }> {
  if (!client) {
    return MOCK_SUGGESTIONS;
  }

  const prompt = `You are an expert LinkedIn outreach strategist. Generate 3 thoughtful comment suggestions and 1 personalized DM for engaging with a prospect's post.

Prospect: ${prospectName}${prospectTitle ? ` (${prospectTitle})` : ""}
Tone: ${tone}

LinkedIn Post:
"""
${postText}
"""

Return a JSON object with exactly this shape:
{
  "comments": ["comment1", "comment2", "comment3"],
  "dm": "dm text here"
}

Comments should be 1-3 sentences, add genuine value, and sound human — not sycophantic.
The DM should be 2-4 sentences, reference the post, and end with a soft call-to-action.
No other text — just the JSON object.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const raw = content.text.trim();
  const jsonStr = raw.startsWith("{") ? raw : raw.slice(raw.indexOf("{"));
  return JSON.parse(jsonStr) as { comments: string[]; dm: string };
}

// --- Post generation ---

const MOCK_POST: Record<PostFormat, string> = {
  short: "Here's something I've been thinking about lately...\n\nThe most successful people I know don't just work hard — they work with intention.\n\nWhat's one intentional habit you've built this year?\n\n#LinkedIn #Growth #Mindset",
  long: "Let me share a story that changed how I think about professional growth.\n\nThree years ago, I was grinding 60-hour weeks with nothing to show for it. Then I met a mentor who asked me one question that changed everything:\n\n\"Are you busy, or are you productive?\"\n\nThat question led me to audit every hour of my week. What I found shocked me — over 40% of my time was spent on low-value tasks that felt urgent but weren't important.\n\nHere's what I changed:\n→ Time-blocked deep work in the morning\n→ Delegated anything under $100/hour value\n→ Said no to 3 meetings per week\n\nThe result? More output, less stress, and finally time for the strategic work that actually moves the needle.\n\nWhat's one thing you could stop doing this week?\n\n#Productivity #Leadership #ProfessionalGrowth",
  list: "5 lessons I wish I learned earlier in my career:\n\n1. Your network is your net worth — invest in relationships before you need them\n2. Visibility matters as much as competence — great work that nobody sees gets you nowhere\n3. Say yes to stretch assignments, even when you feel unready\n4. Your boss's problems are your problems — solve them proactively\n5. Rest is productive — burnout is the real career killer\n\nWhich one hits closest to home?\n\n#CareerAdvice #ProfessionalDevelopment #Lessons",
  "hook-heavy": "I got rejected 23 times before my first big break.\n\nMost people would've quit. I almost did.\n\nBut rejection taught me something counterintuitive: the more nos you collect, the closer you are to a yes.\n\nNow I actively seek rejection. It means I'm playing big enough.\n\nAre you collecting enough rejections?\n\n#Resilience #Entrepreneurship #Mindset",
  question: "Hot take: remote work didn't kill company culture.\n\nBad leadership did.\n\nI've seen fully remote teams with incredible culture and in-person teams where nobody trusts each other.\n\nThe difference? Leaders who invest in people, not perks.\n\nDo you agree? What's the #1 factor that shapes culture in your experience?\n\n#RemoteWork #Leadership #CompanyCulture",
};

export async function generatePost(
  topic: string,
  tone: Tone,
  format: PostFormat
): Promise<string> {
  if (!client) {
    return MOCK_POST[format];
  }

  const formatDescriptions: Record<PostFormat, string> = {
    short: "short (150-200 words), punchy, ends with a question",
    long: "long-form (400-600 words), narrative story with takeaways",
    list: "list format with 4-6 numbered or bulleted points",
    "hook-heavy": "starts with a bold hook, builds tension, delivers insight",
    question: "poses a controversial or thought-provoking question, takes a stance",
  };

  const prompt = `You are a LinkedIn content strategist. Write a ${tone} LinkedIn post about the following topic using the ${format} format.

Topic: ${topic}
Tone: ${tone}
Format: ${formatDescriptions[format]}

Write an engaging post that sounds authentic, not AI-generated. Include relevant hashtags at the end. Return only the post text, no other commentary.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text.trim();
}
