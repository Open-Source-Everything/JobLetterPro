import { db } from "@/server/db";
import {
  extractCoverLetter,
  formatCoverLetter,
  generateCoverLetterPrompt,
  type GeneratedData,
  generatePrompt,
} from "@/utils/ai-generated-context";
import { getGroqApi } from "@/utils/getGroqApi";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Rest of your existing code
  const { jobDescription, resumeId, userId } = req.body as {
    jobDescription: string;
    resumeId: string;
    userId: string;
  };
  console.log("jobDescription", jobDescription);
  try {
    const resume = await db.resume.findUnique({
      where: {
        id: resumeId,
      },
    });
    if (!resume?.generatedContent) {
      return res.status(400).json({
        message: "Resume not found",
      });
    }
    const generatedData: GeneratedData = {
      jobDescription: await getGroqApi(
        generatePrompt("jobDescription", jobDescription),
      ),
      resumeData: resume.generatedContent,
      coverLetterInstructions: await getGroqApi(
        generatePrompt("coverLetterInstructions", jobDescription),
      ),
    };

    const coverLetterPrompt = generateCoverLetterPrompt(generatedData);
    console.log("coverLetterPrompt length:", coverLetterPrompt.length);

    const generatedCoverLetter = await getGroqApi(coverLetterPrompt);
    console.log("generatedCoverLetter length:", generatedCoverLetter);

    const extractedCoverLetter = extractCoverLetter(generatedCoverLetter);
    console.log("extractedCoverLetter length:", extractedCoverLetter.length);
    console.log("extractedCoverLetter preview:", extractedCoverLetter);

    const formattedCoverLetter = formatCoverLetter(extractedCoverLetter);
    console.log("formattedCoverLetter length:", formattedCoverLetter.length);
    console.log(
      "formattedCoverLetter preview:",
      formattedCoverLetter.slice(0, 200),
    );

    const createdCoverLetter = await db.coverLetter.create({
      data: {
        jobDescription: jobDescription,
        jobDescriptionGeneratedContent: generatedData.jobDescription,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    await db.coverLetterHistory.create({
      data: {
        coverLetterHistoryData: formattedCoverLetter,
        coverLetter: {
          connect: {
            id: createdCoverLetter.id,
          },
        },
      },
    });

    console.log(formattedCoverLetter);
    return res.status(200).json({
      coverLetter: formattedCoverLetter,
      jobSummary: generatedData.jobDescription,
      candidateSummary: generatedData.resumeData,
      message: "Cover letter generated successfully",
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return res.status(500).json({
      message: "Error generating cover letter",
    });
  }
}
