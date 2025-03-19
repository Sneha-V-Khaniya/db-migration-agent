const gemini = require('../llms/gemini');

module.exports = async function generalAgent(query) {

    const response = await gemini.ask({prompt: query});

    return response;
}
