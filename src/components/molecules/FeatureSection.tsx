import React from "react";
import { Button } from "@/components/ui/button";

const FeatureCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="flex w-full flex-col gap-4">
    <div className="flex max-w-full items-center justify-center rounded-2xl border">
      <img
        className="rounded-2xl"
        width="379.5"
        height="253"
        loading="lazy"
        src={imageSrc}
        alt={title}
      />
    </div>
    <div className="flex flex-col gap-y-3">
      <h3 className="text-xl font-medium">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      imageSrc:
        "https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png",
      title: "AI-Powered Cover Letter Generation",
      description:
        "Our advanced AI analyzes your resume and the job description to create a tailored, professional cover letter in seconds, saving you time and effort.",
    },
    {
      imageSrc:
        "https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png",
      title: "ATS-Optimized Content",
      description:
        "JobLetterPro ensures your cover letter includes relevant keywords and phrases, increasing your chances of passing through Applicant Tracking Systems (ATS).",
    },
    {
      imageSrc:
        "https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png",
      title: "Customizable Professional Templates",
      description:
        "Choose from a variety of industry-specific templates and easily customize your cover letter to match your personal style and the company's culture.",
    },
  ];

  return (
    <section className="container mx-auto flex flex-col items-center justify-center py-20">
      <h2 className="mb-8 text-center text-4xl font-semibold">
        Revolutionize Your Job Application Process with JobLetterPro
      </h2>
      <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
      <a href="#generate-cover-letter">
        <Button className="h-12 rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105">
          Create Your Professional Cover Letter Now
        </Button>
      </a>
    </section>
  );
};

export default FeaturesSection;
