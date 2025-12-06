console.log('Tamrini Starting...');

window.onload = function() {
  console.log('Page Loaded!');
  
  // ===== STATE =====
  var currentLang = localStorage.getItem('tamrini_lang') || 'en';
  var darkMode = localStorage.getItem('tamrini_dark_mode') === 'true';
  var messages = [];
  var history = [];
  var isLoading = false;
  var lastExercise = '';
  var selectedImage = null;
  
  var API_URL = 'https://tamarini-app.vercel.app/api/chat';
  
  // ===== TRANSLATIONS =====
  var translations = {
    en: {
      tagline: "Math Tutor",
      newExercise: "New Exercise",
      similarExercise: "Similar Exercise",
      emptyTitle: "Ready to Learn?",
      emptyDesc: "Click \"New Exercise\", upload an image, or type your math question",
      placeholder: "Type your math question...",
      thinking: "Thinking...",
      error: "Something went wrong. Please try again.",
      quotaError: "Too many requests. Please wait a moment.",
      navHome: "Home",
      navHistory: "History",
      navSettings: "Settings",
      navAbout: "About",
      settingsTitle: "Settings",
      themeSection: "Appearance",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
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
      greeting: "Hello! 👋 I'm Tamrini, your math tutor.\n\nYou can:\n• Type a math question\n• Upload an image of your exercise\n\nI'll help you solve it step by step!",
      newGreeting: "Great! Let's start a new exercise. 📝\n\nType your math problem or upload an image!",
      imageUploaded: "I see your exercise! Let me take a look... 🔍",
      solved: "Solved",
      inProgress: "In Progress",
      messages: "messages"
    },
    fr: {
      tagline: "Tuteur de Maths",
      newExercise: "Nouvel Exercice",
      similarExercise: "Exercice Similaire",
      emptyTitle: "Prêt à Apprendre?",
      emptyDesc: "Clique sur \"Nouvel Exercice\", télécharge une image, ou tape ta question",
      placeholder: "Écris ta question de maths...",
      thinking: "Je réfléchis...",
      error: "Une erreur s'est produite. Réessaie.",
      quotaError: "Trop de demandes. Attends un moment.",
      navHome: "Accueil",
      navHistory: "Historique",
      navSettings: "Paramètres",
      navAbout: "À propos",
      settingsTitle: "Paramètres",
      themeSection: "Apparence",
      lightMode: "Mode Clair",
      darkMode: "Mode Sombre",
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
      greeting: "Bonjour! 👋 Je suis Tamrini, ton tuteur de maths.\n\nTu peux:\n• Écrire une question de maths\n• Télécharger une image de ton exercice\n\nJe t'aiderai étape par étape!",
      newGreeting: "Super! Commençons un nouvel exercice. 📝\n\nÉcris ton problème ou télécharge une image!",
      imageUploaded: "Je vois ton exercice! Laisse-moi regarder... 🔍",
      solved: "Résolu",
      inProgress: "En cours",
      messages: "messages"
    },
    ar: {
      tagline: "معلم الرياضيات",
      newExercise: "تمرين جديد",
      similarExercise: "تمرين مشابه",
      emptyTitle: "مستعد للتعلم؟",
      emptyDesc: "انقر على \"تمرين جديد\"، ارفع صورة، أو اكتب سؤالك",
      placeholder: "اكتب سؤالك في الرياضيات...",
      thinking: "أفكر...",
      error: "حدث خطأ. حاول مرة أخرى.",
      quotaError: "طلبات كثيرة. انتظر قليلاً.",
      navHome: "الرئيسية",
      navHistory: "السجل",
      navSettings: "الإعدادات",
      navAbout: "حول",
      settingsTitle: "الإعدادات",
      themeSection: "المظهر",
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع الداكن",
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
      greeting: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات.\n\nيمكنك:\n• كتابة سؤال رياضيات\n• رفع صورة لتمرينك\n\nسأساعدك خطوة بخطوة!",
      newGreeting: "ممتاز! لنبدأ تمريناً جديداً. 📝\n\nاكتب مسألتك أو ارفع صورة!",
      imageUploaded: "أرى تمرينك! دعني أنظر... 🔍",
      solved: "محلول",
      inProgress: "جاري الحل",
      messages: "رسائل"
    }
  };
  
  // ===== LOAD SAVED DATA =====
  try {
    var savedMessages = localStorage.getItem('tamrini_messages');
    if (savedMessages) messages = JSON.parse(savedMessages);
    
    var savedHistory = localStorage.getItem('tamrini_history');
    if (savedHistory) history = JSON.parse(savedHistory);
    
    var savedExercise = localStorage.getItem('tamrini_last_exercise');
    if (savedExercise) lastExercise = savedExercise;
  } catch(e) {
    console.log('Error loading data:', e);
  }
  
  // ===== INITIALIZE =====
  updateTheme(darkMode);
  updateLanguage(currentLang);
  renderMessages();
  renderHistory();
  updateSimilarButton();
  setupListeners();
  
  console.log('Tamrini Ready!');
  
  // ===== UPDATE THEME =====
  function updateTheme(isDark) {
    darkMode = isDark;
    localStorage.setItem('tamrini_dark_mode', isDark);
    
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.getElementById('theme-icon').textContent = '☀️';
      document.getElementById('theme-color-meta').setAttribute('content', '#1F2937');
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('theme-icon').textContent = '🌙';
      document.getElementById('theme-color-meta').setAttribute('content', '#4F46E5');
    }
    
    // Update settings checkmarks
    document.querySelectorAll('[data-check-theme]').forEach(function(check) {
      var theme = check.dataset.checkTheme;
      if ((theme === 'dark' && isDark) || (theme === 'light' && !isDark)) {
        check.classList.add('active');
      } else {
        check.classList.remove('active');
      }
    });
    
    console.log('Theme changed to:', isDark ? 'dark' : 'light');
  }
  
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
      'theme-section-title': t.themeSection,
      'light-mode-text': t.lightMode,
      'dark-mode-text': t.darkMode,
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
    
    var input = document.getElementById('message-input');
    if (input) input.placeholder = t.placeholder;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update settings checkmarks
    document.querySelectorAll('.option-check[data-check]').forEach(function(check) {
      check.classList.toggle('active', check.dataset.check === lang);
    });
    
    // RTL for Arabic
    document.body.classList.toggle('rtl', lang === 'ar');
    
    // Re-render history with new language
    renderHistory();
    
    console.log('Language changed to:', lang);
  }
  
  // ===== SETUP LISTENERS =====
  function setupListeners() {
    console.log('Setting up listeners...');
    
    // Theme toggle in header
    document.getElementById('theme-toggle').onclick = function() {
      updateTheme(!darkMode);
    };
    
    // Theme options in settings
    document.getElementById('theme-light-btn').onclick = function() {
      updateTheme(false);
    };
    document.getElementById('theme-dark-btn').onclick = function() {
      updateTheme(true);
    };
    
    // Language buttons in header
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.onclick = function() {
        updateLanguage(this.dataset.lang);
      };
    });
    
    // Language options in settings
    document.querySelectorAll('.setting-option[data-lang]').forEach(function(btn) {
      btn.onclick = function() {
        updateLanguage(this.dataset.lang);
      };
    });
    
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.onclick = function() {
        var page = this.dataset.page;
        
        document.querySelectorAll('.page').forEach(function(p) {
          p.classList.remove('active');
        });
        document.querySelectorAll('.nav-item').forEach(function(n) {
          n.classList.remove('active');
        });
        
        document.getElementById('page-' + page).classList.add('active');
        this.classList.add('active');
      };
    });
    
    // New Exercise button
    document.getElementById('new-exercise-btn').onclick = function() {
      messages = [];
      lastExercise = '';
      selectedImage = null;
      localStorage.setItem('tamrini_messages', '[]');
      localStorage.setItem('tamrini_last_exercise', '');
      hideImagePreview();
      renderMessages();
      updateSimilarButton();
      addMessage('bot', translations[currentLang].newGreeting);
      document.getElementById('message-input').focus();
    };
    
    // Similar Exercise button
    document.getElementById('similar-exercise-btn').onclick = function() {
      requestSimilarExercise();
    };
    
    // Clear chat button
    document.getElementById('clear-chat-btn').onclick = function() {
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
    
    // Image upload
    var uploadBtn = document.getElementById('upload-btn');
    var imageInput = document.getElementById('image-input');
    
    uploadBtn.onclick = function() {
      imageInput.click();
    };
    
    imageInput.onchange = function(e) {
      var file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    
    // Remove image
    document.getElementById('remove-image').onclick = function() {
      hideImagePreview();
    };
    
    // Message input
    var input = document.getElementById('message-input');
    var sendBtn = document.getElementById('send-btn');
    
    input.oninput = function() {
      sendBtn.disabled = (!this.value.trim() && !selectedImage) || isLoading;
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    };
    
    input.onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
    
    sendBtn.onclick = function() {
      sendMessage();
    };
    
    // Error close
    document.getElementById('error-close').onclick = function() {
      document.getElementById('error').classList.add('hidden');
    };
    
    console.log('Listeners ready!');
  }
  
  // ===== HANDLE IMAGE UPLOAD =====
  function handleImageUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      selectedImage = e.target.result;
      showImagePreview(selectedImage);
      document.getElementById('send-btn').disabled = false;
    };
    reader.readAsDataURL(file);
  }
  
  function showImagePreview(src) {
    document.getElementById('preview-img').src = src;
    document.getElementById('image-preview').classList.remove('hidden');
  }
  
  function hideImagePreview() {
    selectedImage = null;
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-input').value = '';
    
    var input = document.getElementById('message-input');
    document.getElementById('send-btn').disabled = !input.value.trim();
  }
  
  // ===== REQUEST SIMILAR EXERCISE =====
  function requestSimilarExercise() {
    if (!lastExercise || isLoading) return;
    
    messages = [];
    localStorage.setItem('tamrini_messages', '[]');
    renderMessages();
    
    var request = "Generate a similar math exercise to this one: " + lastExercise + ". Just give me the new exercise.";
    addMessage('bot', translations[currentLang].similarExercise + "! 🎯");
    sendToAPI(request, true);
  }
  
  // ===== RENDER MESSAGES =====
  function renderMessages() {
    var container = document.getElementById('messages');
    var emptyState = document.getElementById('empty-state');
    
    container.innerHTML = '';
    
    if (messages.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      messages.forEach(function(msg) {
        container.appendChild(createMessageEl(msg));
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
    
    var content = '';
    
    // Add image if exists
    if (msg.image) {
      content += '<img class="message-image" src="' + msg.image + '" alt="Exercise">';
    }
    
    // Add text
    var text = msg.content || '';
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    
    if (text) {
      content += '<div class="message-text">' + text + '</div>';
    }
    
    div.innerHTML = '<div class="message-avatar">' + avatar + '</div>' +
      '<div class="message-bubble">' +
      content +
      '<div class="message-time">' + time + '</div>' +
      '</div>';
    
    return div;
  }
  
  // ===== ADD MESSAGE =====
  function addMessage(role, content, image) {
    var time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    var msg = {role: role, content: content, time: time};
    if (image) msg.image = image;
    
    messages.push(msg);
    localStorage.setItem('tamrini_messages', JSON.stringify(messages));
    
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('messages').appendChild(createMessageEl(msg));
    scrollToBottom();
    
    // Save first user message as exercise
    if (role === 'user' && messages.length <= 2) {
      lastExercise = content || 'Image exercise';
      localStorage.setItem('tamrini_last_exercise', lastExercise);
      saveToHistory(content || 'Image exercise', image);
    }
    
    updateSimilarButton();
  }
  
  // ===== SAVE TO HISTORY =====
  function saveToHistory(question, image) {
    var item = {
      id: Date.now(),
      question: question.substring(0, 100),
      image: image || null,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      messagesCount: 1,
      status: 'in-progress',
      subject: detectSubject(question)
    };
    
    history.unshift(item);
    if (history.length > 20) history.pop();
    
    localStorage.setItem('tamrini_history', JSON.stringify(history));
    renderHistory();
  }
  
  // ===== DETECT SUBJECT =====
  function detectSubject(question) {
    var q = question.toLowerCase();
    if (q.includes('x') || q.includes('equation') || q.includes('équation') || q.includes('معادلة')) return 'algebra';
    if (q.includes('triangle') || q.includes('circle') || q.includes('angle') || q.includes('مثلث')) return 'geometry';
    if (q.includes('derivative') || q.includes('integral') || q.includes('dérivée') || q.includes('تكامل')) return 'calculus';
    if (q.includes('probability') || q.includes('mean') || q.includes('probabilité') || q.includes('احتمال')) return 'statistics';
    return 'algebra';
  }
  
  // ===== RENDER HISTORY =====
  function renderHistory() {
    var container = document.getElementById('history-list');
    var emptyState = document.getElementById('history-empty');
    var t = translations[currentLang];
    
    if (history.length === 0) {
      emptyState.classList.remove('hidden');
      container.innerHTML = '';
    } else {
      emptyState.classList.add('hidden');
      
      var html = '';
      history.forEach(function(item) {
        var statusClass = item.status === 'solved' ? 'solved' : 'in-progress';
        var statusText = item.status === 'solved' ? t.solved : t.inProgress;
        var statusIcon = item.status === 'solved' ? '✓' : '⏳';
        
        var subjectIcons = {
          algebra: '🔢',
          geometry: '📐',
          calculus: '📈',
          statistics: '📊'
        };
        var subjectIcon = subjectIcons[item.subject] || '📝';
        
        html += '<div class="history-item" data-id="' + item.id + '">' +
          '<div class="history-header">' +
            '<span class="history-status ' + statusClass + '">' + statusIcon + ' ' + statusText + '</span>' +
            '<span class="history-messages-count">' + (item.messagesCount || 1) + ' ' + t.messages + '</span>' +
          '</div>' +
          '<div class="history-question">' + item.question + '</div>' +
          '<div class="history-meta">' +
            '<span>' + item.date + '</span>' +
            '<span>' + item.time + '</span>' +
          '</div>' +
          '<span class="history-subject">' + subjectIcon + ' ' + (item.subject || 'algebra') + '</span>' +
        '</div>';
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
    var text = input.value.trim();
    
    if ((!text && !selectedImage) || isLoading) return;
    
    // Add user message
    addMessage('user', text, selectedImage);
    
    // Prepare request
    var requestText = text;
    if (selectedImage) {
      requestText = text || translations[currentLang].imageUploaded;
    }
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('send-btn').disabled = true;
    hideImagePreview();
    
    // Call API
    sendToAPI(requestText, false, selectedImage);
  }
  
  // ===== SEND TO API =====
  function sendToAPI(text, isSimilarRequest, image) {
    isLoading = true;
    document.getElementById('typing').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    scrollToBottom();
    
    var chatHistory = messages.slice(-10).map(function(m) {
      return {
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      };
    });
    
    var requestBody = {
      question: text,
      language: currentLang,
      history: chatHistory
    };
    
    // Note: For image support, you'll need to update your API
    // to handle base64 images with Gemini Vision
    if (image && !isSimilarRequest) {
      requestBody.image = image;
    }
    
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.error) {
        throw new Error(data.details || data.error);
      }
      
      addMessage('bot', data.reply);
      
      // Update history item
      updateHistoryStatus();
      
      if (isSimilarRequest && data.reply) {
        lastExercise = data.reply.split('\n')[0];
        localStorage.setItem('tamrini_last_exercise', lastExercise);
      }
    })
    .catch(function(err) {
      console.error('Error:', err);
      var t = translations[currentLang];
      document.getElementById('error-text').textContent = 
        err.message && err.message.includes('quota') ? t.quotaError : t.error;
      document.getElementById('error').classList.remove('hidden');
    })
    .finally(function() {
      isLoading = false;
      document.getElementById('typing').classList.add('hidden');
      var input = document.getElementById('message-input');
      document.getElementById('send-btn').disabled = !input.value.trim();
    });
  }
  
  // ===== UPDATE HISTORY STATUS =====
  function updateHistoryStatus() {
    if (history.length > 0 && messages.length >= 6) {
      history[0].status = 'solved';
      history[0].messagesCount = messages.length;
      localStorage.setItem('tamrini_history', JSON.stringify(history));
      renderHistory();
    }
  }
};
