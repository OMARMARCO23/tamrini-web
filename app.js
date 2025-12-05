// Translations
const translations = {
  en: {
    appName: "Tamrini",
    tagline: "Your Math Tutor",
    startChat: "Start Learning",
    typeMessage: "Type your math question...",
    welcome: "Hello! 👋 I'm Tamrini, your math tutor. What problem are you working on today?",
    thinking: "Thinking...",
    error: "Oops! Something went wrong. Please try again.",
    quotaError: "Too many requests! Please wait a moment and try again.",
    langName: "🇬🇧 English"
  },
  fr: {
    appName: "Tamrini",
    tagline: "Ton Tuteur de Maths",
    startChat: "Commencer",
    typeMessage: "Écris ta question de maths...",
    welcome: "Salut! 👋 Je suis Tamrini, ton tuteur de maths. Sur quel problème travailles-tu aujourd'hui?",
    thinking: "Je réfléchis...",
    error: "Oups! Une erreur s'est produite. Réessaie.",
    quotaError: "Trop de demandes! Attends un moment et réessaie.",
    langName: "🇫🇷 Français"
  },
  ar: {
    appName: "تمريني",
    tagline: "معلمك في الرياضيات",
    startChat: "ابدأ التعلم",
    typeMessage: "اكتب سؤالك في الرياضيات...",
    welcome: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات. ما هي المسألة التي تعمل عليها اليوم؟",
    thinking: "أفكر...",
    error: "عذراً! حدث خطأ. حاول مرة أخرى.",
    quotaError: "طلبات كثيرة! انتظر قليلاً ثم حاول مرة أخرى.",
    langName: "🇲🇦 العربية"
  }
};

// State
let currentLang = localStorage.getItem('tamrini_lang') || 'en';
let messages = [];
let isLoading = false;

// API URL - Your Vercel API
const API_URL = 'https://tamarini-app.vercel.app/api/chat';

// Elements
const homeScreen = document.getElementById('home-screen');
const chatScreen = document.getElementById('chat-screen');
const langBtn = document.getElementById('lang-btn');
const langDropdown = document.getElementById('lang-dropdown');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Initialize
function init() {
  updateLanguage(currentLang);
  setupEventListeners();
}

// Update Language
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tamrini_lang', lang);
  
  const t = translations[lang];
  
  // Update text content
  document.getElementById('app-title').textContent = t.appName;
  document.getElementById('app-tagline').textContent = t.tagline;
  document.getElementById('start-btn').textContent = t.startChat;
  document.getElementById('chat-title').textContent = t.appName;
  document.getElementById('message-input').placeholder = t.typeMessage;
  document.getElementById('loading-text').textContent = t.thinking;
  langBtn.textContent = t.langName;
  
  // RTL support
  if (lang === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
  
  // Close dropdown
  langDropdown.classList.add('hidden');
}

// Setup Event Listeners
function setupEventListeners() {
  // Language selector
  langBtn.addEventListener('click', () => {
    langDropdown.classList.toggle('hidden');
  });
  
  langDropdown.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      updateLanguage(btn.dataset.lang);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
      langDropdown.classList.add('hidden');
    }
  });
  
  // Start chat
  startBtn.addEventListener('click', () => {
    homeScreen.classList.remove('active');
    chatScreen.classList.add('active');
    
    // Add welcome message
    if (messages.length === 0) {
      addMessage('bot', translations[currentLang].welcome);
    }
  });
  
  // Back button
  backBtn.addEventListener('click', () => {
    chatScreen.classList.remove('active');
    homeScreen.classList.add('active');
  });
  
  // Input handling
  messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim() || isLoading;
    
    // Auto-resize
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
  });
  
  // Send message
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Add Message
function addMessage(role, content) {
  messages.push({ role, content });
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role === 'user' ? 'user' : 'bot'}`;
  
  if (role === 'bot') {
    messageDiv.innerHTML = `<span class="icon">📐</span>${content}`;
  } else {
    messageDiv.textContent = content;
  }
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send Message
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || isLoading) return;
  
  // Add user message
  addMessage('user', text);
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;
  
  // Show loading
  isLoading = true;
  loadingDiv.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  
  try {
    // Build history (last 10 messages)
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'bot' ? 'assistant' : m.role,
      content: m.content
    }));
    
    // Call API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: text,
        language: currentLang,
        history: history
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.details?.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      throw new Error(data.error || 'API request failed');
    }
    
    // Add bot response
    addMessage('bot', data.reply);
    
  } catch (error) {
    console.error('Error:', error);
    const t = translations[currentLang];
    
    if (error.message === 'QUOTA_EXCEEDED') {
      errorDiv.textContent = '⚠️ ' + t.quotaError;
    } else {
      errorDiv.textContent = '⚠️ ' + t.error;
    }
    errorDiv.classList.remove('hidden');
  }
  
  // Hide loading
  isLoading = false;
  loadingDiv.classList.add('hidden');
}

// Start app
init();
