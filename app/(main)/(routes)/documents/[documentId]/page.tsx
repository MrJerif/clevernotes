"use client";
import { Cover } from '@/components/cover';
import dynamic from 'next/dynamic';
import { Toolbar } from '@/components/toolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import React, { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}


const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const isMobile = useMediaQuery(" (max-width: 786px) ");
  const documentId = params.documentId as Id<"documents">;

  const document = useQuery(api.documents.getById, {
    documentId: documentId
  });

  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), 
    { ssr: false }),
    []
  );

  // Update
  const update = useMutation(api.documents.update);

  // Function to update note's content 
  const onChange = (content: string) => {
    update({
      id: documentId,
      content
    });
  };

  // Loading
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-14 w-[40%]' />
            <Skeleton className='h-14 w-[60%]' />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not Found.</div>
  }

  return (
      <div className={cn('pb-40',
        isMobile && 'pb-96'
      )}>
        <Cover url={document.coverImage} />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
          <Toolbar initialData={document} />
          <div className='h-1 w-full bg-muted'/>
          <Editor
            onChange={onChange}
            initialContent={document.content}
          />
        </div>
      </div>
  )
}

export default DocumentIdPage