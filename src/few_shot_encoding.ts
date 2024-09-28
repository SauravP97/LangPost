import dataset from "./training_set/dataset.json";
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
  MessageContent,
} from "@langchain/core/messages";
import { BASE_PROMPT, DATASET_LIMIT_FOR_LLM } from "./constants";
import { extractUrlContent } from "./extract_url_content";
import { ChatOpenAI } from "@langchain/openai";
import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";

const fewShotEncoding = async (state: GraphState) => {
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

  const articleContentToSummarize = await extractUrlContent(state.url);
  messages.push(new HumanMessage({ content: articleContentToSummarize }));

  const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-4o",
  });

  const summarizedContent = await model.invoke(messages);
  console.log(summarizedContent.content);
  return { postContent: summarizedContent.content };
};

interface GraphState {
  url: "";
  postContent: MessageContent;
}

const graphState = {
  url: null,
  postContent: null,
};

const graph = new StateGraph<GraphState>({ channels: graphState })
  .addNode("few_shot_encoding", fewShotEncoding)
  .addEdge(START, "few_shot_encoding")
  .addEdge("few_shot_encoding", END);

const app = graph.compile({
  checkpointer: new MemorySaver(),
});

async function startChat(url: string) {
  const graphResponse: GraphState = await app.invoke(
    {
      url,
    },
    { configurable: { thread_id: "1" } }
  );

  //console.log(app.getGraph().drawMermaid());

  return graphResponse;
}

export { startChat, app };
