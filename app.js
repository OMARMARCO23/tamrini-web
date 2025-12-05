console.log('Tamrini Starting...');

window.onload = function() {
  console.log('Page Loaded!');
  
  // ===== STATE =====
  var currentLang = localStorage.getItem('tamrini_lang') || 'en';
  var messages = [];
  var history = [];
  var isLoading = false;
  
  var API_URL = 'https://tamarini-app.vercel.app/api/chat';
  
  // ===== TRANSLATIONS =====
  var translations = {
    en: {
      tagline: "Math Tutor",
      newExercise: "New Exercise",
      emptyTitle: "Ready to Learn?",
      emptyDesc: "Click \"New Exercise\" or type your math question below",
      placeholder: "Type your math question...",
      thinking: "Thinking...",
      error: "Something went wrong. Please try again.",
      quotaError: "Too many requests. Please wait a moment.",
      greeting: "Hello! 👋 I'm Tamrini, your math tutor.\n\nTell me what exercise you're working on, and I'll help you solve it step by step.",
      newGreeting: "Great! Let's start a new exercise. 📝\n\nWhat math problem would you like to work on?"
    },
    fr: {
      tagline: "Tuteur de Maths",
      newExercise: "Nouvel Exercice",
      emptyTitle: "Prêt à Apprendre?",
      emptyDesc: "Clique sur \"Nouvel Exercice\" ou tape ta question",
      placeholder: "Écris ta question de maths...",
      thinking: "Je réfléchis...",
      error: "Une erreur s'est produite. Réessaie.",
      quotaError: "Trop de demandes. Attends un moment.",
      greeting: "Bonjour! 👋 Je suis Tamrini, ton tuteur de maths.\n\nDis-moi sur quel exercice tu travailles.",
      newGreeting: "Super! Commençons un nouvel exercice. 📝\n\nQuel problème veux-tu résoudre?"
    },
    ar: {
      tagline: "معلم الرياضيات",
      newExercise: "تمرين جديد",
      emptyTitle: "مستعد للتعلم؟",
      emptyDesc: "انقر على \"تمرين جديد\" أو اكتب سؤالك",
      placeholder: "اكتب سؤالك في الرياضيات...",
      thinking: "أفكر...",
      error: "حدث خطأ. حاول مرة أخرى.",
      quotaError: "طلبات كثيرة. انتظر قليلاً.",
      greeting: "مرحباً! 👋 أنا تمريني، معلمك في الرياضيات.\n\nأخبرني ما هو التمرين الذي تعمل عليه.",
      newGreeting: "ممتاز! لنبدأ تمريناً جديداً. 📝\n\nما هي المسألة التي تريد حلها؟"
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
  } catch(e) {
    console.log('Error loading data:', e);
  }
  
  // ===== INITIALIZE =====
  updateLanguage(currentLang);
  renderMessages();
  renderHistory();
  setupListeners();
  
  console.log('Tamrini Ready!');
  
  // ===== UPDATE LANGUAGE =====
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tamrini_lang', lang);
    
    var t = translations[lang];
    
    // Update texts
    var tagline = document.getElementById('tagline');
    if (tagline) tagline.textContent = t.tagline;
    
    var newExText = document.getElementById('new-exercise-text');
    if (newExText) newExText.textContent = t.newExercise;
    
    var emptyTitle = document.getElementById('empty-title');
    if (emptyTitle) emptyTitle.textContent = t.emptyTitle;
    
    var emptyDesc = document.getElementById('empty-desc');
    if (emptyDesc) emptyDesc.textContent = t.emptyDesc;
    
    var input = document.getElementById('message-input');
    if (input) input.placeholder = t.placeholder;
    
    var typingText = document.getElementById('typing-text');
    if (typingText) typingText.textContent = t.thinking;
    
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
        localStorage.setItem('tamrini_messages', '[]');
        renderMessages();
        addMessage('bot', translations[currentLang].newGreeting);
        
        var input = document.getElementById('message-input');
        if (input) input.focus();
      };
    }
    
    // Clear chat button
    var clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
      clearBtn.onclick = function() {
        if (confirm('Clear all chat history?')) {
          messages = [];
          history = [];
          localStorage.setItem('tamrini_messages', '[]');
          localStorage.setItem('tamrini_history', '[]');
          renderMessages();
          renderHistory();
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
    text = text.replace(/\n/g, '<br>');
    
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
    
    // Save to history
    if (role === 'user' && messages.length <= 2) {
      saveToHistory(content);
    }
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
    
    // Call API
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        question: text,
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
    });
  }
};
