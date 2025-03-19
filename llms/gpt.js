const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
async function ask({ image }){
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: `This is an ER diagram. Generate table and columns information for all entities in the image.
                        give json response. use snake_case name for tables.
                        Try to provide information about all tables.  
                        1. Start with simple base tables (those without foreign keys).  
                        2. Then, provide information about tables that have foreign keys.  
                    ` },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } },
                ],
            },
        ],
        max_tokens: 1000,
    }
    );
    console.log("gpt::", response.choices[0].message.content);

    return response.choices[0].message.content;
}

module.exports = { ask };


