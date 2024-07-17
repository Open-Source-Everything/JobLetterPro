export function generatePrompt(
  type: keyof GeneratedData,
  input: string,
): string {
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

export function generateCoverLetterPrompt(
  generatedData: GeneratedData,
): string {
  return `
        Create a powerful and personalized cover letter using the following information:
    
        Job Description Summary:
        ${generatedData.jobDescription}
    
        Candidate's Relevant Experience:
        ${generatedData.resumeData}
    
        Cover Letter Writing Instructions:
        ${generatedData.coverLetterInstructions}
    
        Please structure the cover letter with the following sections, each wrapped in XML-style tags:
        <header>: Include the current date in format DD Month, Year example 17 July, 2024 and candidate's name. DO NOT ADD ANY DATE. ONLY ADD THE TODAY'S DATE.
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

export function extractCoverLetter(generatedText: string): string {
  // Remove any content before the <header> tag
  const startIndex = generatedText.indexOf("<header>");
  if (startIndex !== -1) {
    generatedText = generatedText.slice(startIndex);
  }

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
    const regex = new RegExp(`<${section}>([\s\S]*?)<\/${section}>`, "i");
    const match = generatedText.match(regex);
    if (match?.[1]) {
      extractedContent += `<${section}>${match[1].trim()}</${section}>\n\n`;
    }
  });

  // If we extracted any content, return it
  if (extractedContent.trim()) {
    return extractedContent.trim();
  }

  // If all else fails, return the original text
  return generatedText;
}

export function formatCoverLetter(coverLetter: string): string {
  // Remove XML tags
  let formatted = coverLetter.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove extra newlines
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Trim whitespace
  return formatted.trim();
}

export type GeneratedData = {
  jobDescription: string;
  resumeData: string;
  coverLetterInstructions: string;
};
