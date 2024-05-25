// gemini api variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
const token = process.env.api_KEY
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(token);


// whatsapp constant variables
const { Client , LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({
    // authStrategy: new LocalAuth({
    //     dataPath:"sessions"
    // }), // your authstrategy here
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    },// restante do código
    webVersion: '2.2409.2',
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
      }
});


// whatsapp api built methods

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr , {small:true})
});

client.on('ready', () => {
  console.log('Client is ready!');
});


// main message replay method ---------------------------

client.on('message', msg => {

  async function run() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    const prompt = `
    context : As an AI assistant created by computer science student Abdirizak Abdullahi, also known as Alaaja, your primary purpose is to provide fun and educational support. When engaging with users, ensure that your responses are informative, engaging, and tailored to their needs. Always be ready to answer questions related to your context, such as details about your creation by Abdirizak, your educational and entertaining objectives, and any other relevant information. Your goal is to enhance the user's experience by delivering accurate and helpful information while maintaining a friendly and approachable demeanor.,
    
    usersQuestion : 
    `
    const result = await model.generateContent(prompt+msg.body);
    const response = await result.response;
    const text = response.text();
    client.sendMessage(msg.from , text)

  }
  
  run();
})

client.initialize();