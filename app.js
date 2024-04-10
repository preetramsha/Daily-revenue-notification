const { createCanvas, registerFont } = require('canvas');
const currency = require('currency.js');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { Readable } = require('stream');

function createReadableStreamFromBase64URI(base64URI) {
    // Extract the base64 data
    const base64Data = base64URI.split(';base64,').pop();

    // Convert base64 data to a buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signal the end of the stream

    return readableStream;
}

async function sendImageWithCaption(chatId, stream, caption, botToken) {
    try {
        // Prepare the form data
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', stream, { filename: 'img.png' }); // Pass the readable stream directly
        formData.append('caption', caption);

        // Send the image with caption to the Telegram bot API
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        const responseData = await response.json();
        if (responseData.ok) {
            console.log('Image sent successfully');
        } else {
            console.error('Error sending image:', responseData.description);
        }
    } catch (error) {
        console.error('Error sending image:', error);
    }
}
 
function generateImageWithText(amt, fontPath, width, height, capt) {
    console.log(amt);
    // Register the custom font
    registerFont(fontPath, { family: 'CustomFont' });
    
    // Create a canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Measure text metrics to calculate vertical centering
    function measureTextMetrics(fontSize) {
        context.font = `${fontSize}px CustomFont`;
        const metrics = context.measureText(amt);
        const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8; // Fallback for browsers not supporting actualBoundingBoxAscent
        const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2; // Fallback for browsers not supporting actualBoundingBoxDescent
        return { ascent, descent };
    }

    // Function to find the vertical position that centers the text within the canvas
    function findVerticalCenterPosition(fontSize) {
        const { ascent, descent } = measureTextMetrics(fontSize);
        return (height - (ascent + descent)) / 2 + ascent; // Adjusted position to center text
    }

    // Function to measure text width for a given font size
    function measureTextWidth(fontSize) {
        context.font = `${fontSize}px CustomFont`;
        return context.measureText(amt).width;
    }

    // Function to find the maximum font size that fits the text within the canvas
    function findMaxFontSize() {
        let fontSize = 1;
        let textWidth = measureTextWidth(fontSize);

        while (textWidth < width && fontSize < height) {
            fontSize++;
            textWidth = measureTextWidth(fontSize);
        }

        return fontSize - 1; // Return the previous font size that fit within the canvas
    }

    // Calculate the maximum font size
    const maxFontSize = findMaxFontSize();

    // Calculate the vertical center position
    const centerY = findVerticalCenterPosition(maxFontSize);

    // Set font properties with the maximum font size
    context.font = `${maxFontSize}px CustomFont`;
    context.fillStyle = '#6CC04A'; // Set font color to green

    // Set border properties
    const borderWidth = 1.8; // Border width in pixels
    context.strokeStyle = 'black'; // Set border color to black

    // Position the text horizontally in the center
    const x = (width - measureTextWidth(maxFontSize)) / 2;

    // Draw the text with border
    for (let xOffset = -borderWidth; xOffset <= borderWidth; xOffset++) {
        for (let yOffset = -borderWidth; yOffset <= borderWidth; yOffset++) {
            if (xOffset !== 0 || yOffset !== 0) {
                context.strokeStyle = 'black'; // Set border color to black
                context.strokeText(amt, x + xOffset, centerY + yOffset);
            }
        }
    }

    // Draw the main text on the canvas
    context.fillText(amt, x, centerY);

    // Convert canvas to a data URL
    const dataURL = canvas.toDataURL();
    const stream = createReadableStreamFromBase64URI(dataURL);
    sendImageWithCaption(chatId,stream,capt,botToken);
}


//fetch this from database;
const text = 5.98;
const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const USD = value => currency(value, { symbol: "$", precision: 2 });
const amt = USD(text).format();

generateImageWithText(amt, fontPath = './pricedow.ttf', width = 800, height = 250,`Today's Revenue: ${amt}`);