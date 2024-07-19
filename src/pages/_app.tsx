import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { DefaultSeo, SoftwareAppJsonLd } from "next-seo";

import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider>
      <SessionProvider session={session}>
        <DefaultSeo
          title="JobLetterPro: AI Cover Letter Generator | Stand Out to Employers"
          description="Create professional, ATS-optimized cover letters in seconds with JobLetterPro. Our AI-powered tool tailors your application to job descriptions, boosting your chances of landing interviews. Try it now!"
        />
        <SoftwareAppJsonLd
          name="JobLetterPro"
          price="0.00"
          priceCurrency="USD"
          aggregateRating={{ ratingValue: "4.8", reviewCount: "1253" }}
          operatingSystem="WEB"
          applicationCategory="BusinessApplication"
          offers={{
            price: "0",
            priceCurrency: "USD",
            priceValidUntil: "2024-10-31",
            availability: "https://schema.org/OnlineOnly",
          }}
          description="AI-powered cover letter generator that creates tailored, ATS-optimized cover letters in seconds."
          keywords="cover letter generator, AI cover letter, job application, ATS-optimized, resume helper"
          features={[
            "AI-powered cover letter generation",
            "ATS optimization",
            "Tailored to specific job descriptions",
            "Professional templates",
            "Instant creation",
          ]}
        />
        <div className={GeistSans.className}>
          <Component {...pageProps} />
          <Toaster />
        </div>
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
