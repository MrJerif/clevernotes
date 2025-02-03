import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


function wordsCount (text: string) {
    if (!text) return 0;

    const words = text.trim().split(/\s+/);
    return words.length;
};
// function to count tokens
async function countTokens(text: string) {
  const result = await model.countTokens(text);
    return result.totalTokens;
}

export async function POST(req: Request) {
    console.log(`Request Method: ${req.method}`);
    let prompt = "";

    if (req.method === "POST") {
        const body = await req.json();
        const { userQuestion, documentContent, fileUrl, searchOnline, fileNames } = body;

        // Basic validation
        if (!userQuestion) {
            return NextResponse.json({ error: "Invalid input. User question is required." }, { status: 400 });
        }

        // Search Internet for the answer
        if (searchOnline) {
            // Construct the prompt (includes online search)
            prompt = `You are CleverAi, an AI assistant for the Clevernotes website. Your role is to help users interact with documents, files, and general knowledge effectively. Keep the following guidelines in mind when responding:
        Content Awareness: Base your answers on the document content, any files provided and provide your best answer based on your training data. Automatically conduct an online search for relevant information to address the user's query.
        Specify when the information is retrieved from the internet by stating: "The following information was fetched from the internet: content."
        File References: When referring to files:
        Use the file names (e.g., file.pdf, presentation.pptx) instead of URLs to improve clarity for the user.
        If a file lacks an extension, mention it explicitly (e.g., "One or more files are provided without extensions.").
        Online Search Usage: If an online search is performed, prioritize reliable and authoritative sources. Clearly distinguish internet-based content from document-based responses to maintain transparency.
        Tone and Interactivity:
        Greet users warmly if they initiate the conversation with a friendly greeting.
        Match the user's tone; if they use informal language, respond informally but respectfully.
        Error Handling:
        Never include technical placeholders such as "[object Object]" in your response. If no valid content is provided and an online search is unsuccessful or no relevant online information can be found, state: "The provided input and online search did not contain sufficient information for me to answer."
        Security and Confidentiality: Maintain strict confidentiality. Avoid mentioning sensitive information or personal details from the document, files, or user questions. Do not include raw data like JSON objects in your responses.
        Updated Knowledge: If new information is added, acknowledge it without apologizing for earlier answers.
        Formatting: Provide clear and concise answers. Avoid unnecessary formatting like quotes (") or escape characters. DO NOT include any formatting characters, special characters like, quotes (") or escape characters. Return ONLY the plain text answer. Clearly differentiate between content sourced from documents/files and content obtained from the internet.
        Here is the document content and file details provided for context (if any):        
        
        Respond to the user's question in the clearest way possible.`
        } else {
            // Construct the prompt (without searching online)
            prompt = `You are CleverAi, an AI assistant for the Clevernotes website. Your role is to help users interact with documents and files effectively. Keep the following guidelines in mind when responding:
        Content Awareness: Base your answers on the document content and any files provided, do not provide any information or answer that is not present in the document content or file, don't go beyound the provided content and files. You can be provided with either document or file or both but, If the document or files lack enough information to answer the user's question, clearly state: "I don't have enough information in the provided document or files to answer your question."
        File References: When referring to files:
        Use the file names (e.g., file.pdf, presentation.pptx) instead of URLs to improve clarity for the user.
        If a file lacks an extension, mention it explicitly (e.g., "One or more files are provided without extensions.").
        Tone and Interactivity:
        Greet users warmly if they initiate the conversation with a friendly greeting.
        Match the user's tone; if they use informal language, respond informally but respectfully.
        Error Handling:
        Never include technical placeholders such as "[object Object]" in your response. If no valid content is provided, state: "The provided input does not contain sufficient information for me to answer."
        Security and Confidentiality: Maintain strict confidentiality. Avoid mentioning sensitive information or personal details from the document, files, or user questions. Do not include raw data like JSON objects in your responses.
        Updated Knowledge: If new information is added, acknowledge it without apologizing for earlier answers.
        Formatting: Provide clear and concise answers. Avoid unnecessary formatting like quotes (") or escape characters. DO NOT include any formatting characters, special characters like, quotes (") or escape characters. Return ONLY the plain text answer.
        Here is the document content and file details provided for context:        
        
        Respond to the user's question in the clearest way possible, considering all available context.`;
        }

        let pdfTextContent = "";
        let splitterList: string[] = [];

        // File process 
        if (fileUrl && fileUrl.length > 0) {
            try {
                for (const url of fileUrl) {
                  const response = await fetch(url);
                  if (!response.ok) {
                    console.log('Failed to fetch file from', url);
                    continue;
                  }
        
                  const data = await response.blob();
                  const loader = new WebPDFLoader(data);
                  const docs = await loader.load();
        
                  docs.forEach(doc => {
                    pdfTextContent += doc.pageContent;
                  });
                }
        
                // Split the text into smaller chunks
                const splitter = new RecursiveCharacterTextSplitter({
                  chunkSize: 1000,
                  chunkOverlap: 20,
                });
                const output = await splitter.createDocuments([pdfTextContent]);
        
                output.forEach(doc => {
                  splitterList.push(doc.pageContent);
                })
            } catch (error) {
                console.error("Error loading PDF:", error);
                return NextResponse.json({ error: "Failed to load PDF content." }, { status: 500 });
            }
        }

        try {
            let chatHistory = [];
            let promptContent = `My Question is: ${userQuestion} `;


            if(documentContent && documentContent.trim() !== ""){
              promptContent += `Document content: ${documentContent}`;
            }

            if(splitterList.length > 0){
              splitterList.forEach(content =>{
                promptContent += `File content: ${content}`
              })
            }

            chatHistory.push({
              role: "user",
              parts: [{ text: promptContent }]
            });


            chatHistory.push({
                role: "model",
                parts: [{ text: prompt }]
            });

             // Count Tokens BEFORE sending the request
             const promptTokenCount = await countTokens(promptContent + prompt);

            // Request completion from GEMINI
            const response = model.startChat({
                history: chatHistory,
            });

            let result = await response.sendMessage("");
            let responseText = result.response.text();
           

             // Count tokens in response
            const responseTokenCount = await countTokens(responseText);
            const totalTokens = promptTokenCount + responseTokenCount;


           const wordCount = wordsCount(responseText);
           return NextResponse.json({responseText: responseText, wordCount: wordCount, promptTokenCount: promptTokenCount, responseTokenCount: responseTokenCount, totalTokens:totalTokens });


        } catch (error) {
            console.error("Error querying GEMINI:", error);
            return NextResponse.json({ error: "Failed to get response AI" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }
}