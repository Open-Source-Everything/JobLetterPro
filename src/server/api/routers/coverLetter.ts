import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getAzureGPTQuery } from "@/utils/azureGptApi";
import { get } from "http";

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
   - Optional: Include links to portfolio or relevant projects

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
  `);

      return {
        generatedCoverLetter,
        generatedJobDescription,
        generatedResumeData,
        generatedCoverLetterGenerationData,
      };
    }),

  //   create: protectedProcedure
  //     .input(z.object({ name: z.string().min(1) }))
  //     .mutation(async ({ ctx, input }) => {
  //       // simulate a slow db call
  //       await new Promise((resolve) => setTimeout(resolve, 1000));

  //       return ctx.db.post.create({
  //         data: {
  //           name: input.name,
  //           createdBy: { connect: { id: ctx.session.user.id } },
  //         },
  //       });
  //     }),

  //   getLatest: protectedProcedure.query(({ ctx }) => {
  //     return ctx.db.post.findFirst({
  //       orderBy: { createdAt: "desc" },
  //       where: { createdBy: { id: ctx.session.user.id } },
  //     });
  //   }),

  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
});