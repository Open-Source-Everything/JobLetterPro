/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api, type RouterOutputs, RouterInputs } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DashboardLayout, { LayoutContainer } from "@/components/layout";
import { Textarea } from "@mantine/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@mantine/core";
import { Group, Text, rem } from "@mantine/core";
import { TbUpload, TbPhoto, TbX } from "react-icons/tb";
import {
  Dropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
  MIME_TYPES,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import { extractPdfData } from "@/lib/pdf-extracter";

type CoverLetterProps = {
  job_title?: string | undefined;
  company_name?: string | undefined;
  job_requirement?: string | undefined;
  experience?: string | undefined;
  skills?: string | undefined;
  introduction?: string | undefined;
  call_to_action?: string | undefined;
  letterData?: string | undefined;
  tone?: string | undefined;
};

const formSchema = z.object({
  job_requirement: z.string().optional(),
  resume: z.string(),
});
export default function Index({}) {
  const [active, setActive] = useState(0);

  const [text, setText] = useState("");
  const [jd, setJd] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, data } =
    api.coverLetter.generateCoverLetterFromTemplate.useMutation();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleFileChange = async (event: File | null) => {
    const file = event;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const text = await extractPdfData(fileUrl);
      setText(text);
    }
  };

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <DashboardLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="container mx-auto flex max-w-5xl flex-col">
            <LayoutContainer className="p-4">
              <h1 className="text-4xl font-bold">Cover Letter Generator</h1>
              <p className="py-3">
                Speed up the job application process with JobLetterPro
                AI-powered cover letter generator, which helps you create a
                standout cover letter in three quick steps.
              </p>
              <div className="flex flex-col gap-4 py-4">
                <Stepper
                  active={active}
                  onStepClick={setActive}
                  allowNextStepsSelect={false}
                >
                  <Stepper.Step
                    label="First step"
                    description="Add your resume"
                  >
                    <div>
                      <Dropzone
                        onDrop={(files) => handleFileChange(files[0] as File)}
                        onReject={(files) =>
                          console.log("rejected files", files)
                        }
                        multiple={false}
                        maxSize={5 * 1024 ** 2}
                        accept={PDF_MIME_TYPE}
                      >
                        <Group
                          justify="center"
                          gap="xl"
                          mih={220}
                          style={{ pointerEvents: "none" }}
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
                            <TbPhoto
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
                              Attach as many files as you like, each file should
                              not exceed 5mb
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
                    </div>
                    {/* {text} */}
                  </Stepper.Step>
                  <Stepper.Step label="Second step" description="Verify email">
                    Step 2 content: Verify email
                  </Stepper.Step>
                  <Stepper.Completed>
                    Completed, click back button to get to previous step
                  </Stepper.Completed>
                </Stepper>

                <input onChange={(e) => setJd(e.target.value)} />
                <Button
                  onClick={() => {
                    mutate({
                      jobDescription: jd,
                      resumeData: text,
                    });
                  }}
                >
                  Next
                </Button>

                {data}
              </div>
            </LayoutContainer>
          </div>
        </form>
      </Form>
    </DashboardLayout>
  );
}
