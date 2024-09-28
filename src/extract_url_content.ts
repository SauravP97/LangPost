import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import type { Document } from "@langchain/core/documents";

const extractUrlContent = async (url: string): Promise<string> => {
  const loader = new CheerioWebBaseLoader(url, { selector: "article" });
  const docs = await loader.load();

  return docs.map((doc) => doc.pageContent).join(" \n\n ");
};

export { extractUrlContent };
