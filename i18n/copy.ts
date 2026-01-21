import { Language, Tone } from '../types';

export const appCopy = {
  en: {
    header: {
      openSource: 'OPEN SOURCE',
      clearKey: 'CLEAR KEY',
      setApiKey: 'SET API KEY',
      toggleTheme: 'Toggle Dark Mode',
      toggleLanguage: 'Switch to Arabic',
      langShort: 'AR',
    },
    input: {
      title: 'Separate Out.',
      tagline: 'Research-backed narratives for high-impact LinkedIn presences.',
      errorTitle: 'Error Processing Request',
      billingGuide: 'View Billing Setup Guide',
      step1: 'Carousel Slide Count',
      step2: 'Topic & Details',
      topicPlaceholder: 'What is the overarching theme?',
      generate: 'GENERATE CAROUSEL',
    },
    editing: {
      startNew: 'START NEW DRAFT',
      postPreview: 'Post Preview',
      editInputs: 'EDIT INPUTS',
      copyPostText: 'COPY POST TEXT',
      copied: 'COPIED',
    },
    loading: {
      start: 'Analyzing topic & Researching trends...',
    },
    errors: {
      missingTopic: 'Please provide a topic and at least one core insight.',
      apiKey: 'Please check your API key.',
      paidKey: 'This high-quality model requires a paid API key from a billing-enabled GCP project.',
      generic: 'Something went wrong. Please check your topic and try again.',
    },
  },
  ar: {
    header: {
      openSource: 'مفتوح المصدر',
      clearKey: 'حذف المفتاح',
      setApiKey: 'تعيين المفتاح',
      toggleTheme: 'تبديل الوضع الداكن',
      toggleLanguage: 'التبديل إلى الإنجليزية',
      langShort: 'EN',
    },
    input: {
      title: 'تميّز.',
      tagline: 'سرد مدعوم بالأبحاث لحضور قوي على لينكدإن.',
      errorTitle: 'خطأ أثناء المعالجة',
      billingGuide: 'عرض دليل إعداد الفوترة',
      step1: 'عدد شرائح الكاروسيل',
      step2: 'الموضوع والتفاصيل',
      topicPlaceholder: 'ما هو الموضوع الرئيسي؟',
      generate: 'أنشئ الكاروسيل',
    },
    editing: {
      startNew: 'ابدأ مسودة جديدة',
      postPreview: 'معاينة المنشور',
      editInputs: 'تعديل المدخلات',
      copyPostText: 'نسخ نص المنشور',
      copied: 'تم النسخ',
    },
    loading: {
      start: 'تحليل الموضوع وبحث الاتجاهات...',
    },
    errors: {
      missingTopic: 'يرجى إدخال موضوع وواحد على الأقل من الأفكار الأساسية.',
      apiKey: 'يرجى التحقق من مفتاح واجهة البرمجة.',
      paidKey: 'يتطلب هذا النموذج عالي الجودة مفتاحا مدفوعا من مشروع GCP مفعّل للفوترة.',
      generic: 'حدث خطأ ما. يرجى مراجعة الموضوع والمحاولة مجددا.',
    },
  },
} as const;

export const toneOptions: Array<{ value: Tone; label: Record<Language, string> }> = [
  { value: 'Professional', label: { en: 'Professional', ar: 'احترافي' } },
  { value: 'Casual', label: { en: 'Casual', ar: 'غير رسمي' } },
  { value: 'Inspirational', label: { en: 'Inspirational', ar: 'ملهم' } },
  { value: 'Thought Leader', label: { en: 'Thought Leader', ar: 'قيادة فكرية' } },
  { value: 'Controversial', label: { en: 'Controversial', ar: 'جدلي' } },
];

export const introCopy = {
  en: {
    tagline: 'Be separated out on LinkedIn',
    start: 'START CREATING',
    footer: 'GEN AI using Gemini 3 & Google Search',
  },
  ar: {
    tagline: 'تميّز على لينكدإن',
    start: 'ابدأ الإنشاء',
    footer: 'ذكاء اصطناعي باستخدام Gemini 3 وبحث Google',
  },
} as const;

export const apiKeyModalCopy = {
  en: {
    title: 'Enter API Key',
    subtitle: 'Gemini API Access',
    description: 'To use SeparateOut, you need your own Google Gemini API key. Your key is stored locally in your browser and never sent to our servers.',
    label: 'API Key',
    placeholder: 'AIza...',
    submit: 'Start Creating',
    link: 'Get a free API key from Google AI Studio',
    errorEmpty: 'Please enter a valid API key',
  },
  ar: {
    title: 'أدخل مفتاح API',
    subtitle: 'الوصول إلى Gemini API',
    description: 'لاستخدام SeparateOut، تحتاج إلى مفتاح Google Gemini API خاص بك. يتم حفظ المفتاح محليا في المتصفح ولا يتم إرساله إلى خوادمنا.',
    label: 'مفتاح API',
    placeholder: 'AIza...',
    submit: 'ابدأ الإنشاء',
    link: 'احصل على مفتاح مجاني من Google AI Studio',
    errorEmpty: 'يرجى إدخال مفتاح API صالح',
  },
} as const;

export const loadingCopy = {
  en: {
    messages: [
      'Initializing deep research engines...',
      'Querying Google Search for market insights...',
      'Model is thinking: synthesizing logical connections...',
      'Architecting the narrative structure...',
      'Applying specific tone & viral hook patterns...',
      'Polishing for high professional impact...',
      'Defining visual asset prompts for each insight...',
    ],
    labels: {
      research: 'Research',
      reasoning: 'Reasoning',
      synthesis: 'Synthesis',
    },
  },
  ar: {
    messages: [
      'تهيئة محركات البحث العميق...',
      'الاستعلام من بحث Google للحصول على رؤى السوق...',
      'النموذج يفكر: يبني روابط منطقية...',
      'بناء هيكل السرد...',
      'تطبيق نمط النبرة والخطاف الانتشاري...',
      'تنقيح الأثر المهني العالي...',
      'تحديد مطالبات الأصول البصرية لكل فكرة...',
    ],
    labels: {
      research: 'بحث',
      reasoning: 'استدلال',
      synthesis: 'تلخيص',
    },
  },
} as const;

export const searchResultsCopy = {
  en: {
    title: 'Research Grounding',
    externalSource: 'External Source',
  },
  ar: {
    title: 'المصادر المرجعية',
    externalSource: 'مصدر خارجي',
  },
} as const;

export const carouselCopy = {
  en: {
    userName: 'SeparateOut User',
    connection: '• 1st',
    role: 'Content Creator | Thought Leader',
    time: 'Just now',
    captionFallback: 'Check out this carousel...',
    documentTitle: 'Carousel Document',
    downloadAllTitle: 'Download All Slides',
    download: 'Download',
    of: 'of',
    stats: '88 comments • 24 reposts',
    actions: {
      like: 'Like',
      comment: 'Comment',
      repost: 'Repost',
      send: 'Send',
    },
  },
  ar: {
    userName: 'مستخدم SeparateOut',
    connection: '• المستوى الأول',
    role: 'صانع محتوى | قيادة فكرية',
    time: 'الآن',
    captionFallback: 'اطّلع على هذا الكاروسيل...',
    documentTitle: 'مستند الكاروسيل',
    downloadAllTitle: 'تنزيل جميع الشرائح',
    download: 'تنزيل',
    of: 'من',
    stats: '88 تعليق • 24 إعادة نشر',
    actions: {
      like: 'إعجاب',
      comment: 'تعليق',
      repost: 'إعادة نشر',
      send: 'إرسال',
    },
  },
} as const;

export const infographicCopy = {
  en: {
    fullscreen: 'Fullscreen View',
    generating: 'Generating...',
  },
  ar: {
    fullscreen: 'عرض بملء الشاشة',
    generating: 'جارٍ الإنشاء...',
  },
} as const;
