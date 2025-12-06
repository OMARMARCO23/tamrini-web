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
      inProgress: 
