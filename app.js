const { createCanvas, registerFont } = require('canvas');

// Path to your custom font file
const fontPath = './pricedow.ttf';
 
// Register the custom font
registerFont(fontPath, { family: 'CustomFont' });

// Text to be displayed on the image
const text = '$2,125.98';

// Set canvas dimensions
const width = 800; // Width of the canvas
const height = 400; // Height of the canvas

// Create a canvas
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Function to measure text width for a given font size
function measureTextWidth(fontSize) {
    context.font = `${fontSize}px CustomFont`;
    return context.measureText(text).width;
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

// Set font properties with the maximum font size
context.font = `${maxFontSize}px CustomFont`;
context.fillStyle = 'green'; // Set font color to green

// Position the text in the center
const x = (width - measureTextWidth(maxFontSize)) / 2;
const y = height / 2;

// Draw the text on the canvas
context.fillText(text, x, y);

// Convert canvas to a data URL
const dataURL = canvas.toDataURL();

// Output the data URL (you can save it to a file or send it as a response)
console.log(dataURL);