const { createCanvas, registerFont } = require('canvas');
const currency = require('currency.js');

function generateImageWithText(text, fontPath, width, height) {
    const USD = value => currency(value, { symbol: "$", precision: 2 });
    const amt = USD(text).format();
    console.log(amt);
    // Register the custom font
    registerFont(fontPath, { family: 'CustomFont' });
    
    // Create a canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

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

    // Set font properties with the maximum font size
    context.font = `${maxFontSize}px CustomFont`;
    context.fillStyle = '#6CC04A'; // Set font color to green

    // Set border properties
    const borderWidth = 1.8; // Border width in pixels
    context.strokeStyle = 'black'; // Set border color to black

    // Position the text in the center
    const x = (width - measureTextWidth(maxFontSize)) / 2;
    const y = height / 2;

    // Draw the text with border
    for (let xOffset = -borderWidth; xOffset <= borderWidth; xOffset++) {
        for (let yOffset = -borderWidth; yOffset <= borderWidth; yOffset++) {
            if (xOffset !== 0 || yOffset !== 0) {
                context.strokeStyle = 'black'; // Set border color to black
                context.strokeText(amt, x + xOffset, y + yOffset);
            }
        }
    }

    // Draw the main text on the canvas
    context.fillText(amt, x, y);

    // Convert canvas to a data URL
    const dataURL = canvas.toDataURL();

    return dataURL;
}

// Example usage:
const fontPath = './pricedow.ttf';
// const width = 800;
// const height = 400;
const text = 112225.98;

const imageDataURL = generateImageWithText(text, fontPath, width = 800, height = 400);
console.log(imageDataURL);
