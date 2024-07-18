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
import Link from "next/link";
import { Fragment, useState } from "react";
import { Tabs, rem } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { extractPdfData } from "@/lib/pdf-extracter";
import {
  TbCheck,
  TbCopy,
  TbFile,
  TbPhoto,
  TbUpload,
  TbX,
} from "react-icons/tb";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [startGeneration, setStartGeneration] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  return (
    <main className="p-4">
      <div className="h-20"></div>
      {/* <div>
        <section>
          <div className="container mx-auto grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
            <div>
              <div className="max-w-xl text-center md:max-w-full md:text-left">
                <h1 className=" text-5xl font-semibold leading-none md:text-6xl">
                  AI Cover Letter Generator
                </h1>
                <p className=" mb-8 mt-6 text-lg sm:mb-12">
                  The AI Cover Letter Generator will write you tailored,
                  position-specific summaries in a matter of seconds. Start
                  generating resume summaries that showcase your strongest
                  career wins in a way that will instantly grab the attention of
                  future employers.
                </p>
                <div className={cn(buttonVariants({}))}>
                  <Link href="/cover-letter" rel="noopener noreferrer">
                    <span>Generate Your Cover Letter</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-teal-1 rounded-2xl">
              <div className=" ">
                <img
                  src="assets/svg/Business_SVG.svg"
                  alt=""
                  className="xl:h-112 2xl:h-128 h-72 object-contain sm:h-80 lg:h-96"
                />
              </div>
            </div>
          </div>
        </section>
      </div> */}
      <div className="relative flex h-full w-full items-center justify-center py-20">
        <div>
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl font-semibold leading-none md:text-6xl">
              AI Cover Letter Generator
            </h1>
            <p className="mb-8 mt-6 text-lg sm:mb-12">
              The AI Cover Letter Generator will write you tailored,
              position-specific summaries in a matter of seconds. Start
              generating resume summaries that showcase your strongest career
              wins in a way that will instantly grab the attention of future
              employers.
            </p>
            <button
              className={cn(
                buttonVariants({
                  className: "rounded-3xl transition-all hover:scale-105",
                }),
              )}
              onClick={() => setStartGeneration(true)}
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

      <section className="container mx-auto flex flex-col items-center justify-center py-20">
        <div>
          <h2 className="text-center text-5xl font-semibold">
            A Smarter Way to Write Your Cover Letters
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 py-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex w-full flex-col gap-4">
            <div className="flex max-w-full items-center justify-center rounded-2xl border">
              <img
                className="rounded-2xl"
                width="379.5"
                loading="lazy"
                src="https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <h2 className="text-xl font-medium">
                Write a Tailored Cover Letter In Seconds
              </h2>
              <p>
                The AI Cover Letter Generator writes a highly personalized cover
                letter based on both your career history and the requirements of
                the position you’re applying for.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex max-w-full items-center justify-center rounded-2xl border">
              <img
                className="rounded-2xl"
                width="379.5"
                loading="lazy"
                src="https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <h2 className="text-xl font-medium">
                Write a Tailored Cover Letter In Seconds
              </h2>
              <p>
                The AI Cover Letter Generator writes a highly personalized cover
                letter based on both your career history and the requirements of
                the position you’re applying for.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex max-w-full items-center justify-center rounded-2xl border">
              <img
                className="rounded-2xl"
                width="379.5"
                loading="lazy"
                src="https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/653067941c13f5065f985414_CoveLetter_Ai.png"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <h2 className="text-xl font-medium">
                Write a Tailored Cover Letter In Seconds
              </h2>
              <p>
                The AI Cover Letter Generator writes a highly personalized cover
                letter based on both your career history and the requirements of
                the position you’re applying for.
              </p>
            </div>
          </div>
        </div>

        <Button className="h-12 rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105">
          Create a Cover Letter in Seconds
        </Button>
      </section>

      <div></div>
    </main>
  );
}

const CoverLetterGeneratorForm = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [file, setFile] = useState<File>();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [startGeneration, setStartGeneration] = useState(false);
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
                        Drag images here or click to select files
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not
                        exceed 5mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
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
                  // minRows={28}
                  // maxRows={28}
                />
              </Tabs.Panel>
            </Tabs>
            {file && (
              <div className="flex w-full items-center justify-center">
                <Badge className="">{file?.name}</Badge>
              </div>
            )}
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
              <h3 className="text-xl font-medium">
                Your cover letter is below
              </h3>
              <span className="text-sm">
                You can adjust this draft to further tailor it to your needs and
                use [] Free's suggestions to ensure your final product shines.
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

                setStartGeneration(true);
                mutate({
                  jobDescription: jobDescription,
                  resumeData: resume,
                });
              }}
              className="flex h-12 items-center justify-center rounded-3xl px-6 py-4 text-xl transition-all hover:scale-105"
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
              <div>
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
