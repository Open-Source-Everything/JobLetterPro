/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// Getting pdfjs to work is tricky. The following 3 lines would make it work
// https://stackoverflow.com/a/63486898/7699841

import * as pdfjs from "pdfjs-dist";
// @ts-expect-error
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";


export const extractPdfData = async (fileUrl: string) => {
  const pdf = await pdfjs.getDocument(fileUrl).promise;
  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const textItems = textContent.items;

    const pageText = textItems
      .map((item) => {
        const { str: text } = item as PdfjsTextItem;
        return text;
      })
      .join(" ");
    fullText += pageText + " ";
  }
  return fullText;
};
