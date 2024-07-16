
import { api } from "@/utils/api";
import React, { useState } from "react";

const Test = () => {
  const { mutate } = api.coverLetter.jobDescription.useMutation();
  const { mutate: mutate2 } = api.coverLetter.resumeData.useMutation();
  const { mutate: mutate3 } = api.coverLetter.generateCoverLetter.useMutation();
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  return (
    <div className="flex flex-col">
      <input
        type="textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-56 w-full rounded-lg border border-gray-300 p-2"
      />
      <button
        onClick={() =>
          mutate({
            text: value,
          })
        }
      >
        Submit
      </button>
      <input
        type="textarea"
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        className="h-56 w-full rounded-lg border border-gray-300 p-2"
      />
      <button
        onClick={() =>
          mutate2({
            text: value2,
          })
        }
      >
        Submit
      </button>
      <button
        onClick={() =>
          mutate3({
            jobDescription: value,
            resumeData: value2,
          })
        }
      >
        Submit for cover letter
      </button>
       <PdfTextExtractor />
    </div>
  );
};

export default Test;
