import React, { useState, useEffect } from 'react';

const FileFromURL = ({ fileUrl }) => {
    const [fileContent, setFileContent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const parsedMessages = parseWhatsAppChat(text);
                setMessages(parsedMessages);
                setFileContent(text);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fileUrl]); // Important: Add fileUrl to the dependency array

    const parseWhatsAppChat = (text) => {
        const messageRegex = /\[(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})\] (.+?): (.+)/g;
        const messages = [];
        let match;

        while ((match = messageRegex.exec(text)) !== null) {
            messages.push({
                date: match[1],
                sender: match[2],
                message: match[3],
            });
        }
        return messages;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='flex border justify-center items-center flex-col flex-wrap w-full'>
            <h2>File Content:</h2>
            {/* <div className='whitespace-pre-wrap '>{fileContent}</div> */}
            <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-3 rounded-lg ${msg.sender === 'You' ? 'bg-green-200 self-end' : 'bg-white self-start'}`}
                    >
                        <div className="text-xs text-gray-500">{msg.date}</div>
                        <div className="font-semibold">{msg.sender}</div>
                        <div>{msg.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FileUpload = () => {
    // const fileUrl = 'D:/Downloads/WhatsApp Chat with Shramana/WhatsApp Chat with Shramana'; // Example URL (HTTP RFC)
    const fileUrl = '/WhatsApp Chat with Shramana.txt' // for local files in the public folder

    return (
        <div>
            <FileFromURL fileUrl={fileUrl} />
        </div>
    );
};

export default FileUpload;