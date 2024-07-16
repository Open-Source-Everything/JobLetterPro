import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getAzureGPTQuery } from "@/utils/azureGptApi";
import { getGroqApi } from "@/utils/getGroqApi";
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

  //   generateCoverLetterFromTemplate: publicProcedure
  //     .input(z.object({ jobDescription: z.string(), resumeData: z.string() }))
  //     .mutation(async ({ input }) => {
  //       const generatedJobDescription = await getAzureGPTQuery(`
  //         # Job Description Summary Extraction Prompt

  // Use the following steps to extract key information from a job description and format it into a concise summary:

  // 1. Identify the position title and company name.

  // 2. Determine if the company or project is open-source (if mentioned).

  // 3. Extract key requirements and responsibilities from the job description. Look for phrases like "we're looking for," "you should have," "what the job involves," etc.

  // 4. Consolidate similar points and prioritize the most important requirements.

  // 5. Format the extracted information as follows:

  // markdown
  // ## Job Description Summary
  // - Position: [Position Title]
  // - Company: [Company Name] [(Open-source project) if applicable]
  // - Key Requirements:
  //   1. [Requirement 1]
  //   2. [Requirement 2]
  //   3. [Requirement 3]
  //   ...

  // 6. Aim for 6-10 key requirements, focusing on the most crucial aspects of the role.

  // 7. Use clear, concise language for each requirement.

  // 8. Ensure that the summary captures the essence of the role and the company's values.

  // Example output:

  // markdown
  // ## Job Description Summary
  // - Position: Full-stack engineer
  // - Company: Company (Open-source project)
  // - Key Requirements:
  //   1. Experience in building interactive products for teams
  //   2. Appreciation for good UI/UX design
  //   3. Excellent communication skills, especially in remote settings
  //   4. Interest or experience in open-source projects
  //   5. Ability to build and own features from start to finish
  //   6. Comfort with ambiguity in a rapidly growing small team
  //   7. Willingness to engage with the community and produce content
  //   8. Ability to make trade-off decisions between speed and engineering excellence

  // Note: Adapt the summary as needed based on the specific details and emphasis of each job description.

  // The Job description -

  // ${input.jobDescription}
  // `);
  //       const generatedResumeData = await getAzureGPTQuery(`
  //   # Candidate Experience and Skills Extraction Prompt

  // Use the following steps to extract key information from a candidate's resume and format it into a concise summary of relevant experience and technical skills:

  // 1. Identify the candidate's current or most recent role and employer.

  // 2. Extract 4-6 key achievements or responsibilities from the candidate's work experience, prioritizing those most relevant to the job they're applying for.

  // 3. Identify the candidate's technical skills, categorizing them into:
  // - Languages
  // - Frameworks/Libraries
  // - Tools & Technologies
  // - Concepts

  // 4. Format the extracted information as follows:

  // markdown
  // ## Candidate's Relevant Experience
  // - Current role: [Job Title] at [Company Name]
  // - Key achievements:
  // 1. [Achievement 1]
  // 2. [Achievement 2]
  // 3. [Achievement 3]
  // ...

  // ## Technical Skills
  // - Languages: [List of programming languages]
  // - Frameworks/Libraries: [List of relevant frameworks and libraries]
  // - Tools & Technologies: [List of tools and technologies]
  // - Concepts: [List of relevant concepts and methodologies]

  // 5. For the key achievements:
  // - Start each point with an action verb
  // - Include quantifiable results where possible
  // - Focus on achievements that demonstrate leadership, technical skills, or significant impact

  // 6. For the technical skills:
  // - List the most relevant and advanced skills first
  // - Include version numbers or specific details if mentioned in the resume (e.g., JavaScript (ES6+))
  // - Separate different skills with commas

  // 7. Ensure that the summary captures the candidate's most impressive and relevant experiences and skills.

  // Example output:

  // markdown
  // ## Candidate's Relevant Experience
  // - Current role: Software Development Engineer & Team Lead at XAMTAC CONSULTING LLC
  // - Key achievements:
  // 1. Led development of AI-powered marketing ERP system
  // 2. Architected features increasing adoption and client retention
  // 3. Implemented various functionalities improving efficiency and engagement
  // 4. Experience with CI/CD pipelines and automated testing
  // 5. Led a 14-member development team
  // 6. Developed key client projects (Poshmom E-Commerce, TalkTales)

  // ## Technical Skills
  // - Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3/SASS
  // - Frameworks/Libraries: React.js, Next.js, Node, Express.js, Redux, Jest, Cypress
  // - Tools & Technologies: Git, Docker, AWS, Azure, Firebase
  // - Concepts: Agile/Scrum, Microservices Architecture, RESTful APIs, Test-Driven Development, CI/CD

  // Note: Adapt the summary as needed based on the specific details and emphasis of each candidate's resume.

  // The resume data is as following -

  // ${input.resumeData}
  // `);
  //       const generatedCoverLetterGenerationData = await getAzureGPTQuery(`
  //   # Cover Letter Instructions Generator Prompt

  // Use the following steps to create tailored cover letter generation instructions based on a given job description:

  // 1. Analyze the job description to identify:
  //    - Company name
  //    - Position title
  //    - Key technical requirements
  //    - Desired soft skills
  //    - Company culture and values
  //    - Any specific projects or products mentioned
  //    - Company size and growth stage

  // 2. Use the identified information to customize the following template:

  // markdown
  // ## Cover Letter Generation Instructions

  // 1. Header:
  //    - Include candidate's full name, email, phone number, and website
  //    - Add LinkedIn and GitHub profile links
  //    - Include the current date

  // 2. Opening Paragraph:
  //    - Express enthusiasm for the [Position Title] position at [Company Name]
  //    - Mention the candidate's current role and years of experience
  //    - Briefly state how the candidate's background aligns with [Company Name]'s [mention key aspect, e.g., open-source nature, team-oriented products, etc.]

  // 3. Second Paragraph - Technical Expertise:
  //    - Highlight relevant technical skills that match [Company Name]'s stack [list key technologies from job description]
  //    - Emphasize experience with [mention specific types of products or challenges from job description]
  //    - [If applicable] Mention any open-source contributions or interests

  // 4. Third Paragraph - Team Leadership and Communication:
  //    - Discuss experience [mention specific leadership or communication requirements from job description]
  //    - Highlight strong communication skills, especially in [mention work environment, e.g., remote settings]
  //    - Emphasize ability to [mention specific collaboration or community engagement aspects from job description]

  // 5. Fourth Paragraph - Product Development and Ownership:
  //    - Describe experience in [mention specific development processes or methodologies from job description]
  //    - Highlight ability to [mention specific decision-making or problem-solving skills from job description]
  //    - Mention experience with [mention specific tools or practices from job description, e.g., CI/CD, testing]

  // 6. Fifth Paragraph - Adaptability and Growth Mindset:
  //    - Express comfort with [mention specific challenges or environment from job description, e.g., ambiguity, rapid growth]
  //    - Highlight ability to [mention diverse responsibilities or skills from job description]
  //    - Mention willingness to [mention specific contributions beyond coding, e.g., company strategy, culture]

  // 7. Closing Paragraph:
  //    - Reiterate enthusiasm for the position and [Company Name]'s mission
  //    - Express eagerness to contribute to the team and [mention specific product or project if applicable]
  //    - Include a call to action for further discussion or interview

  // 8. Signature:
  //    - Include a professional closing (e.g., "Sincerely," or "Best regards,")
  //    - Type full name
  //    - Optional: Include links to portfolio or relevant projects

  // ## Tone and Style Guidelines
  // - Tone: Professional yet [mention specific tone that reflects company culture, e.g., conversational, innovative, etc.]
  // - Style: Clear, concise, and engaging
  // - Personalization: Include specific examples from the candidate's experience that directly relate to [Company Name]'s needs
  // - Length: Aim for about 400-500 words
  // - Format: Use proper business letter format with appropriate greetings and closings

  // ## Additional Notes
  // - Emphasize the candidate's experience with [mention specific types of products or skills highly valued by the company]
  // - Highlight any achievements that demonstrate impact and quantifiable results
  // - [If applicable] Subtly address the job description's note about diversity by mentioning any relevant experiences or perspectives the candidate brings
  // - Avoid directly mentioning or comparing with other companies; focus on what makes the candidate a great fit for [Company Name] specifically
  // - Ensure all social links and contact information are correctly formatted and active

  // 3. Customize each section of the template based on the specific requirements and emphases in the job description.

  // 4. Add or remove sections as necessary to best reflect the priorities of the position and company.

  // 5. Ensure that the instructions maintain a balance between being specific to the job and company, while still allowing for personalization by the candidate.

  // 6. Review the generated instructions to ensure they capture all key aspects of the job description and company culture.

  // To use this prompt, provide the full job description text and instruct the AI to generate cover letter instructions based on the given information. The resulting output will be a set of tailored instructions for creating a cover letter that closely aligns with the specific job and company requirements.

  // The Job Description is as follows -
  // ${input.jobDescription}
  // `);

  //       const generatedCoverLetter = await getAzureGPTQuery(`
  //   # Cover Letter Generation Prompt

  // ## Candidate Information
  // - Name: Anish Prashun
  // - Email: anishprashun118@gmail.com
  // - Phone: +91 79706 15211
  // - LinkedIn: linkedin.com/in/anishpras118
  // - GitHub: github.com/Anishpras
  // - Website: anishprashun.me
  // - Date: [Current Date in format: Month Day, Year]

  // ${generatedJobDescription}

  // ${generatedResumeData}

  // ## Cover Letter Generation Instructions

  // ${generatedCoverLetterGenerationData}
  //   `);
  //       // const data = await getAzureGPTQuery(`
  //       //   can you generate a cover letter for the following job description and resume data?
  //       //   Resume Data as plain text: ${input.resumeData}
  //       //   Job Description as plain text: ${input.jobDescription}
  //       //   `);
  //       // console.log(text);
  //       // return text;
  //       return {
  //         generatedCoverLetter,
  //         generatedJobDescription,
  //         generatedResumeData,
  //         generatedCoverLetterGenerationData,
  //       };
  //     }),
  generateCoverLetterFromTemplate: publicProcedure
    .input(z.object({ jobDescription: z.string(), resumeData: z.string() }))
    .mutation(async ({ input }) => {
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

        console.log("Generated data:", generatedData);

        const coverLetterPrompt = generateCoverLetterPrompt(generatedData);
        console.log("Cover letter prompt:", coverLetterPrompt);

        const generatedCoverLetter = await getGroqApi(coverLetterPrompt);
        console.log("Generated cover letter:", generatedCoverLetter);

        const extractedCoverLetter = extractCoverLetter(generatedCoverLetter);
        console.log("Extracted cover letter:", extractedCoverLetter);

        const formattedCoverLetter = formatCoverLetter(extractedCoverLetter);
        console.log("Formatted cover letter:", formattedCoverLetter);

        return {
          coverLetter: formattedCoverLetter,
          jobSummary: generatedData.jobDescription,
          candidateSummary: generatedData.resumeData,
        };
      } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error(
          "Failed to generate cover letter: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }),
});
type GeneratedData = {
  jobDescription: string;
  resumeData: string;
  coverLetterInstructions: string;
};

function generatePrompt(type: keyof GeneratedData, input: string): string {
  const prompts = {
    jobDescription: `
      Analyze the following job description and provide a concise summary:
      1. Identify the position title and company name.
      2. List 6-8 key requirements and responsibilities, focusing on technical skills, soft skills, and any unique aspects of the role.
      3. Briefly describe the company culture and values if mentioned.
      4. Note any specific projects, products, or technologies mentioned.
      5. Identify if it's a remote position and any location requirements.

      Format the summary as a markdown list. Be concise and specific.

      Job Description:
      ${input}
    `,
    resumeData: `
      Analyze the following resume and provide a concise summary:
      1. State the candidate's name and current or most recent role.
      2. List 4-6 key achievements or responsibilities, prioritizing those most relevant to a software engineering role.
      3. Summarize technical skills, categorizing into: Languages, Frameworks/Libraries, Tools & Technologies, and Concepts.
      4. Highlight any leadership experience or significant projects.
      5. Note any relevant education or certifications.

      Format the summary as a markdown list. Focus on quantifiable achievements and the most advanced or relevant skills.

      Resume:
      ${input}
    `,
    coverLetterInstructions: `
      Based on the job description, provide instructions for writing a powerful cover letter:
      1. Suggest a tone and style that would resonate with the company culture.
      2. List 3-4 key points from the candidate's experience that should be emphasized.
      3. Identify any specific skills or experiences from the job description that should be addressed.
      4. Suggest how to demonstrate enthusiasm for the role and company.
      5. Provide guidance on how to close the letter effectively.

      Format your response as a markdown list of concise, actionable instructions.

      Job Description:
      ${input}
    `,
  };

  return prompts[type];
}

function generateCoverLetterPrompt(generatedData: GeneratedData): string {
  return `
    Create a powerful and personalized cover letter using the following information:

    Job Description Summary:
    ${generatedData.jobDescription}

    Candidate's Relevant Experience:
    ${generatedData.resumeData}

    Cover Letter Writing Instructions:
    ${generatedData.coverLetterInstructions}

    Please structure the cover letter with the following sections, each wrapped in XML-style tags:
    <header>: Include the current date, candidate's name, contact information, and relevant links.
    <greeting>: A personalized salutation.
    <opening_paragraph>: Express enthusiasm and briefly state how the candidate's background aligns with the role.
    <technical_expertise_paragraph>: Highlight relevant technical skills and experiences.
    <leadership_communication_paragraph>: Discuss leadership experience and communication skills.
    <product_development_paragraph>: Describe experience in building and owning features.
    <adaptability_paragraph>: Express comfort with the company's environment and willingness to contribute beyond coding.
    <closing_paragraph>: Reiterate enthusiasm and include a call to action.
    <signature>: Professional closing and signature.

    Ensure the content is engaging, concise, and tailored to the specific job and company. Aim for about 400-500 words total.
  `;
}

function extractCoverLetter(generatedText: string): string {
  // First, try to extract the content between <header> and </signature> tags
  const fullLetterMatch = generatedText.match(/<header>[\s\S]*<\/signature>/);
  if (fullLetterMatch) {
    return fullLetterMatch[0];
  }

  // If that fails, try to extract individual sections
  const sections = [
    "header",
    "greeting",
    "opening_paragraph",
    "technical_expertise_paragraph",
    "leadership_communication_paragraph",
    "product_development_paragraph",
    "adaptability_paragraph",
    "closing_paragraph",
    "signature",
  ];

  let extractedContent = "";
  sections.forEach((section) => {
    const regex = new RegExp(`<${section}>[\\s\\S]*?<\/${section}>`, "g");
    const match = generatedText.match(regex);
    if (match) {
      extractedContent += match[0] + "\n\n";
    }
  });

  // If we extracted any content, return it
  if (extractedContent.trim()) {
    return extractedContent.trim();
  }

  // If all else fails, return the original text
  return generatedText;
}

function formatCoverLetter(coverLetter: string): string {
  // Remove XML tags
  let formatted = coverLetter.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove extra newlines
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Trim whitespace
  return formatted.trim();
}
