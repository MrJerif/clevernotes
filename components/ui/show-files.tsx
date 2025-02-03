import React, { useState } from 'react';

// To find and show files
interface DocumentContentItemProps {
    id?: string;
    type: string;
    props?: {
        name?: string;
        url?: string;
    }
}

interface ShowFileProps {
    documentContentString: string;
    onFileSelect: (file: {name: string, url: string}) => void;
}

const ShowFiles = ({ documentContentString, onFileSelect }: ShowFileProps) => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleFileSelect = (fileName: string | undefined, fileUrl: string | undefined) => {
        if (!fileName || !fileUrl) return;
        if (selectedFiles.includes(fileName)) {
            setSelectedFiles(selectedFiles.filter((file) => file !== fileName));
            // console.log(selectedFiles);
            // return selectedFiles;
        } else {
            setSelectedFiles([...selectedFiles, fileName]);
            onFileSelect({name: fileName, url: fileUrl});
            // console.log(selectedFiles);
            // return selectedFiles;
        }
    };

    // Convert content of document into Array of objects 
    const contentArray: DocumentContentItemProps[] = JSON.parse(documentContentString);
    const files = contentArray.filter((item) => item.type === "file");

    return (
        <div className='absolute right-28 bottom-20 p-2 border border-white rounded-lg bg-white dark:bg-black'>
            {files.length > 0 ? (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            <input
                                type="checkbox"
                                checked={selectedFiles.includes(file.props?.name || "")}
                                onChange={() => handleFileSelect(file.props?.name, file.props?.url)}
                            />
                            {file.props && file.props.name && (
                                <span className='ml-2'>
                                    {file.props?.name}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    No file present in document
                </div>
            )}
        </div>
    )

}

export default ShowFiles