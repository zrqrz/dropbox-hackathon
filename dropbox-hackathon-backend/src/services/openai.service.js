const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;

// Hardcoded here!
const petitionDetail = {
  title: 'Support Remote Work and Flexibility',
  organization: 'Amazon',
  background: 'The ongoing COVID-19 pandemic',
  content: 'Remote work can be productive and efficient',
};

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
  },
});

const params = {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'user',
      content: 'Generate a petition without header for me',
    },
    {
      role: 'assistant',
      content: 'What is the title?',
    },
    {
      role: 'user',
      content: `${petitionDetail.title}`,
    },
    {
      role: 'assistant',
      content: 'What is the organization?',
    },
    {
      role: 'user',
      content: `${petitionDetail.organization}`,
    },
    {
      role: 'assistant',
      content: 'What is the background?',
    },
    {
      role: 'user',
      content: `${petitionDetail.background}`,
    },
    {
      role: 'assistant',
      content: 'What is the content?',
    },
    {
      role: 'user',
      content: `${petitionDetail.content}`,
    },
  ],
  // These parameters need more test to get more precise result
  temperature: 1,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const generatePetition = async () => {
  try {
    const result = await client.post('https://api.openai.com/v1/chat/completions', params);
    return result.data.choices[0].message.content;
  } catch (err) {
    console.log('Exception when calling openai API:');
    console.log(err);
  }
};

module.exports = { generatePetition };
