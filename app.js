console.log('Tamrini Starting...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Ready!');
  
  // ===== STATE =====
  var currentLang = localStorage.getItem('tamrini_lang') || 'en';
  var darkMode = localStorage.getItem('tamrini_dark') === 'true';
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
      emptyDesc: "Click \"New Exercise\" or type your math question below",
      placeholder: "Type your math question...",
      thinking: "Thinking...",
      error: "Something went wrong. Please try again.",
      quotaError: "Too many requests. Please wait a moment.",
      navHome: "Home",
      navHistory: "History",
      navSettings: "Settings",
      navAbout: "About",
      themeSection: "Appearance",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      langSection: "Language",
      clearSection: "Data",
      clearChat: "Clear Chat History",
      greeting: "Hello! 👋 I'm Tamrini, your math tutor.\n\nType your question or upload an image!",
      newGreeting: "Let's start! 📝\n\nWhat math problem do you want to solve?",
      solved: "Solved",
      inProgress: "In Progress",
      msgs: "msgs"
    },
    fr: {
      tagline: "Tuteur de Maths",
      newExercise: "Nouvel Exercice",
      similarExercise: "Exercice Similaire",
      emptyTitle: "Prêt à Apprendre?",
      emptyDesc: "Clique sur \"Nouvel Exercice\" ou tape ta question",
      placeholder: "Écris ta question de maths...",
      thinking: "Je réfléchis...",
      error: "Erreur. Réessaie.",
      quotaError: "Trop de demandes. Attends.",
      navHome: "Accueil",
      navHistory: "Historique",
      navSettings: "Paramètres",
      navAbout: "À propos",
      themeSection: "Apparence",
      lightMode: "Mode Clair",
      darkMode: "Mode Sombre",
      langSection: "Langue",
      clearSection: "Données",
      clearChat: "Effacer l'historique",
      greeting: "Bonjour! 👋 Je suis Tamrini.\n\nÉcris ta question ou télécharge une image!",
      newGreeting: "C'est parti! 📝\n\nQuel problème veux-tu résoudre?",
      solved: "Résolu",
      inProgress: "En cours",
      msgs: "msgs"
    },
    ar: {
      tagline: "معلم الرياضيات",
      newExercise: "تمرين جديد",
      similarExercise: "تمرين مشابه",
      emptyTitle: "مستعد للتعلم؟",
      emptyDesc: "انقر على تمرين جديد أو اكتب سؤالك",
      placeholder: "اكتب سؤالك...",
      thinking: "أفكر...",
      error: "حدث خطأ. حاول مرة أخرى.",
      quotaError: "طلبات كثيرة. انتظر.",
      navHome: "الرئيسية",
      navHistory: "السجل",
      navSettings: "الإعدادات",
      navAbout: "حول",
      themeSection: "المظهر",
      lightMode: "فاتح",
      darkMode: "داكن",
      langSection: "اللغة",
      clearSection: "البيانات",
      clearChat: "مسح المحادثات",
      greeting: "مرحباً! 👋 أنا تمريني.\n\nاكتب سؤالك أو ارفع صورة!",
      newGreeting: "هيا نبدأ! 📝\n\nما المسألة؟",
      solved: "محلول",
      inProgress: "جاري",
      msgs: "رسائل"
    }
  };
  
  // ===== LOAD SAVED DATA =====
  try {
    var s1 = localStorage.getItem('tamrini_messages');
    if (s1) messages = JSON.parse(s1);
    var s2 = localStorage.getItem('tamrini_history');
    if (s2) history = JSON.parse(s2);
    var s3 = localStorage.getItem('tamrini_exercise');
    if (s3) lastExercise = s3;
  } catch(e) {
    console.log('Load error:', e);
  }
  
  // ===== INIT =====
  applyTheme(darkMode);
  applyLanguage(currentLang);
  renderMessages();
  renderHistory();
  showHideSimilarBtn();
  bindEvents();
  
  console.log('Tamrini Ready!');
  
  // ===== APPLY THEME =====
  function applyTheme(isDark) {
    darkMode = isDark;
    localStorage.setItem('tamrini_dark', isDark ? 'true' : 'false');
    
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    var icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    
    var checkLight = document.getElementById('check-light');
    var checkDark = document.getElementById('check-dark');
    if (checkLight) checkLight.classList.toggle('active', !isDark);
    if (checkDark) checkDark.classList.toggle('active', isDark);
  }
  
  // ===== APPLY LANGUAGE =====
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tamrini_lang', lang);
    var t = translations[lang];
    
    // Update text elements
    setText('tagline', t.tagline);
    setText('new-exercise-text', t.newExercise);
    setText('similar-exercise-text', t.similarExercise);
    setText('empty-title', t.emptyTitle);
    setText('empty-desc', t.emptyDesc);
    setText('typing-text', t.thinking);
    setText('nav-home', t.navHome);
    setText('nav-history', t.navHistory);
    setText('nav-settings', t.navSettings);
    setText('nav-about', t.navAbout);
    setText('theme-section-title', t.themeSection);
    setText('light-mode-text', t.lightMode);
    setText('dark-mode-text', t.darkMode);
    setText('lang-section-title', t.langSection);
    setText('clear-section-title', t.clearSection);
    setText('clear-chat-text', t.clearChat);
    
    var input = document.getElementById('message-input');
    if (input) input.placeholder = t.placeholder;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update language checkmarks in settings
    document.querySelectorAll('.option-check[data-check]').forEach(function(c) {
      c.classList.toggle('active', c.getAttribute('data-check') === lang);
    });
    
    // RTL
    document.body.classList.toggle('rtl', lang === 'ar');
    
    renderHistory();
  }
  
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  
  // ===== SHOW/HIDE SIMILAR BUTTON =====
  function showHideSimilarBtn() {
    var btn = document.getElementById('similar-exercise-btn');
    if (btn) {
      if (lastExercise && messages.length >= 4) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    }
  }
  
  // ===== BIND EVENTS =====
  function bindEvents() {
    console.log('Binding events...');
    
    // Theme toggle button
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        console.log('Theme toggle clicked');
        applyTheme(!darkMode);
      });
    }
    
    // Theme buttons in settings
    var themeLightBtn = document.getElementById('theme-light-btn');
    if (themeLightBtn) {
      themeLightBtn.addEventListener('click', function() {
        console.log('Light mode clicked');
        applyTheme(false);
      });
    }
    
    var themeDarkBtn = document.getElementById('theme-dark-btn');
    if (themeDarkBtn) {
      themeDarkBtn.addEventListener('click', function() {
        console.log('Dark mode clicked');
        applyTheme(true);
      });
    }
    
    // Language buttons in header
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var lang = this.getAttribute('data-lang');
        console.log('Language clicked:', lang);
        applyLanguage(lang);
      });
    });
    
    // Language options in settings
    document.querySelectorAll('.setting-option[data-lang]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var lang = this.getAttribute('data-lang');
        console.log('Settings language clicked:', lang);
        applyLanguage(lang);
      });
    });
    
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var page = this.getAttribute('data-page');
        console.log('Nav clicked:', page);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(function(p) {
          p.classList.remove('active');
        });
        
        // Remove active from all nav items
        document.querySelectorAll('.nav-item').forEach(function(n) {
          n.classList.remove('active');
        });
        
        // Show selected page
        var targetPage = document.getElementById('page-' + page);
        if (targetPage) {
          targetPage.classList.add('active');
        }
        
        // Activate nav item
        this.classList.add('active');
      });
    });
    
    // New Exercise button
    var newExBtn = document.getElementById('new-exercise-btn');
    if (newExBtn) {
      newExBtn.addEventListener('click', function() {
        console.log('New Exercise clicked');
        messages = [];
        lastExercise = '';
        selectedImage = null;
        localStorage.setItem('tamrini_messages', '[]');
        localStorage.setItem('tamrini_exercise', '');
        hideImagePreview();
        renderMessages();
        showHideSimilarBtn();
        addMessage('bot', translations[currentLang].newGreeting);
        document.getElementById('message-input').focus();
      });
    }
    
    // Similar Exercise button
    var similarBtn = document.getElementById('similar-exercise-btn');
    if (similarBtn) {
      similarBtn.addEventListener('click', function() {
        console.log('Similar Exercise clicked');
        if (!lastExercise || isLoading) return;
        messages = [];
        localStorage.setItem('tamrini_messages', '[]');
        renderMessages();
        addMessage('bot', '🎯 ' + translations[currentLang].similarExercise + '...');
        callAPI("Generate a similar exercise to: " + lastExercise, true);
      });
    }
    
    // Clear Chat button
    var clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        console.log('Clear chat clicked');
        if (confirm('Clear all history?')) {
          messages = [];
          history = [];
          lastExercise = '';
          localStorage.setItem('tamrini_messages', '[]');
          localStorage.setItem('tamrini_history', '[]');
          localStorage.setItem('tamrini_exercise', '');
          renderMessages();
          renderHistory();
          showHideSimilarBtn();
        }
      });
    }
    
    // Upload button
    var uploadBtn = document.getElementById('upload-btn');
    var imageInput = document.getElementById('image-input');
    if (uploadBtn && imageInput) {
      uploadBtn.addEventListener('click', function() {
        console.log('Upload clicked');
        imageInput.click();
      });
      
      imageInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
          console.log('Image selected:', file.name);
          var reader = new FileReader();
          reader.onload = function(ev) {
            selectedImage = ev.target.result;
            showImagePreview(selectedImage);
            document.getElementById('send-btn').disabled = false;
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Remove image button
    var removeImgBtn = document.getElementById('remove-image');
    if (removeImgBtn) {
      removeImgBtn.addEventListener('click', function() {
        console.log('Remove image clicked');
        hideImagePreview();
      });
    }
    
    // Message input
    var msgInput = document.getElementById('message-input');
    var sendBtn = document.getElementById('send-btn');
    
    if (msgInput) {
      msgInput.addEventListener('input', function() {
        var hasText = this.value.trim().length > 0;
        var hasImage = selectedImage !== null;
        sendBtn.disabled = (!hasText && !hasImage) || isLoading;
        
        // Auto resize
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
      });
      
      msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
    
    // Send button
    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        console.log('Send clicked');
        sendMessage();
      });
    }
    
    // Error close
    var errorClose = document.getElementById('error-close');
    if (errorClose) {
      errorClose.addEventListener('click', function() {
        document.getElementById('error').classList.add('hidden');
      });
    }
    
    console.log('Events bound!');
  }
  
  // ===== IMAGE PREVIEW =====
  function showImagePreview(src) {
    var preview = document.getElementById('image-preview');
    var img = document.getElementById('preview-img');
    if (preview && img) {
      img.src = src;
      preview.classList.remove('hidden');
    }
  }
  
  function hideImagePreview() {
    selectedImage = null;
    var preview = document.getElementById('image-preview');
    var input = document.getElementById('image-input');
    if (preview) preview.classList.add('hidden');
    if (input) input.value = '';
    
    var msgInput = document.getElementById('message-input');
    var sendBtn = document.getElementById('send-btn');
    if (sendBtn && msgInput) {
      sendBtn.disabled = !msgInput.value.trim();
    }
  }
  
  // ===== RENDER MESSAGES =====
  function renderMessages() {
    var container = document.getElementById('messages');
    var empty = document.getElementById('empty-state');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (messages.length === 0) {
      if (empty) empty.classList.remove('hidden');
    } else {
      if (empty) empty.classList.add('hidden');
      messages.forEach(function(msg) {
        container.appendChild(createMessageElement(msg));
      });
      scrollToBottom();
    }
  }
  
  function createMessageElement(msg) {
    var div = document.createElement('div');
    div.className = 'message ' + (msg.role === 'user' ? 'user' : 'bot');
    
    var avatar = msg.role === 'user' ? '👤' : '📐';
    var content = '';
    
    if (msg.image) {
      content += '<img class="message-image" src="' + msg.image + '">';
    }
    
    var text = (msg.content || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    
    content += '<div class="message-text">' + text + '</div>';
    content += '<div class="message-time">' + (msg.time || '') + '</div>';
    
    div.innerHTML = '<div class="message-avatar">' + avatar + '</div>' +
                    '<div class="message-bubble">' + content + '</div>';
    
    return div;
  }
  
  // ===== ADD MESSAGE =====
  function addMessage(role, content, image) {
    var time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    var msg = {role: role, content: content, time: time};
    if (image) msg.image = image;
    
    messages.push(msg);
    localStorage.setItem('tamrini_messages', JSON.stringify(messages));
    
    var empty = document.getElementById('empty-state');
    if (empty) empty.classList.add('hidden');
    
    var container = document.getElementById('messages');
    if (container) {
      container.appendChild(createMessageElement(msg));
      scrollToBottom();
    }
    
    // Save to history
    if (role === 'user' && messages.length <= 2) {
      lastExercise = content || 'Image exercise';
      localStorage.setItem('tamrini_exercise', lastExercise);
      saveToHistory(content || 'Image exercise', image);
    }
    
    showHideSimilarBtn();
  }
  
  function scrollToBottom() {
    var container = document.getElementById('chat-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
  
  // ===== HISTORY =====
  function saveToHistory(question, image) {
    var item = {
      id: Date.now(),
      question: question.substring(0, 80),
      image: image || null,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      count: 1,
      status: 'progress',
      subject: getSubject(question)
    };
    
    history.unshift(item);
    if (history.length > 20) history.pop();
    localStorage.setItem('tamrini_history', JSON.stringify(history));
    renderHistory();
  }
  
  function getSubject(q) {
    q = q.toLowerCase();
    if (q.includes('triangle') || q.includes('angle') || q.includes('circle')) return '📐 Geometry';
    if (q.includes('deriv') || q.includes('integral')) return '📈 Calculus';
    if (q.includes('probab') || q.includes('mean')) return '📊 Statistics';
    return '🔢 Algebra';
  }
  
  function renderHistory() {
    var container = document.getElementById('history-list');
    var empty = document.getElementById('history-empty');
    var t = translations[currentLang];
    
    if (!container) return;
    
    if (history.length === 0) {
      if (empty) empty.classList.remove('hidden');
      container.innerHTML = '';
    } else {
      if (empty) empty.classList.add('hidden');
      
      var html = '';
      history.forEach(function(item) {
        var statusClass = item.status === 'solved' ? 'solved' : 'in-progress';
        var statusText = item.status === 'solved' ? t.solved : t.inProgress;
        var statusIcon = item.status === 'solved' ? '✓' : '⏳';
        
        html += '<div class="history-item">' +
          '<div class="history-header">' +
            '<span class="history-status ' + statusClass + '">' + statusIcon + ' ' + statusText + '</span>' +
            '<span class="history-count">' + (item.count || 1) + ' ' + t.msgs + '</span>' +
          '</div>' +
          '<div class="history-question">' + item.question + '</div>' +
          '<div class="history-meta"><span>' + item.date + '</span><span>' + item.time + '</span></div>' +
          '<span class="history-subject">' + (item.subject || '🔢 Algebra') + '</span>' +
        '</div>';
      });
      
      container.innerHTML = html;
    }
  }
  
  function updateHistoryStatus() {
    if (history.length > 0 && messages.length >= 6) {
      history[0].status = 'solved';
      history[0].count = messages.length;
      localStorage.setItem('tamrini_history', JSON.stringify(history));
      renderHistory();
    }
  }
  
  // ===== SEND MESSAGE =====
  function sendMessage() {
    var input = document.getElementById('message-input');
    var text = input.value.trim();
    
    if ((!text && !selectedImage) || isLoading) return;
    
    addMessage('user', text, selectedImage);
    
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('send-btn').disabled = true;
    
    var imageToSend = selectedImage;
    hideImagePreview();
    
    callAPI(text || 'Please help me with this exercise image', false, imageToSend);
  }
  
  // ===== CALL API =====
  function callAPI(text, isSimilar, image) {
    isLoading = true;
    
    var typing = document.getElementById('typing');
    if (typing) typing.classList.remove('hidden');
    
    var error = document.getElementById('error');
    if (error) error.classList.add('hidden');
    
    scrollToBottom();
    
    var chatHistory = messages.slice(-10).map(function(m) {
      return {
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      };
    });
    
    var body = {
      question: text,
      language: currentLang,
      history: chatHistory
    };
    
    if (image) body.image = image;
    
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('API Response:', data);
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }
      
      addMessage('bot', data.reply);
      updateHistoryStatus();
      
      if (isSimilar && data.reply) {
        lastExercise = data.reply.split('\n')[0];
        localStorage.setItem('tamrini_exercise', lastExercise);
      }
    })
    .catch(function(err) {
      console.error('API Error:', err);
      var t = translations[currentLang];
      var errorText = document.getElementById('error-text');
      if (errorText) {
        errorText.textContent = err.message.includes('quota') ? t.quotaError : t.error;
      }
      var errorEl = document.getElementById('error');
      if (errorEl) errorEl.classList.remove('hidden');
    })
    .finally(function() {
      isLoading = false;
      var typing = document.getElementById('typing');
      if (typing) typing.classList.add('hidden');
      
      var input = document.getElementById('message-input');
      var sendBtn = document.getElementById('send-btn');
      if (input && sendBtn) {
        sendBtn.disabled = !input.value.trim() && !selectedImage;
      }
    });
  }
});
