// ===== TRANSLATIONS =====
const translations = {
  en: {
    appName: "Tamrini",
    tagline: "Your Math Tutor",
    feature: "I help you understand math by asking guiding questions — never giving direct answers!",
    startBtn: "Start Learning",
    placeholder: "Ask your math question...",
    welcome: "Hello! 👋 I'm Tamrini, your math tutor.\n\nI won't give you direct answers, but I'll help you think through problems step by step.\n\nWhat are you working on today?",
    thinking: "Thinking...",
    online: "Online",
    error: "Oops! Something went wrong. Please try again.",
    quotaError: "Too many requests! Please wait a moment.",
  },
  fr: {
    appName: "Tamrini",
    tagline: "Ton Tuteur de Maths",
    feature: "Je t'aide à comprendre les maths en posant des questions guidées — jamais de réponses directes!",
    startBtn: "Commencer",
    placeholder: "Pose ta question de maths...",
    welcome: "Salut! 👋 Je suis Tamrini, ton tuteur de maths.\n\nJe ne te donnerai pas les réponses directement, mais je t'aiderai à réfléchir étape par étape.\n\nSur quoi travailles-tu aujourd'hui?",
    thinking: "Je réfléchis...",
    online: "En ligne",
    error: "Oups! Une erreur s'est produite. Réessaie.",
    quotaError: "Trop de demandes! Attends un moment.",
  },
  ar: {
    appName: "تمريني",
    tagline: "معلمك في الرياضيات",
    feature: "أساعدك على فهم الرياضيات من خلال طرح أسئلة توجيهية - لن أعطيك الإجابات مباشرة!",
    startBtn: "ابدأ التعلم",
    placeholder: "اكتب سؤالك في الرياضيات...",
    welcome: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات.\n\nلن أعطيك الإجابات مباشرة، لكنني سأساعدك على التفكير خطوة بخطوة.\n\nما الذي تعمل عليه اليوم؟",
    thinking: "أفكر...",
    online: "متصل",
    error: "عذراً! حدث خطأ. حاول مرة أخرى.",
    quotaError: "طلبات كثيرة! انتظر قليلاً.",
  }
};

// ===== STATE =====
let currentLang = localStorage.getItem('tamrini_lang') || 'en';
let messages = [];
let isLoading = false;

const API_URL = 'https://tamarini-app.vercel.app/api/chat';

// ===== ELEMENTS =====
const $ = id => document.getElementById(id);
const splash = $('splash');
const homeScreen = $('home-screen');
const chatScreen = $('chat-screen');
const startBtn = $('start-btn');
const backBtn = $('back-btn');
const messagesContainer = $('messages');
const messageInput = $('message-input');
const sendBtn = $('send-btn');
const typingIndicator = $('typing');
const errorContainer = $('error');
const errorText = $('error-text');
const errorClose = $('error-close');
const langPills = document.querySelectorAll('.lang-pill');

// ===== INIT =====
function init() {
  // Hide splash after load
  setTimeout(() => {
    splash.classList.add('hidden');
    homeScreen.classList.add('active');
  }, 1500);

  updateLanguage(currentLang);
  setupEventListeners();
}

// ===== LANGUAGE =====
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tamrini_lang', lang);
  
  const t = translations[lang];
  
  // Update UI
  $('app-name').textContent = t.appName;
  $('app-tagline').textContent = t.tagline;
  $('feature-text').textContent = t.feature;
  $('start-text').textContent = t.startBtn;
  $('chat-title').textContent = t.appName;
  $('status-text').textContent = t.online;
  messageInput.placeholder = t.placeholder;
  
  // Update pills
  langPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.lang === lang);
  });
  
  // RTL
  document.body.classList.toggle('rtl', lang === 'ar');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Language pills
  langPills.forEach(pill => {
    pill.addEventListener('click', () => updateLanguage(pill.dataset.lang));
  });

  // Start chat
  startBtn.addEventListener('click', () => {
    homeScreen.classList.remove('active');
    chatScreen.classList.add('active');
    
    if (messages.length === 0) {
      addMessage('bot', translations[currentLang].welcome);
    }
    
    messageInput.focus();
  });

  // Back button
  backBtn.addEventListener('click', () => {
    chatScreen.classList.remove('active');
    homeScreen.classList.add('active');
  });

  // Input
  messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim() || isLoading;
    autoResize();
  });

  // Send
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Error close
  errorClose.addEventListener('click', () => {
    errorContainer.classList.add('hidden');
  });
}

// ===== AUTO RESIZE TEXTAREA =====
function autoResize() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// ===== ADD MESSAGE =====
function addMessage(role, content) {
  messages.push({ role, content });
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role === 'user' ? 'user' : 'bot'}`;
  
  if (role === 'bot') {
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <div class="message-header">
          <span class="message-avatar">📐</span>
          <span class="message-name">Tamrini</span>
        </div>
        <div class="message-content">${formatMessage(content)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <div class="message-content">${formatMessage(content)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
  }
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// ===== FORMAT MESSAGE =====
function formatMessage(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// ===== SCROLL TO BOTTOM =====
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || isLoading) return;

  // Add user message
  addMessage('user', text);
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendBtn.disabled = true;

  // Show typing
  isLoading = true;
  typingIndicator.classList.remove('hidden');
  errorContainer.classList.add('hidden');
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

    addMessage('bot', data.reply);

  } catch (error) {
    const t = translations[currentLang];
    errorText.textContent = error.message === 'QUOTA' ? t.quotaError : t.error;
    errorContainer.classList.remove('hidden');
  }

  isLoading = false;
  typingIndicator.classList.add('hidden');
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
