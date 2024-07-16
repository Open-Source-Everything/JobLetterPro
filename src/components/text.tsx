import { useState } from "react";

import { extractPdfData } from "@/lib/pdf-extracter";

const PdfTextExtractor = () => {
  const [text, setText] = useState("");

  const handleFileChange = async (event: File | null) => {
    const file = event;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const text = await extractPdfData(fileUrl);
      setText(text);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e?.target?.files)
            void handleFileChange(e?.target?.files[0] as File | null);
        }}
      />
      <h1>Extracted PDF Text</h1>
      <p>{text}</p>
    </div>
  );
};

export default PdfTextExtractor;
