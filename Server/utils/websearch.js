const { default: axios } = require("axios");


async function webSearch(summary, accessToken){
    try {
        const prompt = "Given the following summary of a health insurance policy, suggest three similar health insurance plans available for Indian citizens. The alternatives should offer comparable or better benefits and aim for lower or more affordable premiums. Describe each plan in 3-4 well-written sentences, including the provider name, product name, sum insured, important inclusions, co-pay or deductible info if applicable, and any standout features. Do not use bullet points, tables, or headings. Write in a clean and informative paragraph format that can be directly displayed on a user interface."

        const query = `${summary}`

        const response = await axios.post(
            'https://platform-backend.getalchemystai.com/api/v1/leads/augment/web',
            {
                userPrompt: prompt,
                dataForSearchQuery: query,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );


        if(!response){
            throw new Error("No response from web search API");
        }
        console.log(response.data);
        return response.data.lc_kwargs.content
        
    } catch (error) {
        console.error("Error in webSearch:", error);
        throw new Error("Failed to perform web search");
    }
}

module.exports = {webSearch};