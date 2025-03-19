const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

async function ask({prompt, image, mimeType}){
    console.log("pr::", {prompt, image, mimeType});
    const result = await model.generateContent(image ? [prompt, {inlineData: {data: image, mimeType} }] : prompt);
    console.log(result.response.text());

    return result.response.text();
}

module.exports = { ask };


