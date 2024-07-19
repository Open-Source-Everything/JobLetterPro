import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getGroqApi } from "@/utils/getGroqApi";
import { generatePrompt } from "@/utils/ai-generated-context";
import { TRPCClientError } from "@trpc/client";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  const data = await pdf(buffer);
  return data.text;
};

const extractTextFromDOCX = async (buffer: Buffer): Promise<string> => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};
const extractContactInfo = (text: string) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex =
    /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

  return {
    email: text.match(emailRegex)?.[0] || null,
    phone: text.match(phoneRegex)?.[0] || null,
  };
};

const extractEducation = (text: string) => {
  const educationSection =
    text.match(/Education([\s\S]*?)(?=\n\s*\n|$)/i)?.[1] || "";
  const educationRegex = /([^,\n]+),\s*([^,\n]+)\s*(\d{4}\s*-\s*\d{4})/g;
  const matches = educationSection.matchAll(educationRegex);
  return Array.from(matches, (match) => ({
    institution: `${match[1]}, ${match[2]}`.trim(),
    year: match[3].trim(),
  }));
};

const extractWorkExperience = (text: string) => {
  const experienceSection =
    text.match(/Experience([\s\S]*?)(?=\n\s*Projects|$)/i)?.[1] || "";
  const jobEntries = experienceSection.split(
    /(?=\n[A-Z][A-Z\s]+(?:LLC|Inc\.)?[A-Za-z\s]+\d{4})/,
  );

  return jobEntries
    .map((entry) => {
      const lines = entry.trim().split("\n");
      if (lines.length < 2) return null;

      const companyLine = lines[0].trim();
      const [company, duration] = companyLine.split(
        /(?=[A-Z][a-z]{2,}\s+\d{4})/,
      );
      const positionLine = lines[1].trim();

      // Improved position and location parsing
      const positionLocationMatch = positionLine.match(
        /^(.+?)(?:\s+(\w+(?:,\s*\w+)?))?$/,
      );
      let position = "",
        location = "";
      if (positionLocationMatch) {
        position = positionLocationMatch[1].trim();
        location = positionLocationMatch[2]
          ? positionLocationMatch[2].trim()
          : "";
      }

      // Handle cases where location is split across position and location fields
      const locationParts = location.split(",").map((part) => part.trim());
      if (locationParts.length > 1) {
        position = position.replace(new RegExp(`\\s+${locationParts[0]}$`), "");
        location = locationParts.join(", ");
      } else if (position.includes("Remote") && !location) {
        const parts = position.split(/\s+/);
        position = parts.slice(0, -2).join(" ");
        location = parts.slice(-2).join(", ");
      }

      // Clean up position and location
      position = position
        .replace(/(\w+)([A-Z])/, "$1 $2")
        .replace(/\s+-\s*$/, "");
      location = location.replace(/(\w+)([A-Z])/, "$1, $2");

      const description = lines.slice(2).join("\n").trim();

      // Clean up duration
      const cleanDuration = duration
        ? duration.trim().replace(/\s*[-–]\s*$/, "")
        : "";

      return {
        company: company.trim(),
        position: position,
        location: location,
        duration: cleanDuration,
        description,
      };
    })
    .filter(Boolean);
};

export const resumeRouter = createTRPCRouter({
  addResume: protectedProcedure
    .input(
      z.object({
        extractedData: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user) {
        throw new TRPCClientError("Unauthorized");
      }
      const { extractedData } = input;
      const generatedResumeData = await getGroqApi(
        generatePrompt("resumeData", extractedData),
      );
      await ctx.db.resume.create({
        data: {
          extractedData,
          generatedContent: generatedResumeData,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return {
        success: true,
      };
    }),
  uploadAndParse: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.enum([
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]),
        fileBuffer: z.string(), // Change this to string
      }),
    )
    .mutation(async ({ input }) => {
      try {
        let text: string;
        const buffer = Buffer.from(input.fileBuffer, "base64"); // Convert base64 string to Buffer

        if (input.fileType === "application/pdf") {
          text = await extractTextFromPDF(buffer);
        } else if (
          input.fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          text = await extractTextFromDOCX(buffer);
        } else {
          throw new TRPCClientError("Unsupported file type");
        }

        const parsedResume = {
          contactInfo: extractContactInfo(text),
          education: extractEducation(text),
          workExperience: extractWorkExperience(text),
        };

        return parsedResume;
      } catch (error) {
        console.error("Error parsing resume:", error);
        throw new TRPCClientError("Failed to parse resume");
      }
    }),
});
