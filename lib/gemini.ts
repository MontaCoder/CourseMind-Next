import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface TopicOutline {
  title: string;
  description: string;
}

export interface CourseOutline {
  name: string;
  description: string;
  chapters: {
    title: string;
    description: string;
    topics: TopicOutline[];
  }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate a course outline based on the topic and language
 */
export async function generateCourseOutline(
  topic: string,
  language: string = "English",
  chapterCount: number = 5
): Promise<CourseOutline> {
  if (!genAI) {
    throw new Error(
      "Gemini AI is not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Create a comprehensive course outline about "${topic}" in ${language}.

Requirements:
- Create exactly ${chapterCount} chapters
- Each chapter should have a clear title and description
- Each chapter should have 3-5 key topics that will be covered
- Each topic should have a title and a brief description (1 sentence explaining what will be learned)
- The course should progress from basics to advanced concepts
- Make it educational and well-structured

Format your response as a JSON object with this exact structure:
{
  "name": "Course Title",
  "description": "Brief course description (2-3 sentences)",
  "chapters": [
    {
      "title": "Chapter title",
      "description": "Chapter description",
      "topics": [
        {
          "title": "Topic title",
          "description": "Brief description of what this topic covers"
        }
      ]
    }
  ]
}

Respond ONLY with the JSON object, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const courseOutline: CourseOutline = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!courseOutline.name || !courseOutline.chapters || courseOutline.chapters.length === 0) {
      throw new Error("Invalid course outline structure");
    }

    return courseOutline;
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw new Error("Failed to generate course outline. Please try again.");
  }
}

/**
 * Generate quiz questions for a specific chapter
 */
export async function generateQuizQuestions(
  courseName: string,
  chapterTitle: string,
  topics: string[],
  questionCount: number = 5,
  language: string = "English"
): Promise<QuizQuestion[]> {
  if (!genAI) {
    throw new Error(
      "Gemini AI is not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Generate ${questionCount} multiple-choice quiz questions for a chapter titled "${chapterTitle}" from the course "${courseName}" in ${language}.

The chapter covers these topics:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Requirements:
- Create exactly ${questionCount} questions
- Each question should have 4 options
- Mark the correct answer (0-3 index)
- Provide a brief explanation for the correct answer
- Questions should test understanding, not just memorization
- Cover different topics from the chapter

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Respond ONLY with the JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const questions: QuizQuestion[] = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid quiz questions structure");
    }

    return questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
}

/**
 * AI Chatbot for course-related questions
 */
export async function chatWithAI(
  messages: ChatMessage[],
  courseContext?: {
    courseName: string;
    currentChapter?: string;
    topics?: string[];
  }
): Promise<string> {
  if (!genAI) {
    throw new Error(
      "Gemini AI is not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  let systemPrompt = "You are a helpful AI tutor assistant. ";

  if (courseContext) {
    systemPrompt += `The student is currently studying "${courseContext.courseName}"`;
    if (courseContext.currentChapter) {
      systemPrompt += ` and is on the chapter "${courseContext.currentChapter}"`;
    }
    if (courseContext.topics && courseContext.topics.length > 0) {
      systemPrompt += `. The topics covered include: ${courseContext.topics.join(", ")}`;
    }
    systemPrompt += ". ";
  }

  systemPrompt += "Provide clear, helpful, and educational responses. Break down complex concepts into simpler terms.";

  // Build conversation history
  const conversationHistory = messages
    .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
    .join("\n\n");

  const prompt = `${systemPrompt}

${conversationHistory}

Tutor:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("Failed to get response from AI. Please try again.");
  }
}

/**
 * Generate a summary for course notes
 */
export async function generateNoteSummary(
  noteContent: string,
  maxLength: number = 200
): Promise<string> {
  if (!genAI) {
    throw new Error(
      "Gemini AI is not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Summarize the following course notes in ${maxLength} characters or less. Make it concise but informative:

${noteContent}

Summary:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    // Truncate if needed
    return summary.length > maxLength
      ? summary.substring(0, maxLength - 3) + "..."
      : summary;
  } catch (error) {
    console.error("Error generating note summary:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}

/**
 * Generate detailed theory content for a topic
 * This is the core content generation function (like v2's /api/generate)
 */
export async function generateTopicTheory(
  topicTitle: string,
  topicDescription: string,
  chapterTitle: string,
  language: string = "English",
  videoTranscript?: string
): Promise<string> {
  if (!genAI) {
    throw new Error(
      "Gemini AI is not configured. Please set GEMINI_API_KEY in your environment variables."
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  let prompt = `Generate comprehensive educational content about "${topicTitle}" from the chapter "${chapterTitle}" in ${language}.

${topicDescription ? `Topic Description: ${topicDescription}\n` : ""}`;

  if (videoTranscript) {
    prompt += `\nA video about this topic has the following transcript:
${videoTranscript}

Based on this transcript and your knowledge, create a well-structured educational explanation that:
1. Summarizes the key points from the video
2. Adds additional context and explanations
3. Provides examples to clarify concepts
4. Uses proper formatting (headings, lists, code blocks if applicable)`;
  } else {
    prompt += `\nCreate a comprehensive, well-structured educational explanation that:
1. Introduces the topic clearly
2. Explains key concepts and principles
3. Provides practical examples
4. Breaks down complex ideas into digestible parts
5. Uses proper formatting (headings, lists, code blocks if applicable)`;
  }

  prompt += `\n
Format your response in Markdown with:
- ## for main sections
- ### for subsections
- **bold** for emphasis
- \`code\` for technical terms or code snippets
- \`\`\` for code blocks (specify language)
- - for bullet points
- 1. for numbered lists

Make the content:
- Educational and easy to understand
- Suitable for ${language === "English" ? "an international" : `a ${language}-speaking`} audience
- Approximately 300-500 words
- Well-organized with clear structure

Begin your response:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating topic theory:", error);
    throw new Error("Failed to generate topic content. Please try again.");
  }
}
