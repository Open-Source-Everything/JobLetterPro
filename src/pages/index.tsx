/* eslint-disable react/no-unescaped-entities */
import { Button, buttonVariants } from "@/components/ui/button";
import DotPattern from "@/components/ui/DotPattern";
import { cn } from "@/lib/utils";
import {
  ActionIcon,
  CopyButton,
  Group,
  Loader,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { Fragment, useState } from "react";
import { Tabs, rem } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { extractPdfData } from "@/lib/pdf-extracter";
import { TbCheck, TbCopy, TbFile, TbUpload, TbX } from "react-icons/tb";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import FeaturesSection from "@/components/molecules/FeatureSection";

export default function Home() {
  return (
    <main className="p-4">
      <div className="h-20"></div>
      <div className="relative flex h-full w-full items-center justify-center py-20">
        <div>
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl font-semibold leading-none md:text-6xl">
              JobLetterPro: AI-Powered Cover Letter Generator
            </h1>
            <p className="mb-8 mt-6 text-lg sm:mb-12">
              Create tailored, professional cover letters in seconds with
              JobLetterPro. Our AI-powered tool helps you craft compelling cover
              letters that highlight your strengths and align perfectly with job
              descriptions, giving you a competitive edge in your job search.
            </p>
            <button
              className={cn(
                buttonVariants({
                  className: "rounded-3xl transition-all hover:scale-105",
                }),
              )}
            >
              <>
                <span>Generate Your Cover Letter</span>
              </>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-auto flex min-h-96 w-full max-w-[1200px] items-center justify-center rounded-xl bg-amber-500 p-20">
          <div className="h-full w-full rounded-md bg-white p-10">
            <div className="flex flex-col gap-4 py-4">
              <h3 className="text-3xl font-medium">
                Generate your cover letter with simple 3 step
              </h3>
            </div>
            <CoverLetterGeneratorForm />
          </div>
        </div>
      </div>

      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />
      <FeaturesSection />
    </main>
  );
}

const CoverLetterGeneratorForm = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [file, setFile] = useState<File>();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState({
    resume: false,
    jobDescription: false,
    coverLetter: false,
  });
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  const { mutate } =
    api.coverLetter.generateCoverLetterFromTemplate.useMutation({
      onSuccess: (data) => {
        toast.success("Cover letter generated successfully", {
          dismissible: true,
          closeButton: true,
        });
        setActiveTab((prev) => prev + 1);
        setCoverLetter(data.coverLetter);
        setLoading({ ...loading, coverLetter: false });
      },
      onError: (error) => {
        setLoading({ ...loading, coverLetter: false });
        toast.error(error.message, {
          dismissible: true,
          closeButton: true,
        });
      },
      onMutate: () => {
        setLoading({ ...loading, coverLetter: true });
      },
    });

  const handleFileChange = async (event: File | null) => {
    setLoading({ ...loading, resume: true });
    const file = event;
    if (file) {
      setFile(file);
      const fileUrl = URL.createObjectURL(file);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const text = await extractPdfData(fileUrl);
      setResume(text);
      setLoading({ ...loading, resume: false });
    }
  };
  return (
    <div>
      <div>
        {activeTab === 0 && (
          <div>
            <Tabs defaultValue="upload_resume">
              <Tabs.List>
                <Tabs.Tab
                  classNames={{
                    tabLabel: "text-lg",
                  }}
                  value="upload_resume"
                >
                  Upload Resume
                </Tabs.Tab>
                <Tabs.Tab
                  classNames={{
                    tabLabel: "text-lg",
                  }}
                  value="add_resume"
                >
                  Add Resume
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="upload_resume" className="relative">
                {file ? (
                  <div className="flex items-center justify-center rounded-lg border p-4">
                    <TbFile
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-blue-6)",
                      }}
                    />
                    <Text size="lg" ml="md">
                      {file.name}
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => setFile(undefined)}
                      ml="auto"
                    >
                      <TbX size={20} />
                    </ActionIcon>
                  </div>
                ) : (
                  <Dropzone
                    onDrop={(files) => handleFileChange(files[0] as File)}
                    onReject={(files) => console.log("rejected files", files)}
                    multiple={false}
                    maxSize={5 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                    loading={loading.resume}
                    className="relative"
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      style={{ pointerEvents: "none" }}
                      className="my-4 rounded-lg border border-dashed"
                    >
                      <Dropzone.Accept>
                        <TbUpload
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-blue-6)",
                          }}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <TbX
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-red-6)",
                          }}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <TbFile
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-dimmed)",
                          }}
                        />
                      </Dropzone.Idle>

                      <div>
                        <Text size="xl" inline>
                          Drag resume here or click to select file
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Upload your resume in PDF format (max 5MB)
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}
              </Tabs.Panel>
              <Tabs.Panel value="add_resume">
                <Textarea
                  value={resume}
                  onChange={(event) => setResume(event.currentTarget.value)}
                  placeholder="Paste your resume here"
                  className="my-4 rounded-lg"
                  classNames={{
                    input: "border active:border-primary focus:border-primary",
                  }}
                  styles={{
                    input: {
                      background: "#F3F3F3",
                    },
                  }}
                  rows={15}
                />
              </Tabs.Panel>
            </Tabs>
            {/* {file && (
              <div className="flex w-full items-center justify-center">
                <Badge className="">{file?.name}</Badge>
              </div>
            )} */}
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <div>
              <h3 className="text-xl font-medium">Add job details</h3>
              <span className="text-sm">
                Paste or type the responsibilities and requirements listed in
                the job description.
              </span>
              <Textarea
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(event.currentTarget.value)
                }
                placeholder="Paste the job description here"
                className="my-4 rounded-lg"
                classNames={{
                  input: "border active:border-primary focus:border-primary",
                }}
                styles={{
                  input: {
                    background: "#F3F3F3",
                  },
                }}
                rows={15}
              />
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <div>
              <h3 className="text-xl font-medium mb-3">
                Your cover letter is below
              </h3>
              <span className="text-sm">
                You can now refine this AI-generated cover letter to perfectly
                match your personal style and the specific job requirements. Use
                JobLetterPro's intelligent suggestions to enhance your letter
                and make it stand out to potential employers.
              </span>
              <Textarea
                disabled={loading.coverLetter}
                value={coverLetter ?? ""}
                onChange={(event) => setCoverLetter(event.currentTarget.value)}
                placeholder="Paste the job description here"
                className="my-4 rounded-lg"
                classNames={{
                  input: "border active:border-primary focus:border-primary",
                }}
                styles={{
                  input: {
                    background: "#F3F3F3",
                  },
                }}
                rows={15}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        {activeTab > 0 && (
          <Button
            disabled={
              loading.coverLetter || loading.resume || loading.jobDescription
            }
            onClick={() => setActiveTab((prev) => prev - 1)}
            className="h-12 rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105"
          >
            Previous
          </Button>
        )}
        {activeTab === 0 && (
          <Button
            onClick={() => {
              if (activeTab === 0) {
                if (!resume) {
                  return toast.error("Please upload or paste your resume", {
                    dismissible: true,
                    closeButton: true,
                  });
                }
                setActiveTab((prev) => prev + 1);
              }
            }}
            className="h-12 rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105"
          >
            Next
          </Button>
        )}
        {activeTab === 1 && (
          <Fragment>
            <Button
              disabled={loading.coverLetter}
              onClick={() => {
                if (activeTab === 1) {
                  if (!jobDescription) {
                    return toast.error("Please paste the job description", {
                      dismissible: true,
                      closeButton: true,
                    });
                  }
                }

                mutate({
                  jobDescription: jobDescription,
                  resumeData: resume,
                });
              }}
              className="ml-4 flex h-12 items-center justify-center rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105"
            >
              Generate Cover Letter
              {loading.coverLetter && (
                <Loader
                  color="white"
                  className="fill-white pl-2 text-white"
                  size={20}
                />
              )}
            </Button>
          </Fragment>
        )}
        {activeTab === 2 && (
          <>
            {coverLetter && (
              <div className="ml-4">
                <CopyActionButton value={coverLetter} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CopyActionButton = ({ value }: { value: string }) => (
  <CopyButton value={value} timeout={2000}>
    {({ copied, copy }) => (
      <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
        <ActionIcon
          color={copied ? "teal" : "gray"}
          variant="subtle"
          onClick={copy}
          className={cn(
            buttonVariants(),
            "h-12 min-w-32 rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105",
          )}
        >
          <>
            <p className="pr-2">Copy</p>
            {copied ? (
              <TbCheck style={{ width: rem(16) }} />
            ) : (
              <TbCopy style={{ width: rem(16) }} />
            )}
          </>
        </ActionIcon>
      </Tooltip>
    )}
  </CopyButton>
);
