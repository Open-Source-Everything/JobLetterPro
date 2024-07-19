import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rateLimitedPublicProcedure,
} from "@/server/api/trpc";
import { getAzureGPTQuery } from "@/utils/azureGptApi";
import { getGroqApi } from "@/utils/getGroqApi";
import {
  extractCoverLetter,
  formatCoverLetter,
  generateCoverLetterPrompt,
  type GeneratedData,
  generatePrompt,
} from "@/utils/ai-generated-context";
import { TRPCClientError } from "@trpc/client";
// import { Ollama } from "ollama";
// import { createOpenAI } from "@ai-sdk/openai";
// import { getAzureGPTQuery } from "@/utils/getAzureGPTQuery";

// const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: "",
// });

// const ollama = new Ollama({ host: "https://ollama.kumard3.in" });
export const coverLetterRouter = createTRPCRouter({
  jobDescription: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => {
      const data = getAzureGPTQuery(`
        # Job Description Summary Extraction Prompt

Use the following steps to extract key information from a job description and format it into a concise summary:

1. Identify the position title and company name.

2. Determine if the company or project is open-source (if mentioned).

3. Extract key requirements and responsibilities from the job description. Look for phrases like "we're looking for," "you should have," "what the job involves," etc.

4. Consolidate similar points and prioritize the most important requirements.

5. Format the extracted information as follows:

markdown
## Job Description Summary
- Position: [Position Title]
- Company: [Company Name] [(Open-source project) if applicable]
- Key Requirements:
  1. [Requirement 1]
  2. [Requirement 2]
  3. [Requirement 3]
  ...


6. Aim for 6-10 key requirements, focusing on the most crucial aspects of the role.

7. Use clear, concise language for each requirement.

8. Ensure that the summary captures the essence of the role and the company's values.

Example output:

markdown
## Job Description Summary
- Position: Full-stack engineer
- Company: Company (Open-source project)
- Key Requirements:
  1. Experience in building interactive products for teams
  2. Appreciation for good UI/UX design
  3. Excellent communication skills, especially in remote settings
  4. Interest or experience in open-source projects
  5. Ability to build and own features from start to finish
  6. Comfort with ambiguity in a rapidly growing small team
  7. Willingness to engage with the community and produce content
  8. Ability to make trade-off decisions between speed and engineering excellence


Note: Adapt the summary as needed based on the specific details and emphasis of each job description.
        
The Job description -

${input.text}
`);
      return data;
    }),
  resumeData: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => {
      const data = getAzureGPTQuery(`
        # Candidate Experience and Skills Extraction Prompt

Use the following steps to extract key information from a candidate's resume and format it into a concise summary of relevant experience and technical skills:

1. Identify the candidate's current or most recent role and employer.

2. Extract 4-6 key achievements or responsibilities from the candidate's work experience, prioritizing those most relevant to the job they're applying for.

3. Identify the candidate's technical skills, categorizing them into:
   - Languages
   - Frameworks/Libraries
   - Tools & Technologies
   - Concepts

4. Format the extracted information as follows:

markdown
## Candidate's Relevant Experience
- Current role: [Job Title] at [Company Name]
- Key achievements:
  1. [Achievement 1]
  2. [Achievement 2]
  3. [Achievement 3]
  ...

## Technical Skills
- Languages: [List of programming languages]
- Frameworks/Libraries: [List of relevant frameworks and libraries]
- Tools & Technologies: [List of tools and technologies]
- Concepts: [List of relevant concepts and methodologies]


5. For the key achievements:
   - Start each point with an action verb
   - Include quantifiable results where possible
   - Focus on achievements that demonstrate leadership, technical skills, or significant impact

6. For the technical skills:
   - List the most relevant and advanced skills first
   - Include version numbers or specific details if mentioned in the resume (e.g., JavaScript (ES6+))
   - Separate different skills with commas

7. Ensure that the summary captures the candidate's most impressive and relevant experiences and skills.

Example output:

markdown
## Candidate's Relevant Experience
- Current role: Software Development Engineer & Team Lead at XAMTAC CONSULTING LLC
- Key achievements:
  1. Led development of AI-powered marketing ERP system
  2. Architected features increasing adoption and client retention
  3. Implemented various functionalities improving efficiency and engagement
  4. Experience with CI/CD pipelines and automated testing
  5. Led a 14-member development team
  6. Developed key client projects (Poshmom E-Commerce, TalkTales)

## Technical Skills
- Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3/SASS
- Frameworks/Libraries: React.js, Next.js, Node, Express.js, Redux, Jest, Cypress
- Tools & Technologies: Git, Docker, AWS, Azure, Firebase
- Concepts: Agile/Scrum, Microservices Architecture, RESTful APIs, Test-Driven Development, CI/CD


Note: Adapt the summary as needed based on the specific details and emphasis of each candidate's resume.

The resume data is as following -

${input.text}
`);
      return data;
    }),
  generateCoverLetter: publicProcedure
    .input(z.object({ jobDescription: z.string(), resumeData: z.string() }))
    .mutation(async ({ input }) => {
      const generatedJobDescription = await getAzureGPTQuery(`
        # Job Description Summary Extraction Prompt

Use the following steps to extract key information from a job description and format it into a concise summary:

1. Identify the position title and company name.

2. Determine if the company or project is open-source (if mentioned).

3. Extract key requirements and responsibilities from the job description. Look for phrases like "we're looking for," "you should have," "what the job involves," etc.

4. Consolidate similar points and prioritize the most important requirements.

5. Format the extracted information as follows:

markdown
## Job Description Summary
- Position: [Position Title]
- Company: [Company Name] [(Open-source project) if applicable]
- Key Requirements:
  1. [Requirement 1]
  2. [Requirement 2]
  3. [Requirement 3]
  ...


6. Aim for 6-10 key requirements, focusing on the most crucial aspects of the role.

7. Use clear, concise language for each requirement.

8. Ensure that the summary captures the essence of the role and the company's values.

Example output:

markdown
## Job Description Summary
- Position: Full-stack engineer
- Company: Company (Open-source project)
- Key Requirements:
  1. Experience in building interactive products for teams
  2. Appreciation for good UI/UX design
  3. Excellent communication skills, especially in remote settings
  4. Interest or experience in open-source projects
  5. Ability to build and own features from start to finish
  6. Comfort with ambiguity in a rapidly growing small team
  7. Willingness to engage with the community and produce content
  8. Ability to make trade-off decisions between speed and engineering excellence


Note: Adapt the summary as needed based on the specific details and emphasis of each job description.
        
The Job description -

${input.jobDescription}
`);
      const generatedResumeData = await getAzureGPTQuery(`
  # Candidate Experience and Skills Extraction Prompt

Use the following steps to extract key information from a candidate's resume and format it into a concise summary of relevant experience and technical skills:

1. Identify the candidate's current or most recent role and employer.

2. Extract 4-6 key achievements or responsibilities from the candidate's work experience, prioritizing those most relevant to the job they're applying for.

3. Identify the candidate's technical skills, categorizing them into:
- Languages
- Frameworks/Libraries
- Tools & Technologies
- Concepts

4. Format the extracted information as follows:

markdown
## Candidate's Relevant Experience
- Current role: [Job Title] at [Company Name]
- Key achievements:
1. [Achievement 1]
2. [Achievement 2]
3. [Achievement 3]
...

## Technical Skills
- Languages: [List of programming languages]
- Frameworks/Libraries: [List of relevant frameworks and libraries]
- Tools & Technologies: [List of tools and technologies]
- Concepts: [List of relevant concepts and methodologies]


5. For the key achievements:
- Start each point with an action verb
- Include quantifiable results where possible
- Focus on achievements that demonstrate leadership, technical skills, or significant impact

6. For the technical skills:
- List the most relevant and advanced skills first
- Include version numbers or specific details if mentioned in the resume (e.g., JavaScript (ES6+))
- Separate different skills with commas

7. Ensure that the summary captures the candidate's most impressive and relevant experiences and skills.

Example output:

markdown
## Candidate's Relevant Experience
- Current role: Software Development Engineer & Team Lead at XAMTAC CONSULTING LLC
- Key achievements:
1. Led development of AI-powered marketing ERP system
2. Architected features increasing adoption and client retention
3. Implemented various functionalities improving efficiency and engagement
4. Experience with CI/CD pipelines and automated testing
5. Led a 14-member development team
6. Developed key client projects (Poshmom E-Commerce, TalkTales)

## Technical Skills
- Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3/SASS
- Frameworks/Libraries: React.js, Next.js, Node, Express.js, Redux, Jest, Cypress
- Tools & Technologies: Git, Docker, AWS, Azure, Firebase
- Concepts: Agile/Scrum, Microservices Architecture, RESTful APIs, Test-Driven Development, CI/CD


Note: Adapt the summary as needed based on the specific details and emphasis of each candidate's resume.

The resume data is as following -

${input.resumeData}
`);
      const generatedCoverLetterGenerationData = await getAzureGPTQuery(`
  # Cover Letter Instructions Generator Prompt

Use the following steps to create tailored cover letter generation instructions based on a given job description:

1. Analyze the job description to identify:
   - Company name
   - Position title
   - Key technical requirements
   - Desired soft skills
   - Company culture and values
   - Any specific projects or products mentioned
   - Company size and growth stage

2. Use the identified information to customize the following template:

markdown
## Cover Letter Generation Instructions

1. Header:
   - Include candidate's full name, email, phone number, and website
   - Add LinkedIn and GitHub profile links
   - Include the current date

2. Opening Paragraph:
   - Express enthusiasm for the [Position Title] position at [Company Name]
   - Mention the candidate's current role and years of experience
   - Briefly state how the candidate's background aligns with [Company Name]'s [mention key aspect, e.g., open-source nature, team-oriented products, etc.]

3. Second Paragraph - Technical Expertise:
   - Highlight relevant technical skills that match [Company Name]'s stack [list key technologies from job description]
   - Emphasize experience with [mention specific types of products or challenges from job description]
   - [If applicable] Mention any open-source contributions or interests

4. Third Paragraph - Team Leadership and Communication:
   - Discuss experience [mention specific leadership or communication requirements from job description]
   - Highlight strong communication skills, especially in [mention work environment, e.g., remote settings]
   - Emphasize ability to [mention specific collaboration or community engagement aspects from job description]

5. Fourth Paragraph - Product Development and Ownership:
   - Describe experience in [mention specific development processes or methodologies from job description]
   - Highlight ability to [mention specific decision-making or problem-solving skills from job description]
   - Mention experience with [mention specific tools or practices from job description, e.g., CI/CD, testing]

6. Fifth Paragraph - Adaptability and Growth Mindset:
   - Express comfort with [mention specific challenges or environment from job description, e.g., ambiguity, rapid growth]
   - Highlight ability to [mention diverse responsibilities or skills from job description]
   - Mention willingness to [mention specific contributions beyond coding, e.g., company strategy, culture]

7. Closing Paragraph:
   - Reiterate enthusiasm for the position and [Company Name]'s mission
   - Express eagerness to contribute to the team and [mention specific product or project if applicable]
   - Include a call to action for further discussion or interview

8. Signature:
   - Include a professional closing (e.g., "Sincerely," or "Best regards,")
   - Type full name

## Tone and Style Guidelines
- Tone: Professional yet [mention specific tone that reflects company culture, e.g., conversational, innovative, etc.]
- Style: Clear, concise, and engaging
- Personalization: Include specific examples from the candidate's experience that directly relate to [Company Name]'s needs
- Length: Aim for about 400-500 words
- Format: Use proper business letter format with appropriate greetings and closings

## Additional Notes
- Emphasize the candidate's experience with [mention specific types of products or skills highly valued by the company]
- Highlight any achievements that demonstrate impact and quantifiable results
- [If applicable] Subtly address the job description's note about diversity by mentioning any relevant experiences or perspectives the candidate brings
- Avoid directly mentioning or comparing with other companies; focus on what makes the candidate a great fit for [Company Name] specifically
- Ensure all social links and contact information are correctly formatted and active


3. Customize each section of the template based on the specific requirements and emphases in the job description.

4. Add or remove sections as necessary to best reflect the priorities of the position and company.

5. Ensure that the instructions maintain a balance between being specific to the job and company, while still allowing for personalization by the candidate.

6. Review the generated instructions to ensure they capture all key aspects of the job description and company culture.

To use this prompt, provide the full job description text and instruct the AI to generate cover letter instructions based on the given information. The resulting output will be a set of tailored instructions for creating a cover letter that closely aligns with the specific job and company requirements.
  
The Job Description is as follows - 
${input.jobDescription}
`);

      const generatedCoverLetter = await getAzureGPTQuery(`
  # Cover Letter Generation Prompt

## Candidate Information
- Name: Anish Prashun
- Email: anishprashun118@gmail.com
- Phone: +91 79706 15211
- LinkedIn: linkedin.com/in/anishpras118
- GitHub: github.com/Anishpras
- Website: anishprashun.me
- Date: [Current Date in format: Month Day, Year]

${generatedJobDescription}

${generatedResumeData}

## Cover Letter Generation Instructions

${generatedCoverLetterGenerationData}

NOTE- Do not use placeholder text like [Company Name] or [Position Title] in the final cover letter. Replace them with the actual company name and position title from the job description. Also DO NOT ADD Texts like "This is you cover letter based...." in the final cover letter. 
  `);

      return {
        generatedCoverLetter,
        generatedJobDescription,
        generatedResumeData,
        generatedCoverLetterGenerationData,
      };
    }),
  generateCoverLetterFromTemplate: rateLimitedPublicProcedure
    .input(z.object({ jobDescription: z.string(), resumeData: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Starting cover letter generation process");

        const generatedData: GeneratedData = {
          jobDescription: await getGroqApi(
            generatePrompt("jobDescription", input.jobDescription),
          ),
          resumeData: await getGroqApi(
            generatePrompt("resumeData", input.resumeData),
          ),
          coverLetterInstructions: await getGroqApi(
            generatePrompt("coverLetterInstructions", input.jobDescription),
          ),
        };

        const coverLetterPrompt = generateCoverLetterPrompt(generatedData);

        const generatedCoverLetter = await getGroqApi(coverLetterPrompt);

        const extractedCoverLetter = extractCoverLetter(generatedCoverLetter);

        const formattedCoverLetter = formatCoverLetter(extractedCoverLetter);

        await ctx.db.guestCoverLetter.create({
          data: {
            jobDescription: input.jobDescription,
            resumeData: input.resumeData,
            jobDescriptionGeneratedContent: generatedData.jobDescription,
            resumeGeneratedContent: generatedData.resumeData,
            coverLetterGeneratedContent: formattedCoverLetter,
            coverLetterInstructions: generatedData.coverLetterInstructions,
          },
        });

        return {
          coverLetter: formattedCoverLetter,
        };
      } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new TRPCClientError(
          "Failed to generate cover letter: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }),
  generateCoverLetterForSelectedResume: protectedProcedure
    .input(
      z.object({
        jobDescription: z.string(),
        resumeId: z.string(),
        jobTitle: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const resume = await ctx.db.resume.findUnique({
          where: {
            id: input.resumeId,
          },
        });
        if (!resume?.generatedContent) {
          throw new TRPCClientError("Resume not found");
        }
        const generatedData: GeneratedData = {
          jobDescription: await getGroqApi(
            generatePrompt("jobDescription", input.jobDescription),
          ),
          resumeData: resume.generatedContent,
          coverLetterInstructions: await getGroqApi(
            generatePrompt("coverLetterInstructions", input.jobDescription),
          ),
        };

        const coverLetterPrompt = generateCoverLetterPrompt(generatedData);

        const generatedCoverLetter = await getGroqApi(coverLetterPrompt);

        const extractedCoverLetter = extractCoverLetter(generatedCoverLetter);

        const formattedCoverLetter = formatCoverLetter(extractedCoverLetter);
        const createdCoverLetter = await ctx.db.coverLetter.create({
          data: {
            jobDescription: input.jobDescription,
            jobDescriptionGeneratedContent: generatedData.jobDescription,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        await ctx.db.coverLetterHistory.create({
          data: {
            jobTitle: input.jobTitle,
            coverLetterHistoryData: formattedCoverLetter,
            coverLetter: {
              connect: {
                id: createdCoverLetter.id,
              },
            },
          },
        });
        return {
          coverLetter: formattedCoverLetter,
          jobSummary: generatedData.jobDescription,
          candidateSummary: generatedData.resumeData,
          message: "Cover letter generated successfully",
        };
      } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new TRPCClientError(
          "Failed to generate cover letter: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }),
  generateCoverLetterHistory: protectedProcedure
    .input(
      z.object({
        coverLetterId: z.string(),
        coverLetterContent: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.coverLetterHistory.create({
        data: {
          coverLetterHistoryData: input.coverLetterContent,
          coverLetter: {
            connect: {
              id: input.coverLetterId,
            },
          },
        },
      });
      return {
        success: true,
      };
    }),
});

// {
//   "coverLetter": "17 July, 2024\n\nDear Hiring Manager,",
//   "jobSummary": "Here is a concise summary of the job description in markdown format:\n\n**Position Title and Company Name**\n* Position: Full-Stack Engineer\n* Company: Lightdash\n\n**Key Requirements and Responsibilities**\n* Build and own features from start to finish\n* Collaborate with a small, high-performing team\n* Communicate effectively, especially in a remote team\n* Contribute to company strategy and product development\n* Experience with open source projects and good design (UI/UX)\n* Comfortable with ambiguity and making trade-off decisions\n* Ability to work independently and as part of a team\n\n**Company Culture and Values**\n* Emphasis on collaboration, inclusivity, and diversity\n* Open source product with a focus on community engagement\n* Values transparency, accountability, and continuous improvement\n* Encourages feedback and iteration\n\n**Specific Projects, Products, or Technologies**\n* Tech stack: Typescript, React, Node, SQL, express, react-hooks, Docker, GCP\n\n**Remote Position and Location Requirements**\n* Remote position, no specific location requirements mentioned\n\n**Additional Notes**\n* The company encourages candidates from diverse backgrounds to apply and is committed to building an inclusive workplace.",
//   "candidateSummary": "Here is a concise summary of the candidate's resume in markdown format:\n\n**Summary**\n================\n\n### Candidate Information\n------------------------\n\n* Name: Anish Prashun\n* Current Role: Software Development Engineer & Team Lead at XAMTAC CONSULTING LLC\n\n### Key Achievements\n--------------------\n\n* Spearheaded the creation of an AI-powered marketing ERP system, driving 25% increase in client conversion rates and supporting 1K+ daily active users\n* Architected key features of Xamtac SaaS platform, driving 35% increase in adoption and 30% boost in client retention\n* Engineered asset library system and multi-channel campaign tool, reducing time-to-market by 40% and improving campaign coordination by 45%\n* Designed client portal and email marketing suite with no-code builder, elevating email engagement by 50%\n\n### Technical Skills\n-------------------\n\n* **Languages**: JavaScript (ES6+), TypeScript, Rust, Solidity, SQL, PostgreSQL, MongoDB, HTML5, CSS3/SASS\n* **Frameworks/Libraries**: React.js, Next.js, Node, Hono, Nest.js, Bun, tRPC, Express.js, Django, GraphQL, Redux, Jest, Cypress\n* **Tools & Technologies**: Git, Docker, Jenkins, Prisma, Drizzle, AWS (EC2, ECS, ECR, S3, Lambda, SES, Route53, SNS, RDS), Azure (Container Apps, App Service, Container Registries, Postgres Database, Storage Accounts), Firebase, Redis, Elasticsearch\n* **Concepts**: Agile/Scrum, Microservices Architecture, RESTful APIs, Test-Driven Development, Blockchain, CI/CD, Serverless Computing\n\n### Leadership Experience\n-------------------------\n\n* Promoted to Team Lead, mentoring and guiding a 14-member development team, elevating overall code quality by 35%\n* Led development of key client projects as agency representative, including Poshmom E-Commerce and TalkTales\n\n### Education\n------------\n\n* B.Tech in Computer Science from AMITY UNIVERSITY, PATNA (2019-2023)\n\n### Achievements\n----------------\n\n* Smart India Hackathon Winner\n* Secured Intellectual Property Rights (Copyright) for A-Lab project, impacting 10,000+ students across India\n* Achieved Postman Student Expert certification"
// }
