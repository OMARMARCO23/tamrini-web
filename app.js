console.log('Tamrini Starting...');

window.onload = function() {
  console.log('Page Loaded!');
  
  // ===== STATE =====
  var currentLang = localStorage.getItem('tamrini_lang') || 'en';
  var messages = [];
  var history = [];
  var isLoading = false;
  var lastExercise = '';
  
  var API_URL = 'https://tamarini-app.vercel.app/api/chat';
  
  // ===== TRANSLATIONS =====
  var translations = {
    en: {
      tagline: "Math Tutor",
      newExercise: "New Exercise",
      similarExercise: "Similar Exercise",
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
      whatIsDesc: "Tamrini is an AI-powered math tutor designed for students aged 12-18. Instead of giving direct answers, Tamrini guides you through problems step by step.",
      howWorks: "How it Works",
      subjects: "Subjects Covered",
      historyTitle: "History",
      historyEmpty: "No History Yet",
      historyEmptyDesc: "Your solved exercises will appear here",
      greeting: "Hello! 👋 I'm Tamrini, your math tutor.\n\nTell me what exercise you're working on, and I'll help you solve it step by step.",
      newGreeting: "Great! Let's start a new exercise. 📝\n\nWhat math problem would you like to work on?",
      similarRequest: "Give me a similar exercise to practice.",
      similarGreeting: "Here's a similar exercise for you to practice! 🎯\n\n"
    },
    fr: {
      tagline: "Tuteur de Maths",
      newExercise: "Nouvel Exercice",
      similarExercise: "Exercice Similaire",
      emptyTitle: "Prêt à Apprendre?",
      emptyDesc: "Clique sur \"Nouvel Exercice\" ou tape ta question",
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
      whatIsDesc: "Tamrini est un tuteur de maths alimenté par l'IA, conçu pour les élèves de 12-18 ans.",
      howWorks: "Comment ça marche",
      subjects: "Matières couvertes",
      historyTitle: "Historique",
      historyEmpty: "Pas encore d'historique",
      historyEmptyDesc: "Tes exercices résolus apparaîtront ici",
      greeting: "Bonjour! 👋 Je suis Tamrini, ton tuteur de maths.\n\nDis-moi sur quel exercice tu travailles.",
      newGreeting: "Super! Commençons un nouvel exercice. 📝\n\nQuel problème veux-tu résoudre?",
      similarRequest: "Donne-moi un exercice similaire pour m'entraîner.",
      similarGreeting: "Voici un exercice similaire pour t'entraîner! 🎯\n\n"
    },
    ar: {
      tagline: "معلم الرياضيات",
      newExercise: "تمرين جديد",
      similarExercise: "تمرين مشابه",
      emptyTitle: "مستعد للتعلم؟",
      emptyDesc: "انقر على \"تمرين جديد\" أو اكتب سؤالك",
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
      whatIsDesc: "تمريني هو معلم رياضيات ذكي مصمم للطلاب من 12-18 سنة.",
      howWorks: "كيف يعمل",
      subjects: "المواد المتاحة",
      historyTitle: "السجل",
      historyEmpty: "لا يوجد سجل بعد",
      historyEmptyDesc: "ستظهر تمارينك هنا",
      greeting: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات.\n\nأخبرني ما هو التمرين الذي تعمل عليه.",
      newGreeting: "ممتاز! لنبدأ تمريناً جديداً. 📝\n\nما هي المسألة التي تريد حلها؟",
      similarRequest: "أعطني تمريناً مشابهاً للتدريب.",
      similarGreeting: "إليك تمريناً مشابهاً للتدريب! 🎯\n\n"
    }
  };
  
  // ===== LOAD SAVED DATA =====
  try {
    var savedMessages = localStorage.getItem('tamrini_messages');
    if (savedMessages) {
      messages = JSON.parse(savedMessages);
    }
    var savedHistory = localStorage.getItem('tamrini_history');
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
    var savedExercise = localStorage.getItem('tamrini_last_exercise');
    if (savedExercise) {
      lastExercise = savedExercise;
    }
  } catch(e) {
    console.log('Error loading data:', e);
  }
  
  // ===== INITIALIZE =====
  updateLanguage(currentLang);
  renderMessages();
  renderHistory();
  updateSimilarButton();
  setupListeners();
  
  console.log('Tamrini Ready!');
  
  // ===== UPDATE SIMILAR BUTTON =====
  function updateSimilarButton() {
    var btn = document.getElementById('similar-exercise-btn');
    if (btn) {
      if (lastExercise && messages.length >= 4) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    }
  }
  
  // ===== UPDATE LANGUAGE =====
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tamrini_lang', lang);
    
    var t = translations[lang];
    
    // Update texts
    var elements = {
      'tagline': t.tagline,
      'new-exercise-text': t.newExercise,
      'similar-exercise-text': t.similarExercise,
      'empty-title': t.emptyTitle,
      'empty-desc': t.emptyDesc,
      'typing-text': t.thinking,
      'nav-home': t.navHome,
      'nav-history': t.navHistory,
      'nav-settings': t.navSettings,
      'nav-about': t.navAbout,
      'settings-title': t.settingsTitle,
      'lang-section-title': t.langSection,
      'clear-section-title': t.clearSection,
      'clear-chat-text': t.clearChat,
      'about-title': t.aboutTitle,
      'what-is-title': t.whatIs,
      'what-is-desc': t.whatIsDesc,
      'how-works-title': t.howWorks,
      'subjects-title': t.subjects,
      'history-title': t.historyTitle,
      'history-empty-title': t.historyEmpty,
      'history-empty-desc': t.historyEmptyDesc
    };
    
    for (var id in elements) {
      var el = document.getElementById(id);
      if (el) el.textContent = elements[id];
    }
    
    // Update placeholder
    var input = document.getElementById('message-input');
    if (input) input.placeholder = t.placeholder;
    
    // Update language buttons
    var langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(function(btn) {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update settings checkmarks
    var checks = document.querySelectorAll('.option-check');
    checks.forEach(function(check) {
      if (check.dataset.check === lang) {
        check.classList.add('active');
      } else {
        check.classList.remove('active');
      }
    });
    
    // RTL for Arabic
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    console.log('Language changed to:', lang);
  }
  
  // ===== SETUP LISTENERS =====
  function setupListeners() {
    console.log('Setting up listeners...');
    
    // Language buttons in header
    var langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(function(btn) {
      btn.onclick = function() {
        updateLanguage(this.dataset.lang);
      };
    });
    
    // Language options in settings
    var langOptions = document.querySelectorAll('.setting-option[data-lang]');
    langOptions.forEach(function(btn) {
      btn.onclick = function() {
        updateLanguage(this.dataset.lang);
      };
    });
    
    // Bottom navigation
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
      item.onclick = function() {
        var page = this.dataset.page;
        console.log('Navigate to:', page);
        
        // Hide all pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function(p) {
          p.classList.remove('active');
        });
        
        // Deactivate all nav items
        navItems.forEach(function(n) {
          n.classList.remove('active');
        });
        
        // Show selected page
        var targetPage = document.getElementById('page-' + page);
        if (targetPage) {
          targetPage.classList.add('active');
        }
        
        // Activate nav item
        this.classList.add('active');
      };
    });
    
    // New Exercise button
    var newExBtn = document.getElementById('new-exercise-btn');
    if (newExBtn) {
      newExBtn.onclick = function() {
        console.log('New Exercise clicked');
        messages = [];
        lastExercise = '';
        localStorage.setItem('tamrini_messages', '[]');
        localStorage.setItem('tamrini_last_exercise', '');
        renderMessages();
        updateSimilarButton();
        addMessage('bot', translations[currentLang].newGreeting);
        
        var input = document.getElementById('message-input');
        if (input) input.focus();
      };
    }
    
    // Similar Exercise button
    var similarBtn = document.getElementById('similar-exercise-btn');
    if (similarBtn) {
      similarBtn.onclick = function() {
        console.log('Similar Exercise clicked');
        requestSimilarExercise();
      };
    }
    
    // Clear chat button
    var clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
      clearBtn.onclick = function() {
        if (confirm('Clear all chat history?')) {
          messages = [];
          history = [];
          lastExercise = '';
          localStorage.setItem('tamrini_messages', '[]');
          localStorage.setItem('tamrini_history', '[]');
          localStorage.setItem('tamrini_last_exercise', '');
          renderMessages();
          renderHistory();
          updateSimilarButton();
        }
      };
    }
    
    // Message input
    var input = document.getElementById('message-input');
    var sendBtn = document.getElementById('send-btn');
    
    if (input) {
      input.oninput = function() {
        if (sendBtn) {
          sendBtn.disabled = !this.value.trim() || isLoading;
        }
        // Auto resize
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
      };
      
      input.onkeydown = function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      };
    }
    
    // Send button
    if (sendBtn) {
      sendBtn.onclick = function() {
        sendMessage();
      };
    }
    
    // Error close
    var errorClose = document.getElementById('error-close');
    if (errorClose) {
      errorClose.onclick = function() {
        var error = document.getElementById('error');
        if (error) error.classList.add('hidden');
      };
    }
    
    console.log('Listeners ready!');
  }
  
  // ===== REQUEST SIMILAR EXERCISE =====
  function requestSimilarExercise() {
    if (!lastExercise || isLoading) return;
    
    console.log('Requesting similar exercise for:', lastExercise);
    
    // Clear current messages but keep track of the exercise type
    messages = [];
    localStorage.setItem('tamrini_messages', '[]');
    renderMessages();
    
    // Send request for similar exercise
    var t = translations[currentLang];
    var request = t.similarRequest + " Original exercise: " + lastExercise;
    
    // Show that we're getting a new exercise
    addMessage('bot', t.similarGreeting);
    
    // Call API for similar exercise
    sendToAPI(request, true);
  }
  
  // ===== RENDER MESSAGES =====
  function renderMessages() {
    var container = document.getElementById('messages');
    var emptyState = document.getElementById('empty-state');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (messages.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      
      messages.forEach(function(msg) {
        var el = createMessageEl(msg);
        container.appendChild(el);
      });
      
      scrollToBottom();
    }
  }
  
  // ===== CREATE MESSAGE ELEMENT =====
  function createMessageEl(msg) {
    var div = document.createElement('div');
    div.className = 'message ' + (msg.role === 'user' ? 'user' : 'bot');
    
    var avatar = msg.role === 'user' ? '👤' : '📐';
    var time = msg.time || '';
    
    var text = msg.content || '';
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    
    div.innerHTML = '<div class="message-avatar">' + avatar + '</div>' +
      '<div class="message-bubble">' +
      '<div class="message-text">' + text + '</div>' +
      '<div class="message-time">' + time + '</div>' +
      '</div>';
    
    return div;
  }
  
  // ===== ADD MESSAGE =====
  function addMessage(role, content) {
    var time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    var msg = {role: role, content: content, time: time};
    
    messages.push(msg);
    localStorage.setItem('tamrini_messages', JSON.stringify(messages));
    
    var emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.classList.add('hidden');
    
    var container = document.getElementById('messages');
    if (container) {
      var el = createMessageEl(msg);
      container.appendChild(el);
      scrollToBottom();
    }
    
    // Save first user message as the exercise
    if (role === 'user' && messages.length <= 2) {
      lastExercise = content;
      localStorage.setItem('tamrini_last_exercise', lastExercise);
      saveToHistory(content);
    }
    
    // Show similar button after a few exchanges
    updateSimilarButton();
  }
  
  // ===== SAVE TO HISTORY =====
  function saveToHistory(question) {
    var item = {
      id: Date.now(),
      question: question.substring(0, 100),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    };
    
    history.unshift(item);
    if (history.length > 20) history.pop();
    
    localStorage.setItem('tamrini_history', JSON.stringify(history));
    renderHistory();
  }
  
  // ===== RENDER HISTORY =====
  function renderHistory() {
    var container = document.getElementById('history-list');
    var emptyState = document.getElementById('history-empty');
    
    if (!container) return;
    
    if (history.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      container.innerHTML = '';
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      
      var html = '';
      history.forEach(function(item) {
        html += '<div class="history-item">' +
          '<div class="history-question">' + item.question + '</div>' +
          '<div class="history-meta">' +
          '<span>' + item.date + '</span>' +
          '<span>' + item.time + '</span>' +
          '</div></div>';
      });
      
      container.innerHTML = html;
    }
  }
  
  // ===== SCROLL TO BOTTOM =====
  function scrollToBottom() {
    var container = document.getElementById('messages');
    if (container && container.parentElement) {
      container.parentElement.scrollTop = container.parentElement.scrollHeight;
    }
  }
  
  // ===== SEND MESSAGE =====
  function sendMessage() {
    var input = document.getElementById('message-input');
    var sendBtn = document.getElementById('send-btn');
    
    if (!input) return;
    
    var text = input.value.trim();
    if (!text || isLoading) return;
    
    console.log('Sending:', text);
    
    // Add user message
    addMessage('user', text);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    if (sendBtn) sendBtn.disabled = true;
    
    // Call API
    sendToAPI(text, false);
  }
  
  // ===== SEND TO API =====
  function sendToAPI(text, isSimilarRequest) {
    // Show typing
    isLoading = true;
    var typing = document.getElementById('typing');
    if (typing) typing.classList.remove('hidden');
    
    // Hide error
    var error = document.getElementById('error');
    if (error) error.classList.add('hidden');
    
    scrollToBottom();
    
    // Build history
    var chatHistory = [];
    var recent = messages.slice(-10);
    recent.forEach(function(m) {
      chatHistory.push({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      });
    });
    
    // Special prompt for similar exercise
    var requestText = text;
    if (isSimilarRequest) {
      requestText = "Generate a similar math exercise to this one: " + lastExercise + ". Just give me the new exercise problem, then guide me through solving it step by step when I try.";
    }
    
    // Call API
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        question: requestText,
        language: currentLang,
        history: chatHistory
      })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('Response:', data);
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }
      
      addMessage('bot', data.reply);
      
      // If this was a similar exercise request, save the new exercise
      if (isSimilarRequest && data.reply) {
        // Extract the exercise from the response (first line usually)
        var newExercise = data.reply.split('\n')[0];
        lastExercise = newExercise;
        localStorage.setItem('tamrini_last_exercise', lastExercise);
      }
    })
    .catch(function(err) {
      console.error('Error:', err);
      
      var t = translations[currentLang];
      var errorText = document.getElementById('error-text');
      
      if (errorText) {
        if (err.message && err.message.includes('quota')) {
          errorText.textContent = t.quotaError;
        } else {
          errorText.textContent = t.error;
        }
      }
      
      var error = document.getElementById('error');
      if (error) error.classList.remove('hidden');
    })
    .finally(function() {
      isLoading = false;
      var typing = document.getElementById('typing');
      if (typing) typing.classList.add('hidden');
      
      var sendBtn = document.getElementById('send-btn');
      var input = document.getElementById('message-input');
      if (sendBtn && input) {
        sendBtn.disabled = !input.value.trim();
      }
    });
  }
};
