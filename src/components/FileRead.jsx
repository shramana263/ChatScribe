import React, { useRef, useState } from 'react';

const FileRead = () => {
    const fileRef = useRef();
    const [fileContent, setFileContent] = useState([]); // Initialize as an array
    const [errorMessage, setErrorMessage] = useState(null);

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
                const messages = parseChatContent(e.target.result);
                console.log("messages", messages);
                setFileContent(prev => messages); // Set directly to messages
            } catch (e) {
                setErrorMessage('Error reading file');
            }
        };

        reader.onerror = (e) => {
            setErrorMessage('Error reading file');
        };

        reader.readAsText(file);
    };

    const parseChatContent = (content) => {
        // const content = `26/12/24, 4:34 pm - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more. 
        // 12/31/2021, 10:00 am - John Doe: Hello, how are you? 
        // 12/31/2021, 10:01 pm - Hello: I'm good, thanks!`;

        const messagePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2} (am|pm) - )(.+?): (.+)/g;
        let match;
        const messages = [];

        while ((match = messagePattern.exec(content)) != null) {
            console.log("hello")
            const timestamp = match[1];
            const sender = match[3];
            const message = match[4];
            messages.push({ timestamp, sender, message });
        }

        console.log(messages);
        return messages

    }



    // const parseChatContent = (content) => {
    //     const messagePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2} (AM|PM) - )(.+?): (.+)/g;
    //     const messages = [];
    //     let match;

    //     while ((match = messagePattern.exec(content)) !== null) {
    //         const timestamp = match[1];
    //         const sender = match[3];
    //         const message = match[4];
    //         messages.push({ timestamp, sender, message });
    //     }

    //     console.log("Parsed messages:", messages); // Log the parsed messages
    //     return messages;
    // };

    return (
        <>
            <div className='flex justify-center items-center flex-col gap-5'>
                <h1 className='font-bold'>File Read</h1>
                <input type='file' accept='.txt' className='border p-5 flex justify-center items-center' ref={fileRef} />
                <button onClick={handleFileChange} className='bg-blue-500 text-white p-2 rounded-md'>Read File</button>
                <FileDisplay fileContent={fileContent} />
                {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
            </div>
        </>
    );
};

const FileDisplay = ({ fileContent }) => {
    return (
        <>
            {fileContent.length > 0 ? (
                <div className='flex border justify-center items-center flex-col flex-wrap w-[100wh]'>
                    <h2>File Content:</h2>
                    <div>
                        {fileContent.map((msg, index) => (
                            <div key={index} className='message'>
                                <span className='timestamp'>{msg.timestamp}</span>
                                <span className={`sender ${msg.sender === 'You' ? 'you' : 'other'}`}>{msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No file content to display</div>
            )}
        </>
    );
}

export default FileRead;