// ===== TRANSLATIONS =====
const translations = {
  en: {
    appName: "Tamrini",
    welcome: "Welcome to Tamrini!",
    welcomeDesc: "I'll help you understand math step by step. No direct answers — just fun learning!",
    mascotSpeech: "Hi there! Ready to learn some math today? 🎉",
    startBtn: "START LEARNING",
    placeholder: "Type your question...",
    inputHint: "Press Enter to send 💬",
    greeting: "Hey there! 👋 I'm Tamrini, your math buddy!\n\nI won't just give you answers — that's no fun! Instead, I'll help you figure things out step by step.\n\nSo, what math problem are you working on? 🧮",
    online: "Online",
    progress: "Keep going! 💪",
    error: "Oops! Let's try that again 😅",
    quotaError: "Whoa! Too fast! Take a breath and try again 🧘",
  },
  fr: {
    appName: "Tamrini",
    welcome: "Bienvenue sur Tamrini!",
    welcomeDesc: "Je t'aide à comprendre les maths étape par étape. Pas de réponses directes — juste du fun!",
    mascotSpeech: "Salut! Prêt à apprendre des maths aujourd'hui? 🎉",
    startBtn: "COMMENCER",
    placeholder: "Écris ta question...",
    inputHint: "Appuie sur Entrée pour envoyer 💬",
    greeting: "Salut! 👋 Je suis Tamrini, ton ami des maths!\n\nJe ne vais pas te donner les réponses directement — c'est pas marrant! Je vais t'aider à comprendre étape par étape.\n\nAlors, sur quel problème tu travailles? 🧮",
    online: "En ligne",
    progress: "Continue! 💪",
    error: "Oups! Réessayons 😅",
    quotaError: "Doucement! Trop rapide! Respire et réessaie 🧘",
  },
  ar: {
    appName: "تمريني",
    welcome: "مرحباً بك في تمريني!",
    welcomeDesc: "سأساعدك على فهم الرياضيات خطوة بخطوة. لا إجابات مباشرة — فقط تعلم ممتع!",
    mascotSpeech: "مرحباً! هل أنت مستعد لتعلم الرياضيات اليوم؟ 🎉",
    startBtn: "ابدأ التعلم",
    placeholder: "اكتب سؤالك...",
    inputHint: "اضغط Enter للإرسال 💬",
    greeting: "مرحباً! 👋 أنا تمريني، صديقك في الرياضيات!\n\nلن أعطيك الإجابات مباشرة — هذا ليس ممتعاً! سأساعدك على الفهم خطوة بخطوة.\n\nإذن، ما المسألة التي تعمل عليها؟ 🧮",
    online: "متصل",
    progress: "استمر! 💪",
    error: "عذراً! لنحاول مرة أخرى 😅",
    quotaError: "مهلاً! بطّئ قليلاً! خذ نفساً وحاول مجدداً 🧘",
  }
};

// ===== STATE =====
let currentLang = localStorage.getItem('tamrini_lang') || 'en';
let messages = [];
let isLoading = false;
let messageCount = 0;

const API_URL = 'https://tamarini-app.vercel.app/api/chat';

// ===== ELEMENTS =====
const $ = id => document.getElementById(id);

// ===== INIT =====
function init() {
  // Hide splash
  setTimeout(() => {
    $('splash').classList.add('hidden');
    $('home-screen').classList.add('active');
  }, 2000);

  updateLanguage(currentLang);
  setupEventListeners();
}

// ===== LANGUAGE =====
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tamrini_lang', lang);
  
  const t = translations[lang];
  
  // Update text
  $('welcome-title').textContent = t.welcome;
  $('welcome-desc').textContent = t.welcomeDesc;
  $('mascot-speech').textContent = t.mascotSpeech;
  $('start-text').textContent = t.startBtn;
  $('chat-title').textContent = t.appName;
  $('status-text').textContent = t.online;
  $('message-input').placeholder = t.placeholder;
  $('input-hint').textContent = t.inputHint;
  $('progress-text').textContent = t.progress;
  
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // RTL
  document.body.classList.toggle('rtl', lang === 'ar');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
  });

  // Start button
  $('start-btn').addEventListener('click', () => {
    $('home-screen').classList.remove('active');
    $('chat-screen').classList.add('active');
    
    if (messages.length === 0) {
      addMessage('bot', translations[currentLang].greeting);
    }
    
    $('message-input').focus();
  });

  // Back button
  $('back-btn').addEventListener('click', () => {
    $('chat-screen').classList.remove('active');
    $('home-screen').classList.add('active');
  });

  // Input
  const input = $('message-input');
  const sendBtn = $('send-btn');
  
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim() || isLoading;
    autoResize(input);
  });

  // Send
  sendBtn.addEventListener('click', sendMessage);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Error close
  $('error-close').addEventListener('click', () => {
    $('error').classList.add('hidden');
  });
}

// ===== AUTO RESIZE =====
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ===== ADD MESSAGE =====
function addMessage(role, content) {
  messages.push({ role, content });
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const name = role === 'bot' ? 'Tamrini' : 'You';
  const avatar = role === 'bot' ? '📐' : '😊';
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role === 'user' ? 'user' : 'bot'}`;
  
  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-name">${name}</div>
      <div class="message-text">${formatMessage(content)}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  
  $('messages').appendChild(messageDiv);
  scrollToBottom();
  
  // Update progress
  if (role === 'user') {
    messageCount++;
    updateProgress();
  }
}

// ===== FORMAT MESSAGE =====
function formatMessage(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
  const progress = Math.min(messageCount * 10, 100);
  $('progress-fill').style.width = progress + '%';
  
  const messages = ['Keep going! 💪', 'Great job! 🌟', 'You\'re doing amazing! 🚀', 'Math champion! 🏆'];
  const index = Math.min(Math.floor(messageCount / 3), messages.length - 1);
  $('progress-text').textContent = messages[index];
}

// ===== SCROLL =====
function scrollToBottom() {
  const container = $('messages');
  container.scrollTop = container.scrollHeight;
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  const input = $('message-input');
  const text = input.value.trim();
  
  if (!text || isLoading) return;

  // Add user message
  addMessage('user', text);
  input.value = '';
  input.style.height = 'auto';
  $('send-btn').disabled = true;

  // Show typing
  isLoading = true;
  $('typing').classList.remove('hidden');
  $('error').classList.add('hidden');
  scrollToBottom();

  try {
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'bot' ? 'assistant' : m.role,
      content: m.content
    }));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: text,
        language: currentLang,
        history
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details?.includes('quota') ? 'QUOTA' : 'ERROR');
    }

    // Show celebration on first message
    if (messageCount === 1) {
      showCelebration();
    }

    addMessage('bot', data.reply);

  } catch (error) {
    const t = translations[currentLang];
    $('error-text').textContent = error.message === 'QUOTA' ? t.quotaError : t.error;
    $('error').classList.remove('hidden');
  }

  isLoading = false;
  $('typing').classList.add('hidden');
}

// ===== CELEBRATION =====
function showCelebration() {
  const celebration = $('celebration');
  celebration.classList.remove('hidden');
  
  setTimeout(() => {
    celebration.classList.add('hidden');
  }, 2000);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
