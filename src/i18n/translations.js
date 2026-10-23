// ============================================================================
// translations.js — المكان الوحيد لكل نصوص التطبيق (العربية أساسية + الفرنسية).
// لتعديل أي نص أو إضافة لغة عدّل هذا الملف فقط. المفاتيح تُستعمل هكذا:
//   const { t } = useI18n();   t('dashboard.welcome', { name })
// القيم تدعم {متغيرات}. إن نقص مفتاح في الفرنسية يُعرض النص العربي.
// ============================================================================

export const DEFAULT_LANG = 'ar';

// dir = اتجاه الصفحة، locale = لغة تنسيق التواريخ
export const LANGS = {
  ar: { dir: 'rtl', locale: 'ar-MA' },
  fr: { dir: 'ltr', locale: 'fr-FR' },
};

export const translations = {
  // ==========================================================================
  // العربية (الأساسية)
  // ==========================================================================
  ar: {
    brand: {
      name: 'CROWN DRIVE ACADEMY',
      tagline: 'منصتك لتعلّم السياقة والنجاح في الامتحان',
      version: 'الإصدار',
    },

    lang: { ar: 'العربية', fr: 'Français', label: 'اللغة' },

    common: {
      loading: 'جارٍ التحميل...',
      retry: 'إعادة المحاولة',
      listSeparator: '، ',
      none: '—',
    },

    nav: {
      dashboard: 'لوحتي',
      lessons: 'الدروس',
      exam: 'الاختبار التجريبي',
      logout: 'تسجيل الخروج',
    },

    errors: {
      network: 'تعذر الاتصال بالخادم',
      tooManyAttempts: 'محاولات كثيرة. حاول مجدداً بعد قليل',
      dashboard: 'تعذر جلب بيانات لوحتك',
      lessons: 'تعذر جلب الدروس',
      lesson: 'تعذر جلب الدرس',
      markReviewed: 'تعذر تسجيل المراجعة',
      examStart: 'تعذر بدء الاختبار',
      examSubmit: 'تعذر إرسال نتائج الاختبار',
    },

    auth: {
      heroTitle: 'استعدّ لامتحان رخصة السياقة بثقة',
      heroText: 'دروس منظّمة، واختبارات تجريبية بنفس ظروف الامتحان الحقيقي، وتتبّع دقيق لمستواك.',
      features: {
        exams: 'اختبارات تجريبية بعدّاد وصوت كالامتحان الحقيقي',
        lessons: 'دروس مرتّبة حسب الأصناف',
        stats: 'نسب مفصّلة لمستواك في كل صنف',
      },
      login: {
        title: 'تسجيل الدخول',
        subtitle: 'أدخل رقم الهوية الوطنية وكلمة المرور للمتابعة',
        nationalId: 'رقم الهوية الوطنية',
        nationalIdPlaceholder: 'مثال: 1234567890',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        submit: 'تسجيل الدخول',
        submitting: 'جاري التحقق...',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب جديد',
      },
      register: {
        title: 'إنشاء حساب مترشح',
        subtitle: 'أكمل بياناتك لإنشاء حسابك الجديد',
        noAccountInfo: 'لا يوجد حساب بهذا الرقم. الرجاء إكمال بياناتك للتسجيل',
        nationalId: 'رقم الهوية الوطنية',
        nationalIdPlaceholder: 'مثال: 1234567890',
        fullName: 'الاسم الكامل',
        fullNamePlaceholder: 'الاسم واللقب',
        phone: 'رقم الهاتف',
        phonePlaceholder: 'اختياري',
        license: 'فئة رخصة السياقة',
        licensePlaceholder: 'اختر الفئة',
        password: 'كلمة المرور (اختيارية)',
        passwordPlaceholder: 'اتركها فارغة لتكون رقم البطاقة الوطنية',
        passwordNote: 'إن تركتها فارغة، كلمة المرور ستكون رقم بطاقتك الوطنية.',
        confirm: 'تأكيد كلمة المرور',
        confirmPlaceholder: 'أعد إدخال كلمة المرور',
        submit: 'إنشاء الحساب والدخول',
        submitting: 'جاري إنشاء الحساب...',
        haveAccount: 'لديك حساب بالفعل؟',
        goLogin: 'تسجيل الدخول',
      },
      errors: {
        loginRequired: 'الرجاء إدخال رقم الهوية وكلمة المرور',
        loginFailed: 'حدث خطأ أثناء تسجيل الدخول',
        invalidCredentials: 'رقم الهوية أو كلمة المرور غير صحيحة',
        accountDisabled: 'هذا الحساب معطّل. الرجاء الاتصال بالمدرسة',
        registerRequired: 'الرجاء ملء جميع الحقول المطلوبة',
        passwordShort: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',
        passwordMismatch: 'كلمتا المرور غير متطابقتين',
        accountExists: 'يوجد حساب مسجل بهذا الرقم بالفعل. الرجاء تسجيل الدخول',
        registerFailed: 'حدث خطأ أثناء إنشاء الحساب',
        categoriesFailed: 'تعذر تحميل قائمة فئات الرخصة',
      },
    },

    dashboard: {
      welcome: 'مرحباً {name}',
      subtitle: 'هذه نظرة عامة على مستواك وتقدّمك',
      nextStep: 'الخطوة التالية',
      go: 'انتقل الآن',
      noTests: 'لا توجد اختبارات منتهية بعد',
      kpi: {
        lastScore: 'نتيجة آخر اختبار',
        finished: 'الاختبارات المنتهية',
        attempts: 'محاولات الاختبار التجريبي',
        license: 'صنف الرخصة',
      },
      levelTitle: 'مستواك حسب الصنف',
      levelHint: 'إجابات صحيحة / أسئلة مُجابة',
      infoTitle: 'معلوماتي',
      fullName: 'الاسم الكامل',
      nationalId: 'رقم البطاقة الوطنية',
      license: 'صنف الرخصة',
      registeredAt: 'تاريخ التسجيل',
      recentTitle: 'آخر الاختبارات',
      noRecent: 'لا توجد اختبارات سابقة',
      startExam: 'بدء اختبار جديد',
      // سلسلة عيّنها المدرّب
      assignment: {
        finalTitle: 'عيّن لك المدرّب اختباراً تجريبياً نهائياً: السلسلة {n}',
        finalText: 'اجتزه الآن، وتظهر لك نتيجته وتصحيحه فور الانتهاء.',
        nextTitle: 'عيّن لك المدرّب السلسلة {n} كاختبارك القادم',
        nextText: 'ستكون هذه سلسلة اختبارك القادم.',
        start: 'ابدأ الاختبار الآن',
        resume: 'تابع الاختبار',
      },
    },

    // نص "الخطوة التالية" يُبنى من بيانات الباك-إند (action + الصنف) ليظهر بلغة الواجهة
    nextStep: {
      firstExam: {
        label: 'ابدأ أول اختبار',
        reason: 'اجتز اختباراً لنعرف مستواك في كل صنف ونقترح عليك الدروس المناسبة.',
      },
      lessons: {
        label: 'راجع دروس {category}',
        reason: 'نسبتك في {category} هي {score}% — راجع الدروس قبل الاختبار القادم.',
      },
      exam: {
        label: 'اجتز اختباراً جديداً',
        afterLessons: 'راجعت الدروس المطلوبة — حان وقت اختبار جديد لقياس تقدّمك.',
        allGood: 'مستواك جيد في كل الأصناف — اختبار جديد يؤكد جاهزيتك.',
      },
    },

    status: {
      readiness: {
        green: 'جاهز للامتحان',
        orange: 'قريب من الجاهزية',
        red: 'يحتاج إلى مزيد من التدريب',
      },
      level: { good: 'جيد', medium: 'متوسط', weak: 'ضعيف' },
      testType: { diagnostic: 'تشخيصي', practice: 'تدريبي', final_mock: 'تجريبي نهائي' },
      lesson: { open_priority: 'أولوية', open_normal: 'مفتوح', locked_mastered: 'مكتسب' },
      depth: { normal: 'شرح عادي', deep: 'شرح معمّق' },
    },

    lessons: {
      title: 'الدروس',
      subtitle: 'راجع دروس كل صنف استعداداً للاختبار',
      empty: 'لا توجد دروس في هذا الصنف بعد',
      progress: '{done} / {total} مكتسب',
      back: 'العودة إلى الدروس',
      reviewedCount: 'تمت مراجعة هذا الدرس {count} مرة/مرات',
      markReviewed: 'تمت المراجعة',
      reviewedDone: 'تم تسجيل المراجعة ✓',
      sideTitle: 'تتبّع التقدّم',
    },

    exam: {
      needLogin: 'الرجاء تسجيل الدخول أولاً للمتابعة إلى الاختبار التجريبي',
      preparing: 'جارٍ تحضير الأسئلة...',
      intro: {
        title: 'الاختبار التجريبي',
        text: 'مرحباً {name}، هذا اختبار تجريبي كامل من سلسلة أسئلة (يحدّدها لك مدرّبك أو تُختار عشوائياً). ستظهر لك النتيجة والنسب التفصيلية بعد الإنهاء مباشرة.',
        start: 'ابدأ الاختبار',
        tileQuestions: 'سلسلة أسئلة كاملة',
        tileTime: '{seconds} ثانية لكل سؤال',
        tileResult: 'نتيجة فورية مع الشرح',
      },
      question: {
        position: 'السؤال {current} من {total}',
        series: 'السلسلة {n}',
        answered: 'أجبت على {answered} من {total}',
        imageAlt: 'صورة السؤال',
        listen: '▶ اضغط للاستماع إلى السؤال',
        next: 'السؤال التالي',
        finish: 'إنهاء الاختبار',
        finishing: 'جارٍ التصحيح...',
      },
      answerPanel: {
        title: 'الأسئلة',
        pickOne: 'اختر رقم الإجابة الصحيحة:',
        pickMany: 'اختر أرقام الإجابات الصحيحة:',
        yourAnswer: 'إجابتك:',
        none: 'لم تختر أي جواب',
        pickTitle: 'اختيار الإجابة رقم {n}',
      },
      timer: {
        listen: 'استمع للسؤال',
        danger: 'الوقت ينفد!',
        remaining: 'الوقت المتبقي',
        seconds: 'ثانية',
        minutes: 'دقيقة',
        outOf: 'من أصل {time}',
        startsAfterAudio: 'العداد يبدأ بعد نهاية التسجيل',
      },
    },

    result: {
      title: 'نتيجة الاختبار',
      correctOutOf: '{correct} إجابة صحيحة من أصل {total}',
      byCategory: 'النسب حسب الصنف',
      inThisTest: 'في هذا الاختبار: {correct} / {total}',
      correctionTitle: 'التصحيح',
      legendCorrect: 'صحيح ({n})',
      legendWrong: 'خطأ ({n})',
      hint: 'اضغط على رقم السؤال لرؤية الشرح — الأسئلة الخاطئة يشرحها لك المدرّب بالصوت.',
      restart: 'إعادة الاختبار',
    },

    review: {
      close: 'إغلاق',
      yourAnswer: 'إجابتك',
      noAnswer: 'بدون إجابة',
      correctAnswer: 'الإجابة الصحيحة',
      explanation: 'الشرح',
      reading: 'يُقرأ الآن',
      examples: 'أمثلة:',
      typing: 'جارٍ الكتابة',
      noVoice: 'لا يوجد صوت عربي في هذا المتصفح — أضف ELEVENLABS_API_KEY في السيرفر لقراءة الشرح.',
      audioError: 'تعذر تشغيل الصوت.',
      stop: '⏹ إيقاف',
      replay: '🔁 أعد الاستماع',
      showAll: 'عرض النص كاملاً',
      prev: '→ السابق',
      next: 'التالي ←',
    },
  },

  // ==========================================================================
  // Français
  // ==========================================================================
  fr: {
    brand: {
      name: 'CROWN DRIVE ACADEMY',
      tagline: 'Votre plateforme pour apprendre à conduire et réussir l\'examen',
      version: 'Version',
    },

    lang: { ar: 'العربية', fr: 'Français', label: 'Langue' },

    common: {
      loading: 'Chargement...',
      retry: 'Réessayer',
      listSeparator: ', ',
      none: '—',
    },

    nav: {
      dashboard: 'Mon tableau de bord',
      lessons: 'Leçons',
      exam: 'Examen blanc',
      logout: 'Déconnexion',
    },

    errors: {
      network: 'Impossible de joindre le serveur',
      tooManyAttempts: 'Trop de tentatives. Réessayez dans quelques minutes',
      dashboard: 'Impossible de charger votre tableau de bord',
      lessons: 'Impossible de charger les leçons',
      lesson: 'Impossible de charger la leçon',
      markReviewed: 'Impossible d\'enregistrer la révision',
      examStart: 'Impossible de démarrer l\'examen',
      examSubmit: 'Impossible d\'envoyer les résultats de l\'examen',
    },

    auth: {
      heroTitle: 'Préparez votre permis de conduire en toute confiance',
      heroText: 'Des leçons structurées, des examens blancs dans les conditions réelles et un suivi précis de votre niveau.',
      features: {
        exams: 'Examens blancs avec chrono et audio comme le jour J',
        lessons: 'Leçons classées par catégorie',
        stats: 'Statistiques détaillées de votre niveau par catégorie',
      },
      login: {
        title: 'Connexion',
        subtitle: 'Saisissez votre numéro d\'identité nationale et votre mot de passe pour continuer',
        nationalId: 'Numéro d\'identité nationale',
        nationalIdPlaceholder: 'Ex. : 1234567890',
        password: 'Mot de passe',
        passwordPlaceholder: '••••••••',
        submit: 'Se connecter',
        submitting: 'Vérification...',
        noAccount: 'Pas encore de compte ?',
        createAccount: 'Créer un compte',
      },
      register: {
        title: 'Créer un compte candidat',
        subtitle: 'Complétez vos informations pour créer votre compte',
        noAccountInfo: 'Aucun compte pour ce numéro. Veuillez compléter vos informations pour vous inscrire.',
        nationalId: 'Numéro d\'identité nationale',
        nationalIdPlaceholder: 'Ex. : 1234567890',
        fullName: 'Nom complet',
        fullNamePlaceholder: 'Nom et prénom',
        phone: 'Téléphone',
        phonePlaceholder: 'Facultatif',
        license: 'Catégorie de permis',
        licensePlaceholder: 'Choisir la catégorie',
        password: 'Mot de passe (facultatif)',
        passwordPlaceholder: 'Laissez vide pour utiliser votre numéro d\'identité',
        passwordNote: 'Si vous la laissez vide, votre mot de passe sera votre numéro d\'identité nationale.',
        confirm: 'Confirmer le mot de passe',
        confirmPlaceholder: 'Saisissez à nouveau le mot de passe',
        submit: 'Créer le compte et se connecter',
        submitting: 'Création du compte...',
        haveAccount: 'Vous avez déjà un compte ?',
        goLogin: 'Se connecter',
      },
      errors: {
        loginRequired: 'Veuillez saisir votre numéro d\'identité et votre mot de passe',
        loginFailed: 'Une erreur est survenue lors de la connexion',
        invalidCredentials: 'Identifiant ou mot de passe incorrect',
        accountDisabled: 'Ce compte est désactivé. Veuillez contacter l\'auto-école',
        registerRequired: 'Veuillez remplir tous les champs obligatoires',
        passwordShort: 'Le mot de passe doit contenir au moins 6 caractères',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        accountExists: 'Un compte existe déjà pour ce numéro. Veuillez vous connecter',
        registerFailed: 'Une erreur est survenue lors de la création du compte',
        categoriesFailed: 'Impossible de charger la liste des catégories de permis',
      },
    },

    dashboard: {
      welcome: 'Bonjour {name}',
      subtitle: 'Voici un aperçu de votre niveau et de votre progression',
      nextStep: 'Prochaine étape',
      go: 'Y aller',
      noTests: 'Aucun examen terminé pour le moment',
      kpi: {
        lastScore: 'Dernier résultat',
        finished: 'Examens terminés',
        attempts: 'Tentatives d\'examen blanc',
        license: 'Catégorie de permis',
      },
      levelTitle: 'Votre niveau par catégorie',
      levelHint: 'Bonnes réponses / questions répondues',
      infoTitle: 'Mes informations',
      fullName: 'Nom complet',
      nationalId: 'N° de carte nationale',
      license: 'Catégorie de permis',
      registeredAt: 'Date d\'inscription',
      recentTitle: 'Derniers examens',
      noRecent: 'Aucun examen précédent',
      startExam: 'Nouvel examen',
      assignment: {
        finalTitle: 'Votre moniteur vous a assigné un examen blanc final : série {n}',
        finalText: 'Passez-le maintenant, vous verrez le résultat et la correction dès la fin.',
        nextTitle: 'Votre moniteur vous a assigné la série {n} comme prochain examen',
        nextText: 'Ce sera la série de votre prochain examen.',
        start: 'Commencer l\'examen maintenant',
        resume: 'Reprendre l\'examen',
      },
    },

    nextStep: {
      firstExam: {
        label: 'Passez votre premier examen',
        reason: 'Passez un examen pour que nous connaissions votre niveau dans chaque catégorie et vous proposions les leçons adaptées.',
      },
      lessons: {
        label: 'Révisez les leçons : {category}',
        reason: 'Votre score en {category} est de {score} % — révisez les leçons avant le prochain examen.',
      },
      exam: {
        label: 'Passez un nouvel examen',
        afterLessons: 'Vous avez révisé les leçons requises — il est temps de passer un nouvel examen pour mesurer vos progrès.',
        allGood: 'Votre niveau est bon dans toutes les catégories — un nouvel examen confirmera votre préparation.',
      },
    },

    status: {
      readiness: {
        green: 'Prêt pour l\'examen',
        orange: 'Presque prêt',
        red: 'Besoin de plus d\'entraînement',
      },
      level: { good: 'Bon', medium: 'Moyen', weak: 'Faible' },
      testType: { diagnostic: 'Diagnostic', practice: 'Entraînement', final_mock: 'Examen blanc final' },
      lesson: { open_priority: 'Prioritaire', open_normal: 'Ouverte', locked_mastered: 'Acquise' },
      depth: { normal: 'Explication simple', deep: 'Explication approfondie' },
    },

    lessons: {
      title: 'Leçons',
      subtitle: 'Révisez les leçons de chaque catégorie avant l\'examen',
      empty: 'Aucune leçon dans cette catégorie pour le moment',
      progress: '{done} / {total} acquises',
      back: 'Retour aux leçons',
      reviewedCount: 'Cette leçon a été révisée {count} fois',
      markReviewed: 'Marquer comme révisée',
      reviewedDone: 'Révision enregistrée ✓',
      sideTitle: 'Suivi de progression',
    },

    exam: {
      needLogin: 'Veuillez d\'abord vous connecter pour accéder à l\'examen blanc',
      preparing: 'Préparation des questions...',
      intro: {
        title: 'Examen blanc',
        text: 'Bonjour {name}, voici un examen blanc complet composé d\'une série de questions (choisie par votre moniteur ou tirée au hasard). Votre résultat et vos pourcentages détaillés s\'afficheront dès la fin.',
        start: 'Commencer l\'examen',
        tileQuestions: 'Une série complète de questions',
        tileTime: '{seconds} secondes par question',
        tileResult: 'Résultat immédiat avec explications',
      },
      question: {
        position: 'Question {current} sur {total}',
        series: 'Série {n}',
        answered: '{answered} réponse(s) sur {total}',
        imageAlt: 'Image de la question',
        listen: '▶ Cliquez pour écouter la question',
        next: 'Question suivante',
        finish: 'Terminer l\'examen',
        finishing: 'Correction en cours...',
      },
      answerPanel: {
        title: 'Réponses',
        pickOne: 'Choisissez le numéro de la bonne réponse :',
        pickMany: 'Choisissez les numéros des bonnes réponses :',
        yourAnswer: 'Votre réponse :',
        none: 'Aucune réponse choisie',
        pickTitle: 'Choisir la réponse n° {n}',
      },
      timer: {
        listen: 'Écoutez la question',
        danger: 'Le temps s\'écoule !',
        remaining: 'Temps restant',
        seconds: 'sec',
        minutes: 'min',
        outOf: 'sur {time}',
        startsAfterAudio: 'Le chrono démarre à la fin de l\'enregistrement',
      },
    },

    result: {
      title: 'Résultat de l\'examen',
      correctOutOf: '{correct} bonnes réponses sur {total}',
      byCategory: 'Résultats par catégorie',
      inThisTest: 'Dans cet examen : {correct} / {total}',
      correctionTitle: 'Correction',
      legendCorrect: 'Correct ({n})',
      legendWrong: 'Faux ({n})',
      hint: 'Cliquez sur le numéro d\'une question pour voir l\'explication — les réponses fausses sont expliquées à voix haute par le moniteur.',
      restart: 'Refaire l\'examen',
    },

    review: {
      close: 'Fermer',
      yourAnswer: 'Votre réponse',
      noAnswer: 'Sans réponse',
      correctAnswer: 'Bonne réponse',
      explanation: 'Explication',
      reading: 'Lecture en cours',
      examples: 'Exemples :',
      typing: 'Écriture en cours',
      noVoice: 'Aucune voix arabe disponible dans ce navigateur — ajoutez ELEVENLABS_API_KEY sur le serveur pour lire l\'explication.',
      audioError: 'Impossible de lire l\'audio.',
      stop: '⏹ Arrêter',
      replay: '🔁 Réécouter',
      showAll: 'Afficher le texte complet',
      prev: '← Précédent',
      next: 'Suivant →',
    },

    // أسماء الأصناف تصل من قاعدة البيانات بالعربية — هذه ترجمتها (المفتاح = الاسم العربي).
    // أي صنف جديد غير مذكور هنا يظهر باسمه العربي كما هو.
    names: {
      // أصناف الدروس
      'علامات التشوير': 'Signalisation',
      'قواعد السير': 'Règles de circulation',
      'السرعة ومسافات الأمان': 'Vitesse et distances de sécurité',
      'المخالفات والسلوك': 'Infractions et comportement',
      'السياقة في الظروف الصعبة': 'Conduite en conditions difficiles',
      // فئات الرخصة
      'دراجة نارية': 'Moto',
      'سيارة سياحية': 'Voiture de tourisme',
      'شاحنة': 'Camion',
      'حافلة': 'Autobus',
      'مقطورة': 'Remorque',
    },
  },
};
