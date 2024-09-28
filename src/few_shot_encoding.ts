import dataset from "./training_set/dataset.json";
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
  MessageContent
} from "@langchain/core/messages";
import { BASE_PROMPT, DATASET_LIMIT_FOR_LLM } from "./constants";
import { extractUrlContent } from "./extract_url_content";
import { ChatOpenAI } from "@langchain/openai";

const fewShotEncoding = async (): Promise<MessageContent> => {
  const messages = [new SystemMessage({ content: BASE_PROMPT })];
  let datasets = 0;

  for (const example of dataset.examples) {
    if (datasets >= DATASET_LIMIT_FOR_LLM) {
      break;
    }
    const articleContent = await extractUrlContent(example.url);
    messages.push(new HumanMessage({ content: articleContent }));
    messages.push(new AIMessage({ content: example.post_content }));
    console.log("Article content pulled ====================== \n\n");
    datasets++;
  }

  const articleUrlToSummarize =
    "https://www.linkedin.com/pulse/how-github-suggests-tags-your-repositories-saurav-prateek/";
  const articleContentToSummarize = await extractUrlContent(
    articleUrlToSummarize
  );
  messages.push(new HumanMessage({ content: articleContentToSummarize }));

  const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-4o",
  });

  const summarizedContent = await model.invoke(messages);
  console.log(summarizedContent.content);
  return summarizedContent.content;
};

export { fewShotEncoding };
