// =========================================================
// SPENCHECK MARKETING SITE — AngularJS App (v3 Reactive)
// Module: spencheckApp
// =========================================================

angular.module('spencheckApp', ['ngRoute'])

// ── Route Configuration ──────────────────────────────────
.config(['$routeProvider', function ($routeProvider) {
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
    .when('/guide', {
      templateUrl: 'views/guide.html',
      controller: 'GuideController',
      title: '32-Screen App Guide — Spencheck'
    })
    .when('/pricing', {
      templateUrl: 'views/pricing.html',
      controller: 'PricingController',
      title: 'Pricing — Spencheck (Free Forever)'
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
    .otherwise({ redirectTo: '/' });
}])

// ── Run: Motion Init, Theme Sync, Global Lightbox ────────
.run(['$rootScope', '$timeout', '$window', function ($rootScope, $timeout, $window) {
  var motion = $window.SpencheckMotion;

  $rootScope.theme = motion ? motion.getTheme() : 'dark';
  $rootScope.toggleTheme = function () {
    if (motion) {
      $rootScope.theme = motion.toggleTheme();
    }
  };

  // Global Lightbox Modal State
  $rootScope.lightbox = {
    open: false,
    items: [],
    index: 0
  };

  $rootScope.openLightbox = function (items, index) {
    if (!items || !items.length) return;
    $rootScope.lightbox.items = items;
    $rootScope.lightbox.index = Math.max(0, Math.min(index || 0, items.length - 1));
    $rootScope.lightbox.open = true;
    document.body.style.overflow = 'hidden';
  };

  $rootScope.closeLightbox = function () {
    $rootScope.lightbox.open = false;
    document.body.style.overflow = '';
  };

  $rootScope.nextLightbox = function () {
    var len = $rootScope.lightbox.items.length;
    if (!len) return;
    $rootScope.lightbox.index = ($rootScope.lightbox.index + 1) % len;
  };

  $rootScope.prevLightbox = function () {
    var len = $rootScope.lightbox.items.length;
    if (!len) return;
    $rootScope.lightbox.index = ($rootScope.lightbox.index - 1 + len) % len;
  };

  $window.addEventListener('keydown', function (e) {
    if (!$rootScope.lightbox.open) return;
    if (e.key === 'Escape') {
      $rootScope.$applyAsync(function () { $rootScope.closeLightbox(); });
    } else if (e.key === 'ArrowRight') {
      $rootScope.$applyAsync(function () { $rootScope.nextLightbox(); });
    } else if (e.key === 'ArrowLeft') {
      $rootScope.$applyAsync(function () { $rootScope.prevLightbox(); });
    }
  });

  $rootScope.$on('$routeChangeSuccess', function (e, current) {
    if (current && current.$$route && current.$$route.title) {
      document.title = current.$$route.title;
    }
    $rootScope.closeLightbox();
    $window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $rootScope.$on('$viewContentLoaded', function () {
    $timeout(function () {
      if (motion) motion.initView();
    }, 60);
  });
}])

// ── NavController ────────────────────────────────────────
.controller('NavController', ['$scope', '$location', function ($scope, $location) {
  $scope.menuOpen = false;

  $scope.isActive = function (path) {
    return $location.path() === path;
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.menuOpen = false;
  });
}])

// ── HomeController (Interactive Live Playgrounds) ────────
.controller('HomeController', ['$scope', '$interval', '$timeout', '$window', function ($scope, $interval, $timeout, $window) {
  // 1. Kinetic Headline Word
  $scope.kineticWords = ['mastered', 'automated', 'budgeted', 'protected'];
  $scope.kineticIdx = 0;

  var wordTimer = $interval(function () {
    $scope.kineticIdx = ($scope.kineticIdx + 1) % $scope.kineticWords.length;
  }, 2600);

  // 2. Living Interactive Hero Device
  $scope.heroBudget = 45000;
  $scope.heroSpent = 26933;
  $scope.heroFeed = [
    { icon: '🛒', bg: 'rgba(18, 183, 106, 0.16)', name: 'Zepto', cat: 'Groceries · UPI', amt: 690 },
    { icon: '🍽️', bg: 'rgba(139, 155, 255, 0.16)', name: 'Swiggy', cat: 'Food · GPay', amt: 485 },
    { icon: '🚕', bg: 'rgba(247, 144, 9, 0.16)', name: 'Uber Airport', cat: 'Transport · PhonePe', amt: 420 }
  ];

  $scope.heroToast = {
    visible: true,
    bank: 'HDFC UPI',
    text: '₹485 at Swiggy → Auto-tagged Food'
  };

  var heroToasts = [
    { bank: 'HDFC UPI', text: '₹485 at Swiggy → Auto-tagged Food' },
    { bank: 'ICICI Card ••9104', text: '₹3,299 at Nike India → Queued' },
    { bank: 'SBI Credit', text: '+₹1,250 from Priya → Money Received' }
  ];
  var toastIdx = 0;
  var toastTimer = $interval(function () {
    toastIdx = (toastIdx + 1) % heroToasts.length;
    $scope.heroToast = {
      visible: true,
      bank: heroToasts[toastIdx].bank,
      text: heroToasts[toastIdx].text
    };
  }, 3800);

  $scope.formatInr = function (val) {
    return Math.round(Math.max(0, val || 0)).toLocaleString('en-IN');
  };

  $scope.heroPct = function () {
    return Math.min(100, Math.round(($scope.heroSpent / $scope.heroBudget) * 100));
  };

  $scope.heroTone = function () {
    var p = ($scope.heroSpent / $scope.heroBudget) * 100;
    if (p >= 100) return 'over';
    if (p >= 80) return 'warn';
    return 'ok';
  };

  $scope.heroRemaining = function () {
    return Math.max(0, $scope.heroBudget - $scope.heroSpent);
  };

  $scope.addHeroQuickSpend = function (name, cat, amt, icon, bg) {
    $scope.heroSpent += amt;
    $scope.heroFeed.unshift({
      icon: icon,
      bg: bg,
      name: name,
      cat: cat + ' · Just now',
      amt: amt,
      fresh: true
    });
    if ($scope.heroFeed.length > 4) {
      $scope.heroFeed.pop();
    }
    $scope.heroToast = {
      visible: true,
      bank: 'Instant Log',
      text: 'Added ₹' + amt.toLocaleString('en-IN') + ' · ' + name
    };
  };

  $scope.resetHeroDemo = function () {
    $scope.heroSpent = 26933;
    $scope.heroFeed = [
      { icon: '🛒', bg: 'rgba(18, 183, 106, 0.16)', name: 'Zepto', cat: 'Groceries · UPI', amt: 690 },
      { icon: '🍽️', bg: 'rgba(139, 155, 255, 0.16)', name: 'Swiggy', cat: 'Food · GPay', amt: 485 },
      { icon: '🚕', bg: 'rgba(247, 144, 9, 0.16)', name: 'Uber Airport', cat: 'Transport · PhonePe', amt: 420 }
    ];
  };

  $scope.$on('$destroy', function () {
    $interval.cancel(wordTimer);
    $interval.cancel(toastTimer);
  });

  // 3. Animated Metrics Strip
  $scope.metrics = [
    { target: 35,  prefix: '',     suffix: '+', label: 'Indian banks parsed on-device', tone: 'accent' },
    { target: 256, prefix: 'AES-', suffix: '',  label: 'Local SQLCipher encryption',   tone: 'success' },
    { target: 32,  prefix: '',     suffix: '',  label: 'Purpose-built app screens',     tone: '' },
    { target: 0,   prefix: '',     suffix: '',  label: 'Ads or third-party trackers',   tone: 'accent' },
    { target: 0,   prefix: '₹',    suffix: '',  label: 'Price, forever',                tone: 'success' }
  ];

  // 4. Interactive SMS -> Expense Morph Engine
  $scope.activeSmsIdx = 0;
  $scope.smsAnimKey = 1;
  $scope.smsDemos = [
    {
      label: 'HDFC UPI · Swiggy',
      sender: 'AD-HDFCBK',
      time: 'Just now',
      rawPrefix: 'Sent ',
      tokAmount: 'Rs.485.00',
      rawMid: ' from HDFC Bank ',
      tokCard: 'A/c XX4821',
      rawEnd: ' to ',
      tokMerchant: 'Swiggy',
      rawTail: ' via Google Pay UPI Ref 432819044123.',
      title: 'Swiggy',
      amount: '−₹485',
      isCredit: false,
      category: 'Food',
      catColor: '#8B9BFF',
      matchedAccount: 'HDFC Savings ••4821',
      rail: 'Google Pay UPI',
      destination: 'Auto-added to Expenses ✓'
    },
    {
      label: 'ICICI Card · Nike',
      sender: 'VM-ICICIB',
      time: '2m ago',
      rawPrefix: 'Spent ',
      tokAmount: 'INR 3,299.00',
      rawMid: ' on ICICI Credit Card ',
      tokCard: 'XX9104',
      rawEnd: ' at ',
      tokMerchant: 'NIKE INDIA',
      rawTail: ' on 23-Nov-26. Avl limit Rs.1,44,490.',
      title: 'Nike India',
      amount: '−₹3,299',
      isCredit: false,
      category: 'Shopping',
      catColor: '#F79009',
      matchedAccount: 'ICICI Amazon Pay ••9104',
      rail: 'Credit Card · 2% cashback',
      destination: 'Queued in SMS Review'
    },
    {
      label: 'Credit · Priya Nair',
      sender: 'JD-HDFCBK',
      time: '14m ago',
      rawPrefix: 'Credited ',
      tokAmount: 'Rs.1,250.00',
      rawMid: ' to ',
      tokCard: 'A/c XX4821',
      rawEnd: ' from VPA ',
      tokMerchant: 'Priya Nair',
      rawTail: ' (UPI Ref 432819098765).',
      title: 'Priya Nair',
      amount: '+₹1,250',
      isCredit: true,
      category: 'Repayment / Transfer',
      catColor: '#12B76A',
      matchedAccount: 'HDFC Savings ••4821',
      rail: 'Incoming Credit',
      destination: 'Routed to Money Received →'
    },
    {
      label: 'AutoPay · Airtel Fiber',
      sender: 'AX-HDFCBK',
      time: '1h ago',
      rawPrefix: 'Mandate debited ',
      tokAmount: 'Rs.999.00',
      rawMid: ' from ',
      tokCard: 'XX4821',
      rawEnd: ' towards ',
      tokMerchant: 'Airtel Broadband',
      rawTail: ' Monthly AutoPay.',
      title: 'Airtel Fiber',
      amount: '−₹999',
      isCredit: false,
      category: 'Bills & Utilities',
      catColor: '#9E77ED',
      matchedAccount: 'HDFC Savings ••4821',
      rail: 'Standing Mandate',
      destination: 'Matched Recurring Bill ✓'
    }
  ];

  $scope.selectSmsDemo = function (idx) {
    $scope.activeSmsIdx = idx;
    $scope.smsAnimKey++;
  };

  // 5. Interactive Budget Ring & 30-Day Bills Simulator
  $scope.simBudget = 45000;
  $scope.simSpent = 26933;
  $scope.simBaseWallets = 165450;

  $scope.simPct = function () {
    return Math.min(100, Math.round(($scope.simSpent / $scope.simBudget) * 100));
  };

  $scope.simRawPct = function () {
    return Math.round(($scope.simSpent / $scope.simBudget) * 100);
  };

  $scope.simTone = function () {
    var p = ($scope.simSpent / $scope.simBudget) * 100;
    if (p >= 100) return 'over';
    if (p >= 80) return 'warn';
    return 'ok';
  };

  $scope.simRemaining = function () {
    return $scope.simBudget - $scope.simSpent;
  };

  $scope.simDashOffset = function () {
    var circ = 339.292;
    var ratio = Math.min(1, Math.max(0, $scope.simSpent / $scope.simBudget));
    return (circ * (1 - ratio)).toFixed(2);
  };

  $scope.addSimSpend = function (amt) {
    $scope.simSpent = Math.min(60000, Number($scope.simSpent) + amt);
  };

  $scope.resetSim = function () {
    $scope.simSpent = 26933;
  };

  $scope.simBills = [
    { name: 'Netflix', kind: 'Subscription · Nov 26', amount: 649, icon: '🎬', paid: false },
    { name: 'HDFC Regalia Gold', kind: 'Card bill · Nov 28', amount: 12609, icon: '💳', paid: false },
    { name: 'ChatGPT Plus', kind: 'Subscription · Nov 28', amount: 1999, icon: '✨', paid: false },
    { name: 'House Rent', kind: 'Recurring · Dec 1', amount: 22000, icon: '🏠', paid: false }
  ];

  $scope.toggleBillPaid = function (bill) {
    bill.paid = !bill.paid;
  };

  $scope.remainingBillsTotal = function () {
    return $scope.simBills.reduce(function (sum, b) {
      return sum + (b.paid ? 0 : b.amount);
    }, 0);
  };

  $scope.walletsAfterBills = function () {
    return $scope.simBaseWallets - $scope.remainingBillsTotal();
  };

  $scope.billsCoveredPct = function () {
    return Math.max(8, Math.min(100, Math.round(($scope.walletsAfterBills() / $scope.simBaseWallets) * 100)));
  };

  // 6. Interactive Ask Spencheck AI & Group Split Dual Stage
  $scope.aiPrompts = [
    {
      prompt: 'Summary of this week',
      mode: 'chart',
      replyText: 'You spent ₹1,955 this week across 3 categories. Food leads at 43% (₹845).',
      slices: [
        { label: 'Food', pct: 43, amt: '₹845', color: '#8B9BFF', dash: '108 251', offset: '0' },
        { label: 'Groceries', pct: 35, amt: '₹690', color: '#12B76A', dash: '88 251', offset: '-108' },
        { label: 'Transport', pct: 22, amt: '₹420', color: '#F79009', dash: '56 251', offset: '-196' }
      ]
    },
    {
      prompt: 'Add ₹360 for Blue Tokai Coffee',
      mode: 'action',
      badge: '✓ Logged offline',
      title: 'Blue Tokai Coffee · Food',
      amount: '−₹360',
      replyText: 'Saved under Food (UPI). Your Food total this month is ₹1,755 of ₹10,000.'
    },
    {
      prompt: 'Who owes me money?',
      mode: 'lending',
      badge: 'Net owed to you: +₹2,800',
      rows: [
        { name: 'Rohan Verma', note: 'Goa villa split', val: '+₹2,400', pos: true },
        { name: 'Priya Nair', note: 'Friday dinner', val: '+₹1,250', pos: true },
        { name: 'Kabir Sharma', note: 'Concert tickets', val: '−₹850', pos: false }
      ]
    },
    {
      prompt: 'Remind me to pay rent on the 5th',
      mode: 'reminder',
      badge: '⏰ Reminder scheduled',
      title: 'Pay House Rent',
      sub: 'Repeats monthly on the 5th · 9:00 AM notification'
    }
  ];

  $scope.activeAiIdx = 0;
  $scope.aiTyping = false;
  var aiTimer = null;

  $scope.runAiPrompt = function (idx) {
    if (aiTimer) $timeout.cancel(aiTimer);
    $scope.activeAiIdx = idx;
    $scope.aiTyping = true;
    aiTimer = $timeout(function () {
      $scope.aiTyping = false;
    }, 380);
  };

  $scope.$on('$destroy', function () {
    if (aiTimer) $timeout.cancel(aiTimer);
  });

  $scope.splitMembers = [
    { name: 'You (Aarav)', share: 900, paid: true, isMe: true },
    { name: 'Priya Nair', share: 900, paid: true, isMe: false },
    { name: 'Rohan Verma', share: 900, paid: false, isMe: false },
    { name: 'Kabir Sharma', share: 900, paid: false, isMe: false }
  ];

  $scope.toggleMemberPaid = function (m) {
    if (m.isMe) return;
    m.paid = !m.paid;
  };

  $scope.splitCollected = function () {
    return $scope.splitMembers.reduce(function (s, m) {
      return s + (m.paid ? m.share : 0);
    }, 0);
  };

  $scope.splitPct = function () {
    return Math.round(($scope.splitCollected() / 3600) * 100);
  };

  // 7. Interactive 3D Card Fan & Portfolio Allocation
  $scope.activeCardIdx = 0;
  $scope.showcaseCards = [
    {
      bank: 'HDFC Regalia Gold',
      last4: '7392',
      outstanding: '₹12,609',
      limit: '₹3,00,000',
      utilPct: 4.2,
      due: 'Due Nov 28',
      cashback: '1.5% Rewards',
      gradient: 'linear-gradient(135deg, #2C5CE0 0%, #162E84 100%)'
    },
    {
      bank: 'ICICI Amazon Pay',
      last4: '9104',
      outstanding: '₹5,510',
      limit: '₹1,50,000',
      utilPct: 3.7,
      due: 'Due Nov 28',
      cashback: '2.0% Cashback',
      gradient: 'linear-gradient(135deg, #0E7490 0%, #0F3443 100%)'
    },
    {
      bank: 'SBI Cashback',
      last4: '5518',
      outstanding: '₹1,840',
      limit: '₹2,00,000',
      utilPct: 0.9,
      due: 'Due Dec 05',
      cashback: '5.0% Online',
      gradient: 'linear-gradient(135deg, #4338CA 0%, #1E1B4B 100%)'
    }
  ];

  $scope.selectCard = function (idx) {
    $scope.activeCardIdx = idx;
  };

  $scope.activeAssetIdx = 0;
  $scope.portfolioAssets = [
    { name: 'Mutual Funds', value: '₹4,48,200', gain: '+28.1%', pct: 41, color: '#8B9BFF' },
    { name: 'PPF Account',  value: '₹2,68,900', gain: '+19.5%', pct: 25, color: '#12B76A' },
    { name: 'Fixed Deposit',value: '₹2,15,400', gain: '+7.7%',  pct: 20, color: '#F79009' },
    { name: 'Gold / SGB',   value: '₹1,58,400', gain: '+32.0%', pct: 14, color: '#9E77ED' }
  ];

  $scope.selectAsset = function (idx) {
    $scope.activeAssetIdx = idx;
  };

  // 8. Privacy Vault Specs
  $scope.vaultSpecs = [
    { icon: '🔐', title: 'AES-256 SQLCipher DB', desc: 'Your entire ledger stays encrypted locally on your phone.' },
    { icon: '🛡️', title: 'Screenshot & Recents Block', desc: 'Hidden from Android recents & screen recording by default.' },
    { icon: '👆', title: 'Keystore PIN + Biometrics', desc: '4–12 digit PIN with fingerprint unlock & attempt lockout.' },
    { icon: '🗑️', title: 'One-Step Account Wipe', desc: 'Clear local DB, cloud backup, and chats anytime.' }
  ];

  $timeout(function () {
    if ($window.SpencheckMotion) $window.SpencheckMotion.refreshReveals();
  }, 120);
}])

// ── FeaturesController ───────────────────────────────────
.controller('FeaturesController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
  $scope.activeTab = 'all';

  $scope.tabs = [
    { id: 'all',      label: 'All Features' },
    { id: 'tracking', label: 'Tracking & SMS' },
    { id: 'budgets',  label: 'Budgets & Bills' },
    { id: 'reports',  label: 'Reports & Wraps' },
    { id: 'money',    label: 'Cards, Loans & Wealth' },
    { id: 'social',   label: 'Friends & Splits' },
    { id: 'ai',       label: 'AI & Habits' },
    { id: 'security', label: 'Security & Privacy' }
  ];

  $scope.setTab = function (id) {
    $scope.activeTab = id;
    $timeout(function () {
      if ($window.SpencheckMotion) $window.SpencheckMotion.refreshReveals();
    }, 60);
  };

  // Multi-screen interactive previews per feature block
  $scope.blockScreens = {
    expenses: [
      { img: 'add_expense.png',   label: 'Quick Add',      category: 'Expense Tracking', desc: 'Log amount, merchant, category, UPI app, cashback, GST, and tags in seconds.' },
      { img: 'expenses.png',      label: 'Activity Feed',  category: 'Expense Tracking', desc: 'Grouped by day with search, multi-filters, and instant expense/income toggle.' },
      { img: 'calendar_view.png', label: 'Spend Heatmap',  category: 'Expense Tracking', desc: 'Month calendar where dot density and circle shading show heavy spending days.' },
      { img: 'tags.png',          label: 'Custom Tags',    category: 'Expense Tracking', desc: 'Cross-category tags like #Goa Trip or #Tax Deductible with live spend counts.' }
    ],
    sms: [
      { img: 'sms_detect.png',     label: 'SMS Review',     category: 'Android Automation', desc: 'On-device regex parser across 35+ Indian banks matches cards & accounts automatically.' },
      { img: 'money_received.png', label: 'Money Received', category: 'Android Automation', desc: 'Incoming salary, refunds, and repayments land cleanly on their own review screen.' },
      { img: 'widget_presets.png', label: 'Home Widget',    category: 'Android Automation', desc: 'Configure 3 one-tap preset buttons right on your Android home screen.' }
    ],
    budgets: [
      { img: 'budgets.png',        label: 'Budgets',        category: 'Budgets & Goals', desc: 'Monthly, weekly, and category limits with color-coded progress rings and daily pace.' },
      { img: 'bills_calendar.png', label: 'Bills Calendar', category: 'Budgets & Goals', desc: '30-day timeline of upcoming recurring bills, subscriptions, card dues, and EMIs.' },
      { img: 'recurring.png',      label: 'Recurring',      category: 'Budgets & Goals', desc: 'Auto-log rent and bills on your chosen date, or pause/skip any single month.' },
      { img: 'goals.png',          label: 'Savings Goals',  category: 'Budgets & Goals', desc: 'Dedicated named savings targets with progress bars and round-up sweeps.' }
    ],
    reports: [
      { img: 'reports.png',  label: 'Reports',      category: 'Analytics', desc: 'Week, Month, Year, and Indian Financial Year (FY) breakdown with drill-down bar charts.' },
      { img: 'insights.png', label: 'Insights',     category: 'Analytics', desc: 'Automatic month-over-month deltas, busiest day, category spikes, and recurring suggestions.' },
      { img: 'wrap.png',     label: 'Monthly Wrap', category: 'Analytics', desc: 'Shareable monthly & December Year Wrapped cards summarizing your wins.' }
    ],
    lending: [
      { img: 'cards.png',      label: 'Credit Cards', category: 'Cards & Lending', desc: 'Realistic card visuals showing limit, utilisation bar, billing cycle, and due date.' },
      { img: 'lendings.png',   label: 'Lending',      category: 'Cards & Lending', desc: 'Running people ledger showing who owes you and what you owe, with WhatsApp UPI nudges.' },
      { img: 'split_bill.png', label: 'Split Bill',   category: 'Cards & Lending', desc: 'Divide any bill equally or by custom shares and log balances automatically.' }
    ],
    wealth: [
      { img: 'investments.png', label: 'Investments', category: 'Wealth & Wallets', desc: 'Track Gold, FD, RD, PPF, Stocks, and Mutual Funds with invested vs current value.' },
      { img: 'wallets.png',     label: 'Wallets',     category: 'Wealth & Wallets', desc: 'Cash, bank accounts, and UPI wallets with live balances and transfers.' },
      { img: 'emi.png',         label: 'Loans & EMIs',category: 'Wealth & Wallets', desc: 'Home, car, and personal loans with reducing-balance EMI & full amortisation schedule.' },
      { img: 'networth.png',    label: 'Net Worth',   category: 'Wealth & Wallets', desc: 'Total assets minus liabilities in one unified live number.' }
    ],
    social: [
      { img: 'chat_split.png', label: 'In-Chat Split', category: 'Friends & Chat', desc: 'Drop interactive split cards right in your group chat and see who tapped Mark Paid.' },
      { img: 'social.png',     label: 'Chats & Friends',category: 'Friends & Chat', desc: 'Connect via @username or QR code — friends never see your personal expenses or budgets.' }
    ],
    ai: [
      { img: 'chat.png',         label: 'Ask Spencheck', category: 'AI & Habits', desc: 'Offline rule engine + optional BYO Gemini/ChatGPT key with inline category charts.' },
      { img: 'health_score.png', label: 'Health Score',  category: 'AI & Habits', desc: '0–1000 Money Habits Score tracking budget adherence, savings, and consistency.' },
      { img: 'gamification.png', label: 'Trophy Room',   category: 'AI & Habits', desc: 'E→S rank gauge, levels, badges, and daily tracking streaks.' },
      { img: 'challenges.png',   label: 'Challenges',    category: 'AI & Habits', desc: 'No-Spend Day streaks and Round-Up Savings swept directly into your goals.' },
      { img: 'reminders.png',    label: 'Reminders',     category: 'AI & Habits', desc: 'Bill, collect, and custom repeating reminders — creatable by chat too.' }
    ],
    security: [
      { img: 'pin_lock.png',            label: 'PIN & Biometric',     category: 'Security & Privacy', desc: '4–12 digit hardware-keystore PIN lock with biometric unlock and brute-force cooldown.' },
      { img: 'customize_dashboard.png', label: 'Custom Dashboard',    category: 'Security & Privacy', desc: 'Reorder or hide any home screen section so only what matters stays visible.' },
      { img: 'dashboard.png',           label: 'Local-First Core',    category: 'Security & Privacy', desc: 'AES-256 SQLCipher encrypted storage on device, with optional encrypted Firebase backup.' }
    ]
  };

  $scope.selectedScreen = {
    expenses: 0, sms: 0, budgets: 0, reports: 0, lending: 0, wealth: 0, social: 0, ai: 0, security: 0
  };

  $scope.selectBlockScreen = function (blockId, idx) {
    $scope.selectedScreen[blockId] = idx;
  };

  $scope.openBlockLightbox = function (blockId) {
    $scope.$root.openLightbox($scope.blockScreens[blockId], $scope.selectedScreen[blockId] || 0);
  };

  $scope.investmentTypes = ['Mutual Funds', 'Stocks', 'Gold / SGB', 'Fixed Deposit', 'Recurring Deposit', 'PPF', 'Other'];

  // Complete grid of additional built-in capabilities (with screenshot preview links where applicable)
  $scope.additionalFeatures = [
    { icon: '🗓️', title: '30-Day Bills Calendar', desc: 'Merges recurring expenses, subscriptions, card dues, and loan EMIs onto one timeline with shortfall warnings.', img: 'bills_calendar.png' },
    { icon: '💰', title: 'Money Received Inbox', desc: 'Salary, refunds, and repayments from bank SMS wait cleanly on their own page with auto-income rules.', img: 'money_received.png' },
    { icon: '💯', title: 'Spencheck Score (0–1000)', desc: 'Dynamic Money Habits Score combining budget adherence, savings goals, and tracking streaks.', img: 'health_score.png' },
    { icon: '🏆', title: 'Trophy Room & Challenges', desc: 'Ranks (E → S), badges, No-Spend Day streaks, and Round-Up Savings that sweep spare change to goals.', img: 'gamification.png' },
    { icon: '🎉', title: 'Monthly & Year Wrap', desc: 'Shareable recap cards highlighting your top category, biggest spend, total saved, and no-spend days.', img: 'wrap.png' },
    { icon: '📲', title: 'Home Screen Widget', desc: 'Configure up to 3 one-tap preset buttons on your Android home screen to log coffee or chai without opening the app.', img: 'widget_presets.png' },
    { icon: '📅', title: 'Spend Heatmap Calendar', desc: 'Browse any month as a calendar where dot counts and circle intensity reveal your heaviest spend days.', img: 'calendar_view.png' },
    { icon: '🏷️', title: 'Cross-Category Tags', desc: 'Attach custom tags like #Goa Trip or #Tax Deductible across categories for instant filtering.', img: 'tags.png' },
    { icon: '⚙️', title: 'Customisable Home Layout', desc: 'Drag to reorder or hide any section on your Home dashboard — keep only what you use.', img: 'customize_dashboard.png' },
    { icon: '🧾', title: 'On-Device Receipt OCR', desc: 'Snap a receipt photo and Google ML Kit extracts amount and merchant offline on your phone.', img: 'add_expense.png' },
    { icon: '📥', title: 'CSV & PDF Statement Import', desc: 'Import bank statements locally with duplicate matching against existing expenses and auto-categorisation.', img: 'expenses.png' },
    { icon: '📤', title: 'One-Tap PDF & CSV Export', desc: 'Generate a clean financial PDF report or full transaction CSV via your system share sheet.', img: 'reports.png' }
  ];

  $scope.openAdditionalLightbox = function (item) {
    $scope.$root.openLightbox($scope.additionalFeatures.map(function (f) {
      return { img: f.img, label: f.title, category: 'Included Free', desc: f.desc };
    }), $scope.additionalFeatures.indexOf(item));
  };
}])

// ── GuideController (All 32 Real App Screenshots) ────────
.controller('GuideController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
  $scope.activeGuideTab = 'all';
  $scope.guideSearch = '';

  $scope.setGuideTab = function (id) {
    $scope.activeGuideTab = id;
    $timeout(function () {
      if ($window.SpencheckMotion) $window.SpencheckMotion.refreshReveals();
    }, 60);
  };

  $scope.guideTabs = [
    { id: 'all',       label: 'All 32 Screens' },
    { id: 'tracking',  label: '💸 Tracking & SMS' },
    { id: 'budgets',   label: '🎯 Budgets & Habits' },
    { id: 'reports',   label: '📊 Reports & Wraps' },
    { id: 'money',     label: '💳 Money & Wealth' },
    { id: 'social_ai', label: '🤖 Social & AI' },
    { id: 'security',  label: '🔐 Security & Setup' }
  ];

  $scope.guideSections = [
    {
      id: 'tracking',
      label: 'Expense Tracking & SMS',
      title: 'Capture every rupee, manually or automatically',
      glow: 'rgba(139, 155, 255, 0.24)',
      screens: [
        { img: 'dashboard.png',      label: 'Home Dashboard',     category: 'Tracking & SMS', desc: 'Monthly spend total, 14-day sparkline, budget pace, quick shortcuts, and recent activity.' },
        { img: 'expenses.png',       label: 'Activity Feed',      category: 'Tracking & SMS', desc: 'Expenses and income grouped by day with instant search, filter chips, and daily totals.' },
        { img: 'add_expense.png',    label: 'Add Expense',        category: 'Tracking & SMS', desc: 'Log spend in under 5 seconds with UPI app tracking, cashback, GST slabs, tags, and receipt OCR.' },
        { img: 'calendar_view.png',  label: 'Spend Heatmap',      category: 'Tracking & SMS', desc: 'Month calendar with spending intensity circles — tap any day to inspect its transactions.' },
        { img: 'sms_detect.png',     label: 'SMS Review',         category: 'Tracking & SMS', desc: 'Android bank & UPI alerts parsed on-device across 35+ banks with card/wallet matching.' },
        { img: 'money_received.png', label: 'Money Received',     category: 'Tracking & SMS', desc: 'Incoming salary, refunds, and repayments separated cleanly from spending alerts.' },
        { img: 'tags.png',           label: 'Custom Tags',        category: 'Tracking & SMS', desc: 'Cross-category tags with live usage counts for trips, reimbursements, and tax tracking.' }
      ]
    },
    {
      id: 'budgets',
      label: 'Budgets, Bills & Habits',
      title: 'Stay on track without spreadsheets',
      glow: 'rgba(247, 144, 9, 0.22)',
      screens: [
        { img: 'budgets.png',        label: 'Smart Budgets',      category: 'Budgets & Habits', desc: 'Monthly, weekly, and per-category caps with color-coded progress rings and daily pace.' },
        { img: 'bills_calendar.png', label: 'Upcoming Bills',     category: 'Budgets & Habits', desc: '30-day calendar of recurring bills, subscriptions, card dues, and EMIs with wallet projection.' },
        { img: 'recurring.png',      label: 'Recurring Rules',    category: 'Budgets & Habits', desc: 'Automate monthly rent and utilities with pause and skip-this-month controls.' },
        { img: 'subscriptions.png',  label: 'Subscriptions',      category: 'Budgets & Habits', desc: 'Track Netflix, Spotify, and SaaS renewals with combined monthly cost and due alerts.' },
        { img: 'goals.png',          label: 'Savings Goals',      category: 'Budgets & Habits', desc: 'Named savings targets with progress bars, target dates, and manual top-ups.' },
        { img: 'challenges.png',     label: 'Savings Challenges', category: 'Budgets & Habits', desc: 'No-Spend Day streaks and Round-Up Savings swept automatically into your goals.' },
        { img: 'health_score.png',   label: 'Spencheck Score',    category: 'Budgets & Habits', desc: '0–1000 Money Habits Score breaking down budget adherence, savings, and emergency buffer.' },
        { img: 'gamification.png',   label: 'Trophy Room',        category: 'Budgets & Habits', desc: 'Instrument-style E→S rank gauge, XP levels, badges, and daily streaks.' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Wraps',
      title: 'Understand every trend and milestone',
      glow: 'rgba(18, 183, 106, 0.22)',
      screens: [
        { img: 'reports.png',  label: 'Reports',      category: 'Reports & Wraps', desc: 'Week, Month, Year, and FY summaries with 6-period drill-down charts and PDF/CSV export.' },
        { img: 'insights.png', label: 'Insights',     category: 'Reports & Wraps', desc: 'Auto-detected category spikes, busiest spend day, month-over-month comparison, and streaks.' },
        { img: 'wrap.png',     label: 'Monthly Wrap', category: 'Reports & Wraps', desc: 'Shareable Monthly Wrap (and December Year Wrapped) spotlighting your wins and savings.' }
      ]
    },
    {
      id: 'money',
      label: 'Cards, Lending & Wealth',
      title: 'Your entire financial picture in one place',
      glow: 'rgba(240, 68, 56, 0.2)',
      screens: [
        { img: 'cards.png',       label: 'Credit Cards',   category: 'Money & Wealth', desc: 'Bank-card visuals with outstanding balance, utilisation bar, billing cut, and due date.' },
        { img: 'wallets.png',     label: 'Wallets',        category: 'Money & Wealth', desc: 'Bank, cash, and UPI wallets with live balances that update with every expense or transfer.' },
        { img: 'lendings.png',    label: 'People Ledger',  category: 'Money & Wealth', desc: 'See who owes you and what you owe, with one-tap WhatsApp UPI payment reminders.' },
        { img: 'split_bill.png',  label: 'Split Bill',     category: 'Money & Wealth', desc: 'Divide any bill equally or by custom amounts and sync shares straight to Lending.' },
        { img: 'investments.png', label: 'Investments',    category: 'Money & Wealth', desc: 'Track Mutual Funds, Gold/SGB, PPF, FD, RD, and Stocks with live gain/loss percentages.' },
        { img: 'emi.png',         label: 'Loans & EMIs',   category: 'Money & Wealth', desc: 'Track Home, Car, and Personal loans with reducing-balance EMI and amortisation schedules.' },
        { img: 'networth.png',    label: 'Net Worth',      category: 'Money & Wealth', desc: 'Live assets minus liabilities summary combining wallets, goals, investments, cards, and loans.' }
      ]
    },
    {
      id: 'social_ai',
      label: 'Social, Chat & AI',
      title: 'Split with friends or ask your offline assistant',
      glow: 'rgba(158, 119, 237, 0.24)',
      screens: [
        { img: 'social.png',     label: 'Social Inbox',    category: 'Social & AI', desc: 'Friends list and 1:1 or group chats — completely optional, private from your money data.' },
        { img: 'chat_split.png', label: 'In-Chat Splits',  category: 'Social & AI', desc: 'Interactive split & settlement cards directly inside group chats with one-tap Lending sync.' },
        { img: 'chat.png',       label: 'Ask Spencheck',   category: 'Social & AI', desc: 'Offline natural-language assistant with inline category donut charts + optional BYO AI key.' },
        { img: 'reminders.png',  label: 'Reminders',       category: 'Social & AI', desc: 'One-off or repeating reminders for bills, collections, and SIPs — creatable via chat too.' }
      ]
    },
    {
      id: 'security',
      label: 'Security & Personalisation',
      title: 'Built to stay private and feel yours',
      glow: 'rgba(139, 155, 255, 0.22)',
      screens: [
        { img: 'pin_lock.png',            label: 'PIN & Biometric Lock', category: 'Security & Setup', desc: '4–12 digit keystore-backed PIN with fingerprint/face unlock and brute-force lockout.' },
        { img: 'widget_presets.png',      label: 'Home Screen Widget',   category: 'Security & Setup', desc: 'Configure 3 one-tap quick-add presets for your Android home screen widget.' },
        { img: 'customize_dashboard.png', label: 'Customise Home',       category: 'Security & Setup', desc: 'Reorder or hide sections on your Home dashboard to match your workflow.' }
      ]
    }
  ];

  $scope.allFlatScreens = [];
  $scope.guideSections.forEach(function (sec) {
    sec.screens.forEach(function (s) {
      $scope.allFlatScreens.push(s);
    });
  });

  $scope.matchesSearch = function (s) {
    var q = ($scope.guideSearch || '').trim().toLowerCase();
    if (!q) return true;
    return s.label.toLowerCase().indexOf(q) !== -1 ||
           s.desc.toLowerCase().indexOf(q) !== -1 ||
           s.category.toLowerCase().indexOf(q) !== -1;
  };

  $scope.filteredScreens = function (sec) {
    return sec.screens.filter($scope.matchesSearch);
  };

  $scope.hasAnyResults = function () {
    return $scope.guideSections.some(function (sec) {
      return ($scope.activeGuideTab === 'all' || $scope.activeGuideTab === sec.id) &&
             $scope.filteredScreens(sec).length > 0;
    });
  };

  $scope.openGuideLightbox = function (screen) {
    var idx = $scope.allFlatScreens.indexOf(screen);
    $scope.$root.openLightbox($scope.allFlatScreens, idx >= 0 ? idx : 0);
  };
}])

// ── PricingController ────────────────────────────────────
.controller('PricingController', ['$scope', function ($scope) {
  $scope.freeFeatures = [
    'Unlimited expense & income logging',
    'On-device SMS auto-detection (35+ Indian banks)',
    'Money received review & auto-salary rules',
    'Monthly, weekly & per-category budgets',
    '30-day Upcoming Bills Calendar & shortfall alerts',
    'Named savings goals, challenges & Trophy Room',
    'People lending ledger & bill splitting',
    'Friends & group chat with in-chat bill splits',
    'Credit card manager & cashback tracking',
    'Loans, EMIs & investment portfolio + Net Worth',
    'Reports (Week/Month/Year/FY) + PDF/CSV export',
    'Offline AI chat assistant + inline charts',
    'On-device receipt OCR & CSV/PDF statement import',
    'Android home-screen quick-add widget',
    'AES-256 SQLCipher DB, PIN & biometric lock'
  ];

  $scope.optionalFeatures = [
    'Firebase cloud backup & restore (encrypted passphrase option)',
    'Bring-your-own Gemini or ChatGPT API key for open-ended AI chats',
    'Google or email sign-in — only needed for backup or Friends & chat'
  ];

  $scope.faqs = [
    {
      q: 'Is Spencheck really 100% free?',
      a: 'Yes. Every single screen and feature listed here is free with no time limit, no ads, and no pro tier.',
      open: false
    },
    {
      q: 'What does "optional cloud backup" mean?',
      a: 'By default all your financial data stays in an encrypted local SQLite database on your phone. If you want cross-device backup, you can sign in and push a snapshot to Firebase — even encrypted with your own passphrase.',
      open: false
    },
    {
      q: 'Do I need a Gemini or ChatGPT API key?',
      a: 'No. Standard commands (adding expenses, setting reminders, checking budgets, lending summaries, and weekly charts) run offline on-device. A user-supplied key is only for open-ended AI questions.',
      open: false
    }
  ];
}])

// ── FaqController ────────────────────────────────────────
.controller('FaqController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
  $scope.activeCategory = 'all';
  $scope.faqSearch = '';

  $scope.categories = [
    { id: 'all',      label: 'All Topics',     icon: '✨' },
    { id: 'general',  label: 'General',        icon: '❓' },
    { id: 'expenses', label: 'Expenses & SMS', icon: '💸' },
    { id: 'budgets',  label: 'Budgets & Bills',icon: '🎯' },
    { id: 'ai',       label: 'AI Assistant',   icon: '🤖' },
    { id: 'social',   label: 'Friends & Chat', icon: '💬' },
    { id: 'privacy',  label: 'Privacy & Data', icon: '🔒' },
    { id: 'sync',     label: 'Cloud Backup',   icon: '☁️' }
  ];

  $scope.setCategory = function (id) {
    $scope.activeCategory = id;
    $timeout(function () {
      if ($window.SpencheckMotion) $window.SpencheckMotion.refreshReveals();
    }, 60);
  };

  $scope.toggle = function (item) {
    item.open = !item.open;
  };

  $scope.sections = [
    {
      id: 'general',
      title: 'General',
      icon: '❓',
      items: [
        { q: 'What is Spencheck?', a: 'Spencheck is an offline-first personal finance app for Android built for India — tracking daily expenses, SMS bank alerts, budgets, upcoming bills, credit cards, lending, loans, investments, and optional friend splits in one place.', open: true },
        { q: 'Is Spencheck free?', a: 'Yes, completely. Every feature is free with no subscription, no paywall, and no ads.', open: false },
        { q: 'Do I need to create an account?', a: 'No. You can track expenses, budgets, cards, loans, and investments offline with zero sign-in. An account is only required for optional Cloud backup or Friends & chat.', open: false },
        { q: 'Is there a home screen widget?', a: 'Yes, on Android. Configure up to 3 quick-add buttons (like ₹50 Food or ₹180 Transport) and tap directly from your home screen to log without opening the app.', open: false }
      ]
    },
    {
      id: 'expenses',
      title: 'Expenses & SMS Detection',
      icon: '💸',
      items: [
        { q: 'How does SMS auto-detection work?', a: 'On Android, an on-device regex engine tuned for 35+ Indian banks reads debit and credit alerts locally. Trusted purchases can auto-add to Expenses with an undo option; uncertain alerts wait in SMS Review. Nothing leaves your phone.', open: false },
        { q: 'What is the Money Received screen?', a: 'Incoming bank credits (salary, refunds, friend repayments, self-transfers) land on their own Money Received screen so they never clutter expense review. You choose whether to record each as income, repayment, or refund.', open: false },
        { q: 'How does auto-categorisation work?', a: 'Spencheck checks your custom keyword rules first, then your confirmed merchant history, then its built-in Indian merchant dictionary (Swiggy, Zomato, Blinkit, Uber, etc.).', open: false },
        { q: 'Can I import CSV or PDF bank statements?', a: 'Yes. Go to More → Import bank statement. Statements are parsed locally on-device and matched against existing expenses to avoid duplicates.', open: false }
      ]
    },
    {
      id: 'budgets',
      title: 'Budgets, Bills & Wealth',
      icon: '🎯',
      items: [
        { q: 'What is the Upcoming Bills Calendar?', a: 'More → Bills merges your recurring expenses, active subscriptions, credit card dues, and loan EMIs into a single 30-day timeline, projecting your wallet balances after every payment.', open: false },
        { q: 'How does the Spencheck Health Score work?', a: 'It computes a 0–1000 score from your budget adherence, savings goal progress, and daily tracking streak — helping you monitor financial consistency at a glance.', open: false },
        { q: 'What investments and loans are supported?', a: 'Track Mutual Funds, Stocks, Gold/SGB, FD, RD, and PPF alongside Home, Car, and Personal loans with full reducing-balance EMI amortisation schedules and live Net Worth.', open: false }
      ]
    },
    {
      id: 'ai',
      title: 'AI Chat Assistant',
      icon: '🤖',
      items: [
        { q: 'Does Ask Spencheck work offline?', a: 'Yes. Common commands ("Add ₹450 for groceries", "Lent ₹500 to Rahul", "Remind me to pay rent on the 5th") and summaries with inline charts work completely offline.', open: false },
        { q: 'How does Bring-Your-Own API key work?', a: 'If you paste your own Gemini or ChatGPT key in Settings, open-ended questions use real app tool calls via your key directly with Google or OpenAI. Without a key, everything stays 100% on-device.', open: false }
      ]
    },
    {
      id: 'social',
      title: 'Friends & In-Chat Splits',
      icon: '💬',
      items: [
        { q: 'Can friends see my expenses or balances?', a: 'Never. Friends only see your display name, @username, and messages or split cards you explicitly share in a chat. Your personal ledger stays private on your phone.', open: false },
        { q: 'How do in-chat bill splits work?', a: 'Tap Split a Bill inside any chat, pick equal or custom shares, and post the card. Friends tap Mark Paid when settled, and you can record it into Lending with one tap.', open: false }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: '🔒',
      items: [
        { q: 'How is my local data protected?', a: 'Local financial data is stored in an AES-256 SQLCipher encrypted database on your phone. PIN and biometric credentials live in your device hardware keystore, and Android screenshot/recents blocking is enabled by default.', open: false },
        { q: 'How do I permanently delete my data?', a: 'Use More → Clear all data locally, More → Delete account inside the app, or visit delete-account.html on this website to wipe all cloud data and your account in one step.', open: false }
      ]
    },
    {
      id: 'sync',
      title: 'Cloud Backup & Restore',
      icon: '☁️',
      items: [
        { q: 'Can I encrypt my cloud backup?', a: 'Yes. In Cloud Backup you can set a backup passphrase so your snapshot is encrypted on your phone before upload, backed by a recovery code.', open: false },
        { q: 'Is auto-backup available?', a: 'Yes — toggle Daily or Weekly Auto Backup once signed in. Your SMS scan history always stays device-only.', open: false }
      ]
    }
  ];

  $scope.visibleSections = function () {
    var q = ($scope.faqSearch || '').trim().toLowerCase();
    return $scope.sections.filter(function (s) {
      if ($scope.activeCategory !== 'all' && s.id !== $scope.activeCategory) return false;
      if (!q) return true;
      return s.items.some(function (i) {
        return i.q.toLowerCase().indexOf(q) !== -1 || i.a.toLowerCase().indexOf(q) !== -1;
      });
    }).map(function (s) {
      if (!q) return s;
      return {
        id: s.id,
        title: s.title,
        icon: s.icon,
        items: s.items.filter(function (i) {
          return i.q.toLowerCase().indexOf(q) !== -1 || i.a.toLowerCase().indexOf(q) !== -1;
        })
      };
    });
  };
}])

// ── DownloadController ───────────────────────────────────
.controller('DownloadController', ['$scope', function ($scope) {
  $scope.requirements = [
    { icon: '📱', label: 'Android 6.0+', sub: 'Minimum OS version' },
    { icon: '💾', label: 'Offline-first', sub: 'AES-256 encrypted local DB' },
    { icon: '💸', label: '₹0 Forever', sub: 'Zero ads or subscriptions' }
  ];

  $scope.previewItem = [{
    img: 'dashboard.png',
    label: 'Spencheck Home',
    category: 'Android App',
    desc: 'Premium Dark design with instant spend tracking, budget pace, shortcuts, and recent activity.'
  }];
}]);
