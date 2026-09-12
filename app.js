// =========================================================
// SPENCHECK MARKETING SITE — AngularJS App
// Module: spencheckApp
// Routing: ngRoute with 6 pages (home, features, guide, pricing, faq, download)
// =========================================================

angular.module('spencheckApp', ['ngRoute'])

// ── Route Configuration ──────────────────────────────────
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController',
      title: 'Spencheck — Track Your Spending, Smarter'
    })
    .when('/features', {
      templateUrl: 'views/features.html',
      controller: 'FeaturesController',
      title: 'Features — Spencheck'
    })
    .when('/pricing', {
      templateUrl: 'views/pricing.html',
      controller: 'PricingController',
      title: 'Pricing — Spencheck'
    })
    .when('/faq', {
      templateUrl: 'views/faq.html',
      controller: 'FaqController',
      title: 'FAQ — Spencheck'
    })
    .when('/download', {
      templateUrl: 'views/download.html',
      controller: 'DownloadController',
      title: 'Download — Spencheck'
    })
    .when('/guide', {
      templateUrl: 'views/guide.html',
      controller: 'GuideController',
      title: 'App Guide — Spencheck'
    })
    .otherwise({ redirectTo: '/' });
}])

// ── Run: page title updates on route change ──────────────
.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(e, current) {
    if (current && current.$$route && current.$$route.title) {
      document.title = current.$$route.title;
    }
    // Scroll to top on nav
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}])

// ── NavController ────────────────────────────────────────
.controller('NavController', ['$scope', '$location', function($scope, $location) {
  $scope.menuOpen = false;

  $scope.isActive = function(path) {
    return $location.path() === path;
  };

  // Close mobile menu on route change
  $scope.$on('$routeChangeSuccess', function() {
    $scope.menuOpen = false;
  });
}])

// ── HomeController ───────────────────────────────────────
.controller('HomeController', ['$scope', function($scope) {
  $scope.features = [
    {
      icon: '💸',
      title: 'Expense Tracking',
      desc: 'Log every rupee in seconds. Add amounts, pick a category, attach a receipt photo, and let Spencheck auto-categorise common merchants like Swiggy, Ola, or your local shop.',
      link: '#!/features'
    },
    {
      icon: '🎯',
      title: 'Smart Budgets',
      desc: 'Set a monthly spend limit and per-category budgets. A large progress ring turns from green to amber to red as you approach your limit — you\'ll never be caught off guard.',
      link: '#!/features'
    },
    {
      icon: '📊',
      title: 'Reports & Insights',
      desc: 'Weekly, monthly, and yearly summaries with pie charts, bar charts, and spend projections. One tap exports your data as a PDF or CSV.',
      link: '#!/features'
    },
    {
      icon: '🤝',
      title: 'Lending Tracker',
      desc: 'Track who owes you and what you owe others. Send a WhatsApp reminder with a UPI payment link in one tap. Split bills right from the app.',
      link: '#!/features'
    },
    {
      icon: '💳',
      title: 'Credit Card Manager',
      desc: 'Add all your cards. See outstanding balances, credit utilisation, and upcoming due dates at a glance — styled as real bank-card visuals.',
      link: '#!/features'
    },
    {
      icon: '🤖',
      title: 'AI Chat Assistant',
      desc: 'Ask "How much did I spend on food this week?" or "Add ₹450 for groceries" — Spencheck understands you. Works offline with rule-based commands or with your own Gemini/ChatGPT key.',
      link: '#!/features'
    }
  ];

  $scope.highlights = [
    { icon: '🔒', label: '100% Private', sub: 'All data stays on your device by default' },
    { icon: '📱', label: 'SMS Auto-Detect', sub: 'Android reads bank alerts automatically' },
    { icon: '☁️', label: 'Optional Backup', sub: 'Sync to cloud when you want to' },
    { icon: '🆓', label: 'Free to Use', sub: 'No subscription required, ever' }
  ];

  $scope.steps = [
    { num: '1', title: 'Download the app', desc: 'Install Spencheck free on Android — no account needed.' },
    { num: '2', title: 'Add your expenses', desc: 'Log manually or let SMS auto-detection do it for you.' },
    { num: '3', title: 'Set your budget', desc: 'Define monthly limits and savings goals.' },
    { num: '4', title: 'Watch your money grow', desc: 'Check insights, cut waste, hit your goals.' }
  ];

  $scope.trustPoints = [
    { icon: '🔒', label: 'Offline-first', desc: 'No account needed. The app works fully offline — your data never leaves your phone unless you opt into cloud backup.' },
    { icon: '🚫', label: 'No ads, no tracking', desc: 'Spencheck has no advertising, no user profiling, and no data sold to third parties. Period.' },
    { icon: '🗑️', label: 'Delete everything', desc: 'One tap deletes your local data, your cloud backup, and your account permanently.' },
    { icon: '📱', label: 'PIN & biometrics', desc: 'Lock the app with a PIN and unlock instantly with your fingerprint or Face ID.' }
  ];
}])

// ── FeaturesController ───────────────────────────────────
.controller('FeaturesController', ['$scope', function($scope) {
  $scope.activeTab = 'all';

  $scope.tabs = [
    { id: 'all', label: 'All Features' },
    { id: 'tracking', label: 'Tracking' },
    { id: 'budgets', label: 'Budgets & Goals' },
    { id: 'reports', label: 'Reports' },
    { id: 'money', label: 'Cards & Lending' },
    { id: 'ai', label: 'AI & Smart' },
    { id: 'security', label: 'Security & Privacy' }
  ];

  $scope.setTab = function(id) {
    $scope.activeTab = id;
  };

  // Additional mini features list
  $scope.additionalFeatures = [
    { icon: '🔄', title: 'Recurring Expenses', desc: 'Set up monthly bills that auto-log on a chosen date — rent, subscriptions, EMIs.' },
    { icon: '🏷️', title: 'Custom Tags', desc: 'Add cross-category tags like "Business Trip" or "Holiday" to any expense for flexible filtering.' },
    { icon: '🧾', title: 'Receipt OCR', desc: 'Photograph a receipt and Spencheck reads the amount and merchant automatically.' },
    { icon: '📥', title: 'Bank Statement Import', desc: 'Import your bank\'s CSV or PDF statement — transactions are auto-categorised on import.' },
    { icon: '📅', title: 'Calendar View', desc: 'Browse expenses in a month calendar — darker days mean heavier spending, tap any day to drill in.' },
    { icon: '🔎', title: 'Powerful Filters', desc: 'Filter by category, payment method, tags, date range, or amount — or search by note or merchant name.' },
    { icon: '💡', title: 'Spend Projection', desc: 'Spencheck estimates your end-of-month total based on your daily average so far.' },
    { icon: '📲', title: 'Home Screen Widget', desc: 'Log common expenses instantly from your Android home screen without opening the app.' },
    { icon: '🔁', title: 'Split Bills', desc: 'Divide any bill equally or by custom amounts and log shares directly to your lending ledger.' },
    { icon: '🏦', title: 'Wallet Transfers', desc: 'Move money between cash, bank, and UPI wallets and track the transfer history.' },
    { icon: '📤', title: 'Export CSV & PDF', desc: 'Share a full transaction CSV or a one-page PDF report for any time period via the system share sheet.' },
    { icon: '⚙️', title: 'Customisable Dashboard', desc: 'Drag and reorder sections on your home screen — show only what matters to you.' }
  ];

  $scope.investmentTypes = ['Gold', 'Fixed Deposit', 'Recurring Deposit', 'PPF', 'Stocks', 'Mutual Funds', 'Other'];
}])

// ── PricingController ────────────────────────────────────
.controller('PricingController', ['$scope', function($scope) {
  $scope.freeFeatures = [
    'Unlimited expense logging',
    'Category & payment method tracking',
    'Monthly & weekly budget limits',
    'Named savings goals',
    'Lending & bill-split tracker',
    'Credit card manager',
    'Reports (weekly / monthly / yearly)',
    'AI chat assistant (rule-based, offline)',
    'Subscriptions & loan EMI tracker',
    'Manual investment portfolio',
    'Receipt OCR & bank statement import',
    'Export CSV & PDF reports',
    'PIN lock & biometric unlock',
    'Android home-screen widget',
    'SMS expense auto-detection (Android)'
  ];

  $scope.optionalFeatures = [
    'Firebase cloud backup & restore',
    'Bring-your-own Gemini or ChatGPT key for open-ended AI questions',
    'Google Sign-In for cloud backup'
  ];

  $scope.faqs = [
    {
      q: 'Is Spencheck really free?',
      a: 'Yes. Every single feature listed on this page is free with no time limit. There is no premium tier, no paywall, and no feature gated behind a subscription.'
    },
    {
      q: 'What does "optional cloud backup" mean?',
      a: 'By default Spencheck stores all your data locally on your device. Cloud backup is an opt-in feature: if you sign in with your email, you can push a full snapshot to Firebase and restore it on a new phone. It\'s completely optional — most users never need it.'
    },
    {
      q: 'Do I need a Gemini or ChatGPT key?',
      a: 'No. The AI chat assistant works entirely offline using rule-based commands — you can add expenses, check budgets, see who owes you, and get weekly summaries without any API key. The key is only needed if you want to ask open-ended questions.'
    }
  ];
}])

// ── FaqController ────────────────────────────────────────
.controller('FaqController', ['$scope', function($scope) {
  $scope.activeCategory = 'general';

  $scope.categories = [
    { id: 'general', label: 'General', icon: '❓' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'budgets', label: 'Budgets & Goals', icon: '🎯' },
    { id: 'sms', label: 'SMS Detection', icon: '📱' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'privacy', label: 'Privacy & Data', icon: '🔒' },
    { id: 'sync', label: 'Sync & Backup', icon: '☁️' }
  ];

  $scope.setCategory = function(id) {
    $scope.activeCategory = id;
    // Close all FAQs on category switch
    $scope.sections.forEach(function(s) {
      s.items.forEach(function(i) { i.open = false; });
    });
  };

  $scope.toggle = function(item) {
    item.open = !item.open;
  };

  $scope.sections = [
    {
      id: 'general',
      title: 'General',
      icon: '❓',
      items: [
        {
          q: 'What is Spencheck?',
          a: 'Spencheck is a personal finance app for Android that helps you track every rupee you spend, set budgets, manage credit cards, track who owes you money, monitor your investments, and understand your financial habits — all in one place, and all stored privately on your phone.',
          open: false
        },
        {
          q: 'Is Spencheck free?',
          a: 'Yes, completely. Every feature in Spencheck is free with no time limit or paywall. There is no subscription or premium tier.',
          open: false
        },
        {
          q: 'Do I need to create an account?',
          a: 'No. Spencheck works fully offline without any account. An account (email/password via Firebase) is only required if you want to use the optional cloud backup feature to sync your data across devices.',
          open: false
        },
        {
          q: 'Is there a home screen widget?',
          a: 'Yes, on Android. You can configure up to 3 quick-add buttons on the Spencheck home screen widget. Tapping a button instantly logs a preset expense (e.g. ₹50 coffee → Food) in the background — no need to open the app.',
          open: false
        },

      ]
    },
    {
      id: 'expenses',
      title: 'Logging Expenses',
      icon: '💸',
      items: [
        {
          q: 'How do I add an expense?',
          a: 'Tap the "+" button on the floating nav bar. Enter the amount, pick a category (or let auto-categorisation suggest one based on your note), choose a payment method, and tap Save. You can also attach a receipt photo and fill in optional fields like cashback, wallet, tags, and GST.',
          open: false
        },
        {
          q: 'What is auto-categorisation?',
          a: 'When you type a note (like "Swiggy" or "Metro"), Spencheck automatically suggests a category. It checks three things in order: (1) the category you yourself picked the last time you logged that exact merchant, (2) your own custom keyword rules, and (3) a built-in dictionary of common Indian brands. You can always override the suggestion.',
          open: false
        },
        {
          q: 'Can I log who I lent money to right from the expense screen?',
          a: 'Yes. When adding an expense, tap the "Lent" chip next to the category picker. Enter the person\'s name (or pick from contacts), add the amount, and save. This creates a ledger entry under Lending without counting toward your monthly budget.',
          open: false
        },
        {
          q: 'Can I filter or search my expenses?',
          a: 'Yes. Tap the filter icon (shows a badge with the number of active filters) to filter by category, payment method, date range, and amount range. Tap the search icon to search by note, amount, or category name. A filter summary card appears showing the total and count for filtered results.',
          open: false
        },
        {
          q: 'What is the calendar view?',
          a: 'Tap the calendar icon on the Expenses screen to switch from a list to a month calendar. Each day shows dots for expenses and a filled circle whose darkness scales with how much you spent that day — the darker the day, the heavier the spend. Tap any day to see that day\'s transactions.',
          open: false
        },
        {
          q: 'Can I set up recurring expenses?',
          a: 'Yes. Go to Account → Recurring Expenses. Set a name, category, amount, and a day of the month. Spencheck will auto-log that expense on that day every month.',
          open: false
        },
        {
          q: 'How does duplicate detection work?',
          a: 'When you save an expense, Spencheck checks whether another expense with the same category, same calendar day, and a very similar amount (within ₹5) already exists. If it finds a match, it shows a warning and lets you decide whether to save anyway — it\'s a hint, never a hard block.',
          open: false
        },
        {
          q: 'Can I import my bank statement?',
          a: 'Yes. Go to Account → Import Bank Statement. Pick a CSV or PDF file from your bank, review the auto-detected transactions in a preview list, uncheck any you don\'t want to import, and tap Import. Transactions are auto-categorised using the same logic as manual entry.',
          open: false
        }
      ]
    },
    {
      id: 'budgets',
      title: 'Budgets & Goals',
      icon: '🎯',
      items: [
        {
          q: 'How do I set a budget?',
          a: 'Go to Account → Budget & Savings Goal. Set an overall monthly spend cap, a weekly limit, and per-category budgets. A progress ring on the Budget screen turns from primary colour to amber at 80% usage and red at 100%, so you always know where you stand.',
          open: false
        },
        {
          q: 'What is the difference between a "Savings Goal" on the Budget screen and the "Goals" section?',
          a: 'The Budget screen\'s Savings Goal is a single, auto-computed target (income minus spend) for the current month. The Goals section (Account → Goals) lets you create multiple, named goals like "Vacation Fund" or "New Phone," each manually funded by you whenever you add money toward them. Both exist independently.',
          open: false
        },
        {
          q: 'Will Spencheck notify me when I\'m near my budget limit?',
          a: 'Yes. You\'ll get a notification when you reach 80% and 100% of your monthly budget. There\'s also a weekly budget notification, a payday reminder on your chosen salary day, and a "Large expense detected" alert if a single expense exceeds 30% of your monthly budget.',
          open: false
        },
        {
          q: 'Can I track subscriptions separately?',
          a: 'Yes. Go to Account → Subscriptions. Add Netflix, Spotify, or any other recurring service. Spencheck shows your total combined monthly subscription cost, flags renewals due this week, and lets you mark them as renewed. Note: subscriptions are tracked separately from your main expense budget.',
          open: false
        },
        {
          q: 'How does the loan EMI tracker work?',
          a: 'Go to Account → Loans & EMIs. Add a loan with the principal, annual interest rate, tenure, and due date. Spencheck computes your EMI using the standard reducing-balance formula and shows a full month-by-month amortisation schedule. When you make a payment, tap "Mark EMI paid" to reduce the outstanding balance and log it as an expense.',
          open: false
        }
      ]
    },
    {
      id: 'sms',
      title: 'SMS Auto-Detection',
      icon: '📱',
      items: [
        {
          q: 'What is SMS expense detection?',
          a: 'On Android, Spencheck reads your bank and UPI debit SMS alerts and automatically suggests them as expenses. A battle-tested regex engine tuned across 35+ Indian banks extracts the amount, merchant, and UPI app — all parsing happens on-device with nothing leaving your phone.',
          open: false
        },
        {
          q: 'Does Spencheck auto-add expenses from SMS without asking?',
          a: 'Mostly yes for repeat merchants, with your explicit confirmation for new ones. If the merchant has been logged before with the same category, Spencheck auto-adds it silently and shows an undoable notification. For new merchants, the transaction appears in a "Pending" review queue on the Dashboard for you to accept or dismiss.',
          open: false
        },
        {
          q: 'Can SMS detection match transactions to my credit cards or bank accounts?',
          a: 'Yes. If the SMS contains the last 4 digits of an account (e.g. "A/c XX1234"), Spencheck matches it to the card or bank wallet you\'ve set up with those digits. When you accept the transaction, the card or wallet is pre-filled automatically.',
          open: false
        },

      ]
    },
    {
      id: 'ai',
      title: 'AI Chat Assistant',
      icon: '🤖',
      items: [
        {
          q: 'What can I ask the AI assistant?',
          a: 'The assistant handles two kinds of requests. Actions: "Add ₹450 for groceries," "Lent ₹500 to Rahul," "Mark ₹200 received from Priya." Queries: "How much did I spend this week?", "What\'s my budget remaining?", "Who owes me money?", "Show my top categories this month."',
          open: false
        },
        {
          q: 'Does the AI assistant need an internet connection?',
          a: 'No. All commands and standard queries work offline using Spencheck\'s built-in rule-based engine. The engine understands natural language for adding expenses, logging lending, and querying summaries without any network connection.',
          open: false
        },
        {
          q: 'What is the "bring your own key" option?',
          a: 'If you want to ask open-ended questions beyond standard commands (e.g. "Give me tips to cut food spending"), you can paste your own Gemini or ChatGPT API key in Account → Cloud AI Provider. Spencheck will use your key for those questions. Without a key, open-ended questions just fall back to the offline rule-based responses.',
          open: false
        },
        {
          q: 'Is my financial data sent to Google or OpenAI?',
          a: 'Only if you configure a cloud AI key. With a key set, the text of your messages (which may include expense notes, amounts, and merchant names) is sent to Google\'s or OpenAI\'s servers under their respective privacy policies. Without a key, nothing related to chat ever leaves your device.',
          open: false
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: '🔒',
      items: [
        {
          q: 'Where is my data stored?',
          a: 'All your data is stored in a local SQLite database on your device. It never leaves your phone unless you explicitly enable cloud backup.',
          open: false
        },
        {
          q: 'Can I lock the app?',
          a: 'Yes. Go to Account → App Lock PIN to set a 4-digit PIN. After 3 wrong attempts, the input locks for 30 seconds (doubling with each further failure). You can also enable fingerprint or Face ID as a quick-unlock shortcut.',
          open: false
        },
        {
          q: 'How do I delete all my data?',
          a: 'Account → Clear All Data wipes all local data from your device. If you also want to delete your cloud backup and account, use Account → Delete Account instead — this removes your Firestore data, Firebase Auth account, and all local data in one step.',
          open: false
        },
        {
          q: 'Does Spencheck have ads or track me for advertising?',
          a: 'No. Spencheck has no advertising, no analytics platform that tracks user behaviour, and no data shared with or sold to any third party.',
          open: false
        }
      ]
    },
    {
      id: 'sync',
      title: 'Cloud Backup & Sync',
      icon: '☁️',
      items: [
        {
          q: 'How does cloud backup work?',
          a: 'Go to Account → Cloud Backup. Sign in with your email and password, then tap "Backup Now." Spencheck pushes a full snapshot of your local data to Firebase Firestore under your account. To restore it on a new phone, sign in and tap "Restore." This is a one-shot backup/restore — not continuous sync.',
          open: false
        },
        {
          q: 'Is auto-backup available?',
          a: 'Yes. Enable the Auto Backup toggle in the Cloud Backup screen and choose Daily or Weekly. Spencheck will opportunistically back up after every local data change that\'s due for backup, as long as you\'re signed in.',
          open: false
        },
        {
          q: 'Can I delete my cloud backup without deleting my account?',
          a: 'Yes. In the Cloud Backup screen, tap "Delete backup data." This removes all data from Firestore while keeping your sign-in and your local device data intact.',
          open: false
        }
      ]
    }
  ];

  $scope.visibleSections = function() {
    if ($scope.activeCategory === 'all') return $scope.sections;
    return $scope.sections.filter(function(s) { return s.id === $scope.activeCategory; });
  };
}])

// ── PricingController ────────────────────────────────────
.controller('DownloadController', ['$scope', function($scope) {
  $scope.platforms = [
    { icon: '🤖', name: 'Android', desc: 'Full feature set including SMS auto-detection, home screen widget, and real-time UPI app list.', badge: 'Available Now', badgeClass: '', btn: 'Download APK' }
  ];

  $scope.requirements = [
    { icon: '📱', label: 'Android 7.0+', sub: 'required' },
    { icon: '💾', label: '~80 MB', sub: 'storage required' },
    { icon: '🌐', label: 'Offline-first', sub: 'no internet needed' }
  ];
}])

// ── GuideController ──────────────────────────────────────
.controller('GuideController', ['$scope', function($scope) {
  $scope.activeGuideTab = 'all';

  $scope.guideTabs = [
    { id: 'all',      label: 'All screens' },
    { id: 'tracking', label: '💸 Tracking' },
    { id: 'budgets',  label: '🎯 Budgets' },
    { id: 'reports',  label: '📊 Reports' },
    { id: 'money',    label: '💳 Money' },
    { id: 'more',     label: '✨ More' },
  ];

  $scope.guideScreens = {
    tracking: [
      {
        img: 'dashboard.png',
        label: 'Dashboard',
        desc: 'Your financial snapshot at a glance — budget ring, recent expenses, and quick actions.'
      },
      {
        img: 'expenses.png',
        label: 'Expenses',
        desc: 'Full transaction list with search, filter by category or date, and swipe to edit.'
      },
      {
        img: 'add_expense.png',
        label: 'Add Expense',
        desc: 'Log a spend in under 5 seconds — amount, category, payment method, and optional note.'
      },
      {
        img: 'sms_detect.png',
        label: 'SMS Detection',
        desc: 'Android auto-reads your bank SMS alerts and queues detected transactions for one-tap confirmation.'
      },
      {
        img: 'subscriptions.png',
        label: 'Subscriptions',
        desc: 'Track recurring subscriptions like Netflix, Spotify, and Zomato Gold with upcoming renewal alerts.'
      },
    ],
    budgets: [
      {
        img: 'budgets.png',
        label: 'Budgets',
        desc: 'Monthly and per-category limits shown as a progress ring that turns amber then red as you approach your limit.'
      },
      {
        img: 'goals.png',
        label: 'Savings Goals',
        desc: 'Named goals like "Vacation Fund" with a progress ring and manual save entries.'
      },
      {
        img: 'challenges.png',
        label: 'Challenges',
        desc: 'Self-imposed spending challenges — try a no-eating-out week or hit a savings milestone.'
      },
      {
        img: 'gamification.png',
        label: 'Gamification',
        desc: 'Streaks, milestones, and achievements that reward consistent tracking habits.'
      },
    ],
    reports: [
      {
        img: 'reports.png',
        label: 'Reports',
        desc: 'Weekly, monthly, and yearly spend with a 6-period bar chart and one-tap drill-down into any period.'
      },
      {
        img: 'insights.png',
        label: 'Insights',
        desc: 'Auto-generated insights: biggest category change, busiest day, under-budget streak, and more.'
      },
      {
        img: 'wrap.png',
        label: 'Year in Review',
        desc: 'An animated annual wrap-up showing your top categories, biggest splurge, and savings highlights.'
      },
    ],
    money: [
      {
        img: 'cards.png',
        label: 'Credit Cards',
        desc: 'Realistic card visuals with outstanding balance, utilisation bar, credit limit, and due date.'
      },
      {
        img: 'lendings.png',
        label: 'Lending',
        desc: 'People ledger showing who owes you and who you owe, with WhatsApp reminder one-tap send.'
      },
      {
        img: 'split_bill.png',
        label: 'Split Bill',
        desc: 'Divide any bill equally or by custom amounts and auto-add each share to the lending ledger.'
      },
      {
        img: 'investments.png',
        label: 'Investments',
        desc: 'Track Gold, FD, RD, PPF, Stocks, and Mutual Funds with invested vs current value and overall gain.'
      },
      {
        img: 'wallets.png',
        label: 'Wallets',
        desc: 'Cash, bank, UPI, and investment wallets with auto-computed balances that update as you log expenses.'
      },
      {
        img: 'emi.png',
        label: 'Loan EMI Tracker',
        desc: 'Add home or personal loans. Spencheck computes EMI and shows a full amortisation schedule.'
      },
      {
        img: 'networth.png',
        label: 'Net Worth',
        desc: 'Your assets minus liabilities in one number — updated live as you add investments and loans.'
      },
    ],
    more: [
      {
        img: 'chat.png',
        label: 'AI Chat',
        desc: '"Add ₹450 food" — the assistant logs it instantly. Upgrade with your own Gemini or ChatGPT key.'
      },
    ],
  };
}]);
