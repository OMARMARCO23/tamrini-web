// ===== TRANSLATIONS =====
const translations = {
  en: {
    tagline: "Math Tutor",
    newExercise: "New Exercise",
    emptyTitle: "Ready to Learn?",
    emptyDesc: "Click \"New Exercise\" or type your math question below",
    placeholder: "Type your math question...",
    thinking: "Thinking...",
    error: "Something went wrong. Please try again.",
    quotaError: "Too many requests. Please wait a moment.",
    navHome: "Home",
    navHistory: "History",
    navSettings: "Settings",
    navAbout: "About",
    settingsTitle: "Settings",
    langSection: "Language",
    clearSection: "Data",
    clearChat: "Clear Chat History",
    aboutTitle: "About",
    whatIs: "What is Tamrini?",
    whatIsDesc: "Tamrini is an AI-powered math tutor designed for students aged 12-18. Instead of giving direct answers, Tamrini guides you through problems step by step, helping you truly understand mathematics.",
    howWorks: "How it Works",
    subjects: "Subjects Covered",
    historyTitle: "History",
    historyEmpty: "No History Yet",
    historyEmptyDesc: "Your solved exercises will appear here",
    greeting: "Hello! 👋 I'm Tamrini, your math tutor.\n\nTell me what exercise you're working on, and I'll help you solve it step by step.",
    newExerciseGreeting: "Great! Let's start a new exercise. 📝\n\nWhat math problem would you like to work on?"
  },
  fr: {
    tagline: "Tuteur de Maths",
    newExercise: "Nouvel Exercice",
    emptyTitle: "Prêt à Apprendre?",
    emptyDesc: "Clique sur \"Nouvel Exercice\" ou tape ta question ci-dessous",
    placeholder: "Écris ta question de maths...",
    thinking: "Je réfléchis...",
    error: "Une erreur s'est produite. Réessaie.",
    quotaError: "Trop de demandes. Attends un moment.",
    navHome: "Accueil",
    navHistory: "Historique",
    navSettings: "Paramètres",
    navAbout: "À propos",
    settingsTitle: "Paramètres",
    langSection: "Langue",
    clearSection: "Données",
    clearChat: "Effacer l'historique",
    aboutTitle: "À propos",
    whatIs: "Qu'est-ce que Tamrini?",
    whatIsDesc: "Tamrini est un tuteur de maths alimenté par l'IA, conçu pour les élèves de 12 à 18 ans. Au lieu de donner des réponses directes, Tamrini te guide pas à pas pour vraiment comprendre les mathématiques.",
    howWorks: "Comment ça marche",
    subjects: "Matières couvertes",
    historyTitle: "Historique",
    historyEmpty: "Pas encore d'historique",
    historyEmptyDesc: "Tes exercices résolus apparaîtront ici",
    greeting: "Bonjour! 👋 Je suis Tamrini, ton tuteur de maths.\n\nDis-moi sur quel exercice tu travailles, et je t'aiderai à le résoudre étape par étape.",
    newExerciseGreeting: "Super! Commençons un nouvel exercice. 📝\n\nQuel problème de maths veux-tu résoudre?"
  },
  ar: {
    tagline: "معلم الرياضيات",
    newExercise: "تمرين جديد",
    emptyTitle: "مستعد للتعلم؟",
    emptyDesc: "انقر على \"تمرين جديد\" أو اكتب سؤالك أدناه",
    placeholder: "اكتب سؤالك في الرياضيات...",
    thinking: "أفكر...",
    error: "حدث خطأ. حاول مرة أخرى.",
    quotaError: "طلبات كثيرة. انتظر قليلاً.",
    navHome: "الرئيسية",
    navHistory: "السجل",
    navSettings: "الإعدادات",
    navAbout: "حول",
    settingsTitle: "الإعدادات",
    langSection: "اللغة",
    clearSection: "البيانات",
    clearChat: "مسح المحادثات",
    aboutTitle: "حول التطبيق",
    whatIs: "ما هو تمريني؟",
    whatIsDesc: "تمريني هو معلم رياضيات ذكي مصمم للطلاب من 12 إلى 18 سنة. بدلاً من إعطاء الإجابات مباشرة، يرشدك تمريني خطوة بخطوة لفهم الرياضيات حقاً.",
    howWorks: "كيف يعمل",
    subjects: "المواد المتاحة",
    historyTitle: "السجل",
    historyEmpty: "لا يوجد سجل بعد",
    historyEmptyDesc: "ستظهر تمارينك المحلولة هنا",
    greeting: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات.\n\nأخبرني ما هو التمرين الذي تعمل عليه، وسأساعدك على حله خطوة بخطوة.",
    newExerciseGreeting: "ممتاز! لنبدأ تمريناً جديداً. 📝\n\nما هي المسألة التي تريد حلها؟"
  }
};

// ===== STATE =====
let currentLang = localStorage.getItem('tamrini_lang') || 'en';
let messages = JSON.parse(localStorage.getItem('tamrini_messages') || '[]');
let history = JSON.parse(localStorage.getItem('tamrini_history') || '[]');
let isLoading = false;

const API_URL = 'https://tamarini-app.vercel.app/api/chat';

// ===== ELEMENTS =====
const $ = id => document.getElementById(id);

// ===== PROFESSIONAL PROMPT =====
function getSystemPrompt(lang) {
  const prompts = {
    en: `You are Tamrini, a professional math tutor for students aged 12-18.

IMPORTANT RULES:
1. NEVER give the direct answer immediately
2. Guide the student with clear, focused questions
3. Break down problems into small, manageable steps
4. When student is stuck, give ONE small hint at a time
5. Keep responses SHORT and CLEAR (2-4 sentences max)
6. Use simple language appropriate for the student's level
7. Be encouraging but not excessive
8. If the student's answer is wrong, gently redirect without discouraging
9. When the student solves it correctly, briefly congratulate and summarize what they learned

RESPONSE FORMAT:
- Start with acknowledging their question/answer
- Ask ONE guiding question OR give ONE hint
- Keep it brief and focused

Respond in English.`,

    fr: `Tu es Tamrini, un tuteur de maths professionnel pour les élèves de 12 à 18 ans.

RÈGLES IMPORTANTES:
1. Ne JAMAIS donner la réponse directement
2. Guide l'élève avec des questions claires et ciblées
3. Décompose les problèmes en petites étapes
4. Si l'élève bloque, donne UN indice à la fois
5. Garde les réponses COURTES et CLAIRES (2-4 phrases max)
6. Utilise un langage simple adapté au niveau de l'élève
7. Sois encourageant mais pas excessif
8. Si la réponse est fausse, redirige gentiment sans décourager
9. Quand l'élève réussit, félicite brièvement et résume ce qu'il a appris

FORMAT DE RÉPONSE:
- Commence par reconnaître la question/réponse
- Pose UNE question guidée OU donne UN indice
- Reste bref et concentré

Réponds en français.`,

    ar: `أنت تمريني، معلم رياضيات محترف للطلاب من 12 إلى 18 سنة.

القواعد المهمة:
1. لا تعطي الإجابة المباشرة أبداً
2. وجّه الطالب بأسئلة واضحة ومركزة
3. قسّم المسائل إلى خطوات صغيرة
4. إذا توقف الطالب، أعطِ تلميحاً واحداً فقط
5. اجعل الردود قصيرة وواضحة (2-4 جمل كحد أقصى)
6. استخدم لغة بسيطة مناسبة لمستوى الطالب
7. كن مشجعاً لكن بدون مبالغة
8. إذا كانت الإجابة خاطئة، صحح بلطف دون إحباط
9. عندما ينجح الطالب، هنئه باختصار ولخص ما تعلمه

صيغة الرد:
- ابدأ بالاعتراف بالسؤال/الإجابة
- اطرح سؤالاً توجيهياً واحداً أو أعطِ تلميحاً واحداً
- كن موجزاً ومركزاً

أجب بالعربية.`
  };
  
  return prompts[lang] || prompts.en;
}

// ===== INIT =====
function init() {
  updateLanguage(currentLang);
  setupEventListeners();
  renderMessages();
  renderHistory();
}

// ===== UPDATE LANGUAGE =====
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tamrini_lang', lang);
  
  const t = translations[lang];
  
  // Update all text elements
  $('tagline').textContent = t.tagline;
  $('new-exercise-text').textContent = t.newExercise;
  $('empty-title').textContent = t.emptyTitle;
  $('empty-desc').textContent = t.emptyDesc;
  $('message-input').placeholder = t.placeholder;
  $('typing-text').textContent = t.thinking;
  $('nav-home').textContent = t.navHome;
  $('nav-history').textContent = t.navHistory;
  $('nav-settings').textContent = t.navSettings;
  $('nav-about').textContent = t.navAbout;
  $('settings-title').textContent = t.settingsTitle;
  $('lang-section-title').textContent = t.langSection;
  $('clear-section-title').textContent = t.clearSection;
  $('clear-chat-text').textContent = t.clearChat;
  $('about-title').textContent = t.aboutTitle;
  $('what-is-title').textContent = t.whatIs;
  $('what-is-desc').textContent = t.whatIsDesc;
  $('how-works-title').textContent = t.howWorks;
  $('subjects-title').textContent = t.subjects;
  $('history-title').textContent = t.historyTitle;
  $('history-empty-title').textContent = t.historyEmpty;
  $('history-empty-desc').textContent = t.historyEmptyDesc;
  
  // Update active states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  document.querySelectorAll('.option-check').forEach(check => {
    check.classList.toggle('active', check.dataset.check === lang);
  });
  
  // RTL
  document.body.classList.toggle('rtl', lang === 'ar');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Header language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
  });
  
  // Settings language options
  document.querySelectorAll('.setting-option[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
  });
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      
      $(`page-${page}`).classList.add('active');
      item.classList.add('active');
    });
  });
  
  // New Exercise
  $('new-exercise-btn').addEventListener('click', () => {
    messages = [];
    localStorage.setItem('tamrini_messages', '[]');
    renderMessages();
    addMessage('bot', translations[currentLang].newExerciseGreeting);
    $('message-input').focus();
  });
  
  // Clear chat
  $('clear-chat-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear chat history?')) {
      messages = [];
      history = [];
      localStorage.setItem('tamrini_messages', '[]');
      localStorage.setItem('tamrini_history', '[]');
      renderMessages();
      renderHistory();
    }
  });
  
  // Input
  const input = $('message-input');
  const sendBtn = $('send-btn');
  
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim() || isLoading;
    autoResize(input);
  });
  
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

// ===== RENDER MESSAGES =====
function renderMessages() {
  const container = $('messages');
  const emptyState = $('empty-state');
  
  container.innerHTML = '';
  
  if (messages.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    messages.forEach(msg => {
      container.appendChild(createMessageElement(msg));
    });
    scrollToBottom();
  }
}

// ===== CREATE MESSAGE ELEMENT =====
function createMessageElement(msg) {
  const 
