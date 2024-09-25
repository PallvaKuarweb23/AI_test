const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const app = express()
app.use(cors())
app.use(express.json());

// Step 3: Predefined Questions and Answers
const qaPairs = [
    { question: "What is FlexPay?", answer: "FlexPay is a trusted partner for hundreds of the leading subscription, ecommerce and SaaS brands, reducing the pain caused by failed payments, increasing revenue and customer LTV, and decreasing customer churn." },
    { question: "What is machine learning?", answer: "Machine learning is a subset of AI that allows machines to learn from data and improve over time without being explicitly programmed." },
    { question: "What is deep learning?", answer: "Deep learning is a subset of machine learning that uses neural networks with many layers to analyze complex patterns in data." },
    { question: "What is OpenAI?", answer: "OpenAI is an AI research and deployment company that develops advanced artificial intelligence models like GPT-4." },
    { question: "What is GPT-4?", answer: "GPT-4 is a large language model developed by OpenAI, designed to generate human-like text based on input prompts." },
    { question: "What is natural language processing?", answer: "Natural language processing (NLP) is a field of AI that focuses on the interaction between computers and humans using natural language." },
    { question: "What is reinforcement learning?", answer: "Reinforcement learning is a type of machine learning where an agent learns to make decisions by receiving rewards or penalties." },
    { question: "What is supervised learning?", answer: "Supervised learning is a machine learning technique where models are trained on labeled data." },
    { question: "What is unsupervised learning?", answer: "Unsupervised learning is a type of machine learning that finds hidden patterns or structures in data without labeled outcomes." },
    { question: "What is a neural network?", answer: "A neural network is a computational model inspired by the human brain's network of neurons, used for tasks like classification, pattern recognition, and decision-making." },
  ];

  

  // Step 4: Function to search for predefined answers
  function findAnswer(prompt) {
    // Normalize the input by removing extra spaces, converting to lowercase, and removing punctuation
    const normalizedPrompt = prompt.toLowerCase().replace(/\s+/g, ' ').trim().replace(/[?.,!]/g, '');
  
    const match = qaPairs.find(qa => 
      qa.question.toLowerCase().replace(/\s+/g, ' ').trim().replace(/[?.,!]/g, '') === normalizedPrompt
    );
    
    return match ? match.answer : null;
  }
/////////////////////////////////
      




  
///////////////////////////////
async function run(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const result = await model.generateContent(prompt);

return result.response.text()

// console.log(result.response.text());


}


async function handlePrompt(prompt) {
    const predefinedAnswer = findAnswer(prompt);
    
    if (predefinedAnswer) {
      // If there's a match in the predefined questions, return the answer
      return predefinedAnswer;
    } else {
      // If no match, call OpenAI API to generate an answer
      return await run(prompt);
    }
  }


  app.get("/question",(req,res)=>{
    res.json(qaPairs)
  })
 /

  // API route to handle frontend requests
app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const ans = await handlePrompt(prompt);
    res.json({ ans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing the request." });
  }
});

// Start the server
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

  
// Step 7: Example usage
const userPrompt = "What is a neural"; // Example user input

handlePrompt(userPrompt)
  .then(answer => console.log(answer))
  .catch(err => console.error(err));
 

