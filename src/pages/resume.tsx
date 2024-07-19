import { api } from "@/utils/api";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState(null);

  const uploadAndParseMutation = api.resume.uploadAndParse.useMutation({
    onSuccess: (data) => {
      setParsedResume(data);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const base64String = (event.target.result as string).split(",")[1]; // Get base64 part
        await uploadAndParseMutation.mutateAsync({
          fileName: file.name,
          fileType: file.type as
            | "application/pdf"
            | "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          fileBuffer: base64String,
        });
      }
    };
    reader.readAsDataURL(file); // Read as Data URL instead of ArrayBuffer
  };

  return (
    <div>
      <h1>Resume Parser</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
        <button type="submit">Upload and Parse</button>
      </form>
      {parsedResume && (
        <div>
          <h2>Parsed Resume</h2>
          <pre>{JSON.stringify(parsedResume, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
