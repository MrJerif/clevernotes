"use client";

import { cn } from '@/lib/utils';
import { ChevronsDown, ChevronsRight, FileDiffIcon, Globe2Icon, SparkleIcon } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import React, { ElementRef, FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import ShowFiles from './ui/show-files';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { SignInButton, useUser } from '@clerk/clerk-react';
import UsageTrack from '@/app/(main)/_components/usage-track';

interface AiFeatureProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiFeature = ({ isOpen, onClose }: AiFeatureProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();
  const chatRef = useRef<ElementRef<"div">>(null);
  const resizeRef = useRef<ElementRef<"div">>(null);

  // Chat feature
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);

  // handle selected files
  const [showFiles, setShowFiles] = useState(false);
  const [selectedFile, setSelectedFiles] = useState<{ name: string, url: string }[]>([]);

  // search online
  const [searchOnline, setSearchOnline] = useState(false);

  const params = useParams();

  // tokens 
  const [userTokens, setUserTokens] = useState<number>();
  const getTokens = useQuery(api.documents.getTokens);
  const createTokens = useMutation(api.documents.createToken);
  const tokensUsed = useMutation(api.documents.tokensUsed);

  useEffect(() => {
    if (chatRef.current) {
      if (isOpen) {
        chatRef.current.style.transform = isMobile
          ? 'translateY(0)'
          : 'translateX(0)';
      } else {
        chatRef.current.style.transform = isMobile
          ? 'translateY(100%)'
          : 'translateX(100%)';
      }
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!user?.id) return;
    createTokens({
      userId: user.id
    });

  }, [user?.id]);

  useEffect(() => {
    if (getTokens) {
      setUserTokens(getTokens[0].tokenCount);
    }
  }, [getTokens]);

  // Fetch document
  const doc = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">
  });
  const documentContent = doc?.content;

  if (!user) {
    return <div
      className={cn('ml-[92vw] text-muted-foreground',
        isMobile && 'ml-[75vw]'
      )}>
      <div>
        login to use ai
      </div>
      <SignInButton mode='modal'>
        <Button variant="secondary" size="sm">
          Log in
        </Button>
      </SignInButton>
    </div>
  }

  // Function for Search Online
  const handleSearchOnline = () => {
    setSearchOnline(!searchOnline);
  }

  // Function to find and show all files 
  const handleFileShow = () => {
    setShowFiles(!showFiles);
  };

  // Function for sending selected files to AI
  const handleFileSelect = (file: { name: string, url: string }) => {
    setSelectedFiles((prevfile) => [...prevfile, file]);
    setInput((prevInput) => `${prevInput} ${file.name}`);
    setShowFiles(false);
  };

  // Function to submit the prompt to AI
  const askQuestion = async (e: FormEvent) => {
    e.preventDefault();

    const inputText = input.trim();
    const fileUrl = selectedFile.map((file) => file.url);
    const fileNames = selectedFile.map((file) => file.name);

    if (!userTokens || userTokens < 0) {
      return (
        <UsageTrack />
      );
    }

    // setQuestion(input);
    startTransition(async () => {
      // const documentData = documentContent;
      const newMessage = { user: inputText, ai: "" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentContent,
          userQuestion: inputText,
          fileUrl: fileUrl,
          searchOnline: searchOnline,
          fileName: fileNames
        }),
      });
      if (response.ok) {
        const message = await response.text();
        const parsedResponse = JSON.parse(message);
        const { wordCount, responseText } = parsedResponse;
        const aiMessage = responseText || "No answers generated";

        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? { ...msg, ai: aiMessage }
              : msg
          )
        );

        tokensUsed({
          tokenCount: wordCount
        });
        setInput("");
        setSelectedFiles([]);
      } else {
        throw new Error("Failed to fetch AI response.");
      }
    });
  };

  return (
    <>
      {!isMobile && (
        <div
          ref={resizeRef}
          className={cn(
            "absolute left-0 top-0 w-1 h-full cursor-ew-resize transition-opacity z-[999]",
            !isOpen && "opacity-0"
          )}
        />
      )}
      <div
        ref={chatRef}
        className={cn(
          "fixed bg-background z-[999]",
          isMobile
            ? "bottom-0 left-0 right-0 h-[50vh] transition-transform duration-300"
            : "top-0 right-0 h-full w-[40vw] transition-all duration-300 border-l",
          !isOpen && "transform",
          // isResetting && "transition-all ease-in-out duration-300"
        )}
      >
        <div className="h-full flex flex-col z-[999]">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-semibold flex px-1">
              CleverAI
              <p>
                <SparkleIcon className='w-5 flex-shrink-0' />
              </p>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition"
            >
              {isMobile ? <ChevronsDown /> : <ChevronsRight />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col space-y-4">
              {messages.length === 0 && (
                <div className="bg-secondary/75 p-2 rounded-sm">
                  {/* Ask a question and chat to the document or Search Online with AI. */}
                  Chat and ask questions about the document
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-secondary/75 p-3 rounded-sm">
                    {`You: ${message.user}`}
                  </div>
                  {message.ai && (
                    <div
                      className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <div className='flex'>
                        <SparkleIcon className='w-10 flex-shrink-0' />
                        <p className='font-semibold'>
                          CleverAI
                        </p>
                      </div>
                      <p>
                        {message.ai}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Show ai response */}
              {isPending && (
                <div
                  className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className='flex'>
                    <SparkleIcon className='w-10 flex-shrink-0' />
                    <p className='font-semibold'>
                      CleverAI {isPending ? "is thinking..." : ""}
                    </p>
                  </div>
                  <p>
                    {isPending ? "Thinking..." : ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Show files and upload selected files to Ai */}
          {showFiles && (
            <ShowFiles
              documentContentString={documentContent as string}
              onFileSelect={handleFileSelect}
            />
          )}

          <div className='m-1 text-muted-foreground bg-transparent'>
            {userTokens && userTokens > 0 ? (
              <p>
                {userTokens} tokens remaining
              </p>
            ) : (
              <p>
                No tokens left!
              </p>
            )}
          </div>

          {/* Search Online */}
          <div className='right-6 bottom-20 absolute'>
            <Popover>
              <PopoverTrigger>
                <Button size="sm" className={cn(searchOnline && 'bg-blue-500')}>
                  <Globe2Icon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='' align='center' forceMount>
                <p className='text-xs'>Click the icon to enable AI to Search Internet</p>
                <Globe2Icon
                  onClick={handleSearchOnline}
                  className={cn(
                    'h-7 w-7 m-2 flex items-center cursor-pointer rounded-xl',
                    searchOnline && 'bg-blue-400 p-1 animate-pulse'
                  )} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="p-4 border-t">
            <form
              className="flex space-x-2"
              onSubmit={askQuestion}
            >
              <input
                type="text"
                placeholder="i.e What is this document about?"
                className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                // multiple
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {/* <input type="text" 
                className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                value={fileNames}
              /> */}
              <FileDiffIcon
                className='w-8 h-10'
                role='button'
                onClick={handleFileShow}
              />
              {/* <FileLineChartIcon /> */}
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition cursor-pointer"
                type='submit'
                disabled={!input || isPending}
              >
                {isPending ? "Asking..." : "Ask"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
