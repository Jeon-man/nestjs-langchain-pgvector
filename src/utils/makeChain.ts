import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { Document } from '@langchain/core/documents';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';

export interface Prompt {
  CONDENSE_TEMPLATE: string;
  QA_TEMPLATE: string;
}

// To use the answer in another language, change the bottom sentence.
const CONDENSE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question.
Since the user who sees the answer is Korean, the answer MUST always be Korean.`;

// To use the answer in another language, change the bottom sentence.
const QA_TEMPLATE = `You are an expert researcher. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context or chat history, politely respond that you are tuned to only answer questions that are related to the context.
Since the user who sees the answer is Korean, the answer MUST always be Korean.
Extract insights, identify risks, and distill key information from long corporate reports into a single memo.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
Helpful answer in markdown:`;

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map(doc => doc.pageContent);
  return serializedDocs.join('\n\n');
};

export const makeChain = (
  retriever: VectorStoreRetriever,
  apiKey: string,
  { CONDENSE_TEMPLATE: custom_condense_template, QA_TEMPLATE: qa_template }: Partial<Prompt>,
) => {
  const condenseQuestionPrompt = PromptTemplate.fromTemplate(
    custom_condense_template ?? CONDENSE_TEMPLATE,
  );
  const answerPrompt = PromptTemplate.fromTemplate(qa_template ?? QA_TEMPLATE);

  const model = new ChatOpenAI({
    apiKey,
    temperature: 0, // increase temperature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  // Rephrase the initial question into a dereferenced standalone question based on
  // the chat history to allow effective vectorstore querying.
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]);

  // Retrieve documents based on a query, then format them.
  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Generate an answer to the standalone question based on the chat history
  // and retrieved documents. Additionally, we return the source documents directly.
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([input => input.question, retrievalChain]),
      chat_history: input => input.chat_history,
      question: input => input.question,
    },
    answerPrompt,
    model,
    new StringOutputParser(),
  ]);

  // First generate a standalone question, then answer it based on
  // chat history and retrieved context documents.
  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: input => input.chat_history,
    },
    answerChain,
  ]);

  return conversationalRetrievalQAChain;
};
