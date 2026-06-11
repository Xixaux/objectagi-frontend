'use client';  // ← if this file is used in a Next.js client component

type Message = {
  isUser: boolean;
  content: string;
  timestamp: string;
};

type AssignmentInfo = {
  project?: string;
  role?: string;
  isAssigned: boolean;
} | null;

/**
 * Core function: generates the eHuman's reply based on user input and conversation history.
 * Supports personalized responses **only** if the parent explicitly passes assignmentInfo.isAssigned = true
 * for this specific eHuman.
 */
export function generateEHumanReply(
  userText: string,
  history: Message[],
  currentEHumanName: string,
  assignmentInfo: AssignmentInfo = null
): string {
  const lowerInput = userText.toLowerCase().trim();

  // ────────────────────────────────────────────────
  // Personalized response ONLY if explicitly assigned by parent component
  // ────────────────────────────────────────────────
  if (assignmentInfo?.isAssigned === true) {
    const project = assignmentInfo.project || 'an unspecified project';
    const role    = assignmentInfo.role    || 'a general objective';

    // Detect if this is the very first user message in this chat
    const userMessages = history.filter(m => m.isUser);
    const isFirstUserMessage = userMessages.length === 0;

    const isGreeting =
      lowerInput === 'hello' ||
      lowerInput === 'hi' ||
      lowerInput === 'hey' ||
      lowerInput.startsWith('hello') ||
      lowerInput.startsWith('hi ') ||
      lowerInput.startsWith('hey ');

    // Special intro message on first real user message
    if (isFirstUserMessage) {
      return (
        `Hi admin, this is ${currentEHumanName}. ` +
        `Looks like you assigned me to ${project} for the ${role} objective. ` +
        `Sounds good to me, let's get to work...`
      );
    }

    // Follow-up greetings
    if (isGreeting) {
      return `Hey admin, still locked in on ${project}, what's the next move?`;
    }

    // General assigned behavior
    return `Standing by on ${project} assignment. What's the next directive, admin?`;
  }

  // ────────────────────────────────────────────────
  // Standard (unassigned / default) behavior
  // ────────────────────────────────────────────────
  if (
    lowerInput === 'hello' ||
    lowerInput === 'hi' ||
    lowerInput === 'hey' ||
    lowerInput.startsWith('hello') ||
    lowerInput.startsWith('hi ') ||
    lowerInput.startsWith('hey ')
  ) {
    return 'howdy';
  }

  if (lowerInput.includes('find the file')) {
    return 'Here you go';
  }

  // Randy Holt weather easter egg ─ works whether assigned or not
  if (currentEHumanName === "Randy Holt") {
    if (
      lowerInput.includes('weather') ||
      lowerInput === 'what is the weather' ||
      lowerInput === 'what is the weather?' ||
      lowerInput === 'whats the weather' ||
      lowerInput === 'what\'s the weather' ||
      lowerInput === 'what\'s the weather?'
    ) {
      return 'Snowing.';
    }

    if (
      lowerInput.includes('how many inches') ||
      lowerInput.includes('how many inch') ||
      lowerInput.includes('inches of snow') ||
      lowerInput.includes('how much snow')
    ) {
      return '6 ugh';
    }
  }

  // Future rules can go here...

  // Default fallback
  return 'Acknowledged. Awaiting further instruction.';
}