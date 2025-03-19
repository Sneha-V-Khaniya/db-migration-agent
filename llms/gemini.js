const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function ask(prompt){
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return result.response.text();
}

module.exports = { ask };


