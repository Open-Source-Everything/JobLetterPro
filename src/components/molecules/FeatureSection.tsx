import React from "react";
import { Button } from "@/components/ui/button";

const FeatureCard = ({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) => (
  <div className="relative flex w-full flex-col gap-4 overflow-hidden rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg">
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -right-20 -top-20 h-64 w-64 opacity-10"
    >
      <path
        fill={color}
        d="M39.5,-65.3C50.2,-56.7,57.7,-44.3,65.1,-31.1C72.5,-17.9,79.8,-3.9,79.2,10.1C78.6,24.1,70.1,38.1,59.3,48.9C48.5,59.7,35.3,67.3,21.1,71.3C6.9,75.4,-8.3,75.8,-22.6,72.1C-36.9,68.3,-50.4,60.3,-60.1,49C-69.8,37.7,-75.8,23.1,-77.7,7.8C-79.6,-7.5,-77.3,-23.5,-70.5,-37.3C-63.6,-51.1,-52.1,-62.7,-38.8,-69.8C-25.5,-76.9,-10.4,-79.5,2.6,-83.6C15.5,-87.8,28.8,-73.9,39.5,-65.3Z"
        transform="translate(100 100)"
      />
    </svg>

    <div className="relative z-10 flex flex-col gap-y-3">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered Cover Letter Generation",
      description:
        "Our advanced AI analyzes your resume and the job description to create a tailored, professional cover letter in seconds, saving you time and effort.",
      color: "#4A90E2", // Soft Blue
    },
    {
      title: "ATS-Optimized Content",
      description:
        "JobLetterPro ensures your cover letter includes relevant keywords and phrases, increasing your chances of passing through Applicant Tracking Systems (ATS).",
      color: "#FF6B6B", // Coral Pink
    },
    {
      title: "Customizable Professional Templates",
      description:
        "Easily customize your cover letter to match your personal style and the company's culture.",
      color: "#50E3C2", // Mint Green
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
