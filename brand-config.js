window.ZONE_CONFIG = {
  brand: {
    name: 'ZONE SPORT',
    arabicName: 'زون سبورت',
    tagline: 'نبض الرياضة.. في قلب الحدث',
    colors: {
      navy: '#0A1128',
      blue: '#1C2541',
      white: '#FFFFFF',
      gold: '#D4AF37',
      red: '#E63946',
      slate: '#53607A',
      mist: '#E8ECF5'
    },
    fonts: {
      display: '"Tajawal", "Arial", sans-serif',
      body: '"Tajawal", "Arial", sans-serif',
      latin: 'Arial, sans-serif'
    },
    defaults: { logoSize: 90, logoOpacity: 100, shadowOpacity: 66, shadowCoverage: 75, shadowDirection: 'bottom-top', shadowBlur: 60 }
  },
  categories: [
    { id: 'breaking', label: 'عاجل', icon: '⚡', color: '#E63946' },
    { id: 'ahly', label: 'الأهلي', icon: '◆', color: '#D4AF37' },
    { id: 'quote', label: 'تصريحات', icon: '❞', color: '#D4AF37' },
    { id: 'transfer', label: 'انتقالات', icon: '⇄', color: '#4FA3FF' },
    { id: 'result', label: 'نتائج', icon: '◈', color: '#53D18B' },
    { id: 'injury', label: 'إصابات', icon: '✚', color: '#FF8B6A' },
    { id: 'rumor', label: 'شائعات', icon: '◌', color: '#B58CFF' },
    { id: 'stats', label: 'إحصائيات', icon: '▥', color: '#5BD9D1' },
    { id: 'sport', label: 'أخبار رياضية', icon: '●', color: '#A9B4CA' }
  ],
  templates: {
    quote: { label: 'تصريحات', kicker: 'تصريحات خاصة', symbol: '❞', accent: '#D4AF37', layout: 'quote' },
    breaking: { label: 'عاجل', kicker: 'عاجل', symbol: '⚡', accent: '#E63946', layout: 'breaking' },
    result: { label: 'نتائج', kicker: 'نتيجة المباراة', symbol: '◈', accent: '#53D18B', layout: 'result' },
    transfer: { label: 'انتقالات', kicker: 'سوق الانتقالات', symbol: '⇄', accent: '#4FA3FF', layout: 'transfer' },
    ahly: { label: 'الأهلي', kicker: 'أخبار النادي الأهلي', symbol: '◆', accent: '#D4AF37', layout: 'club' },
    injury: { label: 'إصابات', kicker: 'تحديث طبي', symbol: '✚', accent: '#FF8B6A', layout: 'injury' },
    matchday: { label: 'مباراة قادمة', kicker: 'المباراة القادمة', symbol: '◷', accent: '#53D18B', layout: 'matchday' },
    player: { label: 'أخبار اللاعبين', kicker: 'من قلب الملعب', symbol: '●', accent: '#A9B4CA', layout: 'player' },
    rumor: { label: 'الشائعات', kicker: 'متداول الآن', symbol: '◌', accent: '#B58CFF', layout: 'rumor' },
    stats: { label: 'الإحصائيات', kicker: 'أرقام تتحدث', symbol: '▥', accent: '#5BD9D1', layout: 'stats' },
    sport: { label: 'أخبار رياضية', kicker: 'أخبار رياضية', symbol: '●', accent: '#A9B4CA', layout: 'sport' }
  },
  variations: {
    editorial: { label: 'تحريري', name: 'EDITORIAL', description: 'نظيف ومتوازن', overlay: 0.66, pattern: 0.16 },
    cinematic: { label: 'سينمائي', name: 'CINEMATIC', description: 'عميق ودرامي', overlay: 0.78, pattern: 0.28 },
    sport: { label: 'رياضي / عاجل', name: 'SPORT BREAKING', description: 'حاد وسريع', overlay: 0.58, pattern: 0.22 }
  },
  keywords: {
    breaking: ['عاجل', 'الآن', 'طارئ', 'خبر عاجل'],
    transfer: ['انتقال', 'ينضم', 'صفقة', 'تعاقد', 'رحيل', 'عرض'],
    injury: ['إصابة', 'مصاب', 'يغيب', 'الركبة', 'العضلة', 'تأهيل'],
    quote: ['تصريحات', 'قال', 'أكد', 'أوضح', 'يكشف', 'أضاف'],
    result: ['نتيجة', 'فاز', 'انتهت', 'تعادل', 'هدف', 'مباراة'],
    stats: ['إحصائيات', 'رقم', 'أرقام', 'الأكثر', 'ترتيب', 'نسبة'],
    rumor: ['شائعات', 'متداول', 'أنباء', 'يقال', 'مصدر', 'مفاجأة'],
    ahly: ['الأهلي', 'المارد الأحمر', 'القلعة الحمراء']
  }
};