import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { interviewId, answers } = await request.json();

  // If answers is empty or no words spoken, score must be 0
  if (!answers || answers.trim().length === 0) {
    await db.collection("interviews").doc(interviewId).update({
      score: 0,
      feedback:
        "No answer provided. Please attempt the interview before submitting.",
    });
    return Response.json(
      { success: true, score: 0, feedback: "No answer provided." },
      { status: 200 }
    );
  }

  try {
    const { text: evalText } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
Evaluate the following interview responses from a candidate.
Please return a score from 0 to 100 based on technical and behavioral skill, and brief feedback.

Return result as JSON: {"score": 77, "feedback": "Shows good technical skills with some improvement needed."}

Candidate's responses:
${answers}
      `,
    });

    let result;
    try {
      result = JSON.parse(evalText); // Should be {score: number, feedback: string}
    } catch {
      // fallback if model returns wrong format
      result = {
        score: 0,
        feedback: "AI did not return feedback. Please try again.",
      };
    }

    await db.collection("interviews").doc(interviewId).update({
      score: result.score,
      feedback: result.feedback,
    });

    return Response.json(
      { success: true, score: result.score, feedback: result.feedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}
