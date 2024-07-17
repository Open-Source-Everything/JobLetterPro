import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getGroqApi } from "@/utils/getGroqApi";
import { generatePrompt } from "@/utils/ai-generated-context";
import { TRPCClientError } from "@trpc/client";

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
});
