import React, { useRef, useState } from 'react';

const FileRead = () => {
    const fileRef = useRef();
    const [fileContent, setFileContent] = useState([]); // Initialize as an array
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setCurrentUser] = useState('');

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = fileRef.current.files[0];

        if (!file) {
            setErrorMessage('No file selected, please select a file to read');
            return;
        }

        if (file.type !== 'text/plain') {
            setErrorMessage('Invalid file type, please select a .txt file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const lines = content.split('\n');
                const parsedMessages = lines.map(line => parseWhatsAppMessage(line)).filter(message => message != null);
                // console.log("Parsed messages:", parsedMessages);
                if (parsedMessages.length > 0) {
                    setFileContent(parsedMessages);
                    const users = [...new Set(parsedMessages.map(msg => msg.sender))];
                    setCurrentUser(prev => users);
                    console.log("user-", user)
                }
            } catch (e) {
                setErrorMessage('Error reading file');
            }
        };

        reader.onerror = (e) => {
            setErrorMessage('Error reading file');
        };

        reader.readAsText(file);
    };

    const parseWhatsAppMessage = (line) => {
        if (!line.trim()) return null;
        const regex = /^(\d{2}\/\d{2}\/\d{2},\s+\d{1,2}:\d{2}\s+[ap]m)\s+-\s+([^:]+):\s*(.+)$/;
        const match = line.match(regex);

        if (match) {
            const [, datetime, sender, content] = match;
            return {
                timestamp: parseDateTime(datetime), // Use 'timestamp' for consistency
                sender: sender.trim(),
                content: content.trim(),
                isMedia: content.includes('<Media omitted>'),
                isEdited: content.includes('<This message was edited>')
            };
        } else {
            const systemMessageRegex = /^(\d{2}\/\d{2}\/\d{2},\s+\d{1,2}:\d{2}\s+[ap]m)\s+-\s+([^:]+)$/;
            const systemMatch = line.match(systemMessageRegex);

            if (systemMatch) {
                const [, datetime, content] = systemMatch;
                return {
                    timestamp: parseDateTime(datetime),
                    sender: 'System',
                    content: content.trim(),
                    isSystem: true
                };
            }
        }
        return null;
    };

    const parseDateTime = (dateTimeStr) => {
        return dateTimeStr.trim();
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
    
    return (
        <>
            <div className='flex justify-center items-center flex-col gap-5 h-full w-full border'>
                <h1 className='font-bold text-2xl '>Upload an exported WhatsApp chat (.txt) file to read</h1>
                <input type='file' accept='.txt' className='border p-5 flex justify-center items-center' ref={fileRef} />
                <button onClick={handleFileChange} className='bg-blue-500 text-white p-2 rounded-md'>Read File</button>
                <div className='flex w-[900px] flex-wrap justify-center items-center'>
                    <FileDisplay fileContent={fileContent} user={user} />
                </div>
                {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
            </div>
        </>
    );
};

const FileDisplay = ({ fileContent, user }) => {
    return (
        <>
            {fileContent.length > 0 ? (
                <div className='chat-window'>
                    <h2 className='text-lg font-bold mb-4 chat-heading'>File Content:</h2>
                    <div className='chat-panel'>
                        {fileContent.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-col rounded-xl p-6 mb-4 shadow-md min-w-fit-content max-w-full 
                                ${message.sender === user[1] ? 'bg-green-600 text-green-50 self-start' : 'bg-gray-200 text-gray-800 self-end'}`}
                            >
                                <div className='timestamp text-sm'>{message.timestamp.toString()}</div>
                                <div className={`sender font-semibold`}>{message.sender}</div>
                                <div className='content mt-1'>{message.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-gray-500'>No messages to display</div>
            )}
        </>
    );
}


export default FileRead;