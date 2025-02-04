// /folderpreview/folderId
"use client";

import { Cover } from '@/components/cover';
import { Spinner } from '@/components/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChevronDown, FileIcon, FolderCheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PublicfolderProps {
  // documentId?: Id<"documents">
  params: {
    folderId: Id<"folders">;
  };
}

const PublicFolder = ({ params }: PublicfolderProps) => {
  const router = useRouter();

  // get request (Published Folders)
  const folders = useQuery(api.documents.getPublishedFolder, {
    folderId: params.folderId,
  });

  // get request (Published notes by folderId)
  const publishedDocs = useQuery(api.documents.getPublishedDocsByFolder, {
    folderId: params.folderId,
  });

  // Loading
  if (folders === undefined) {
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

  if (publishedDocs === undefined) {
    return (
      <div className="w-[100%] h-[100%] mt-12 ml-12">
        <Skeleton className="h-5 w-5" />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (folders === null) {
    return <div> Not Found </div>
  }

  if (publishedDocs === null || publishedDocs.length === 0) {
    return <div>Not Found</div>;
  }

  // Redirect to Note
  const onRedirect = (documentId: string) => {
    if (publishedDocs === null) {
      return (
        <Spinner />
      )
    }
    router.push(`/preview/${documentId}`);
  }

  return (
    <>
      <div>
        CleverNotes
      </div>
      <div>
        <div className='w-[60%] mt-12 ml-12'>
          <div className='flex gap-6 items-center text-3xl'>
            <ChevronDown className='h-5 w-5 text-muted-foreground' />
            {folders?.title}
            <FolderCheckIcon />
          </div>
          <div className='flex gap-1'>
            <p className='text-muted-foreground italic'> description: </p>
            <p>
              {folders?.description}
            </p>
          </div>
          <div>
            {publishedDocs ? publishedDocs?.map((doc) => (
              <div key={doc._id}>
                <div
                  className='group min-h-[37px] text-md py-1 pr-3 md:w-[50%] w-[100%] hover:bg-primary/5
    flex items-center gap-2 cursor-pointer border mb-1'
                  onClick={() => onRedirect(doc._id)}
                >
                  <div>
                    <FileIcon className='h-4 w-4' />
                  </div>
                  <div>
                    {doc.title}
                  </div>
                </div>
              </div>
            )) : (
              <div className='ml-5 mt-4'>
                folder has no documents! ☹️
              </div>
            )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default PublicFolder