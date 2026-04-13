// ─── Component Definitions ───

const COMPONENT_TYPES = {
  navbar:     { label: 'Navigation Bar', icon: '═══', css: 'comp-navbar', defaultW: 12, defaultH: 2, text: '☰  App Name' },
  hero:       { label: 'Hero Banner', icon: '◆', css: 'comp-hero', defaultW: 12, defaultH: 6, text: 'Hero Section' },
  button:     { label: 'Primary Button', icon: '▣', css: 'comp-button', defaultW: 6, defaultH: 2, text: 'Get Started' },
  buttonSec:  { label: 'Secondary Button', icon: '▢', css: 'comp-button-secondary', defaultW: 6, defaultH: 2, text: 'Learn More' },
  input:      { label: 'Text Input', icon: '▁▁', css: 'comp-input', defaultW: 10, defaultH: 2, text: 'Enter email...' },
  heading:    { label: 'Heading', icon: 'H', css: 'comp-heading', defaultW: 10, defaultH: 2, text: 'Welcome Back' },
  text:       { label: 'Body Text', icon: 'T', css: 'comp-text', defaultW: 10, defaultH: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing.' },
  image:      { label: 'Image', icon: '🖼', css: 'comp-image', defaultW: 10, defaultH: 6, text: '🖼' },
  card:       { label: 'Card', icon: '▭', css: 'comp-card', defaultW: 5, defaultH: 5, text: '' },
  list:       { label: 'List', icon: '≡', css: 'comp-list', defaultW: 10, defaultH: 6, text: 'Item 1\nItem 2\nItem 3' },
  icon:       { label: 'Icon', icon: '◉', css: 'comp-icon', defaultW: 2, defaultH: 2, text: '⚡' },
  divider:    { label: 'Divider', icon: '—', css: 'comp-divider', defaultW: 10, defaultH: 1, text: '' },
  tabBar:     { label: 'Tab Bar', icon: '▔▔▔', css: 'comp-tab-bar', defaultW: 12, defaultH: 2, text: '🏠  🔍  👤  ⚙' },
  avatar:     { label: 'Avatar', icon: '●', css: 'comp-avatar', defaultW: 2, defaultH: 2, text: '👤' },
  toggle:     { label: 'Toggle', icon: '◑', css: 'comp-toggle', defaultW: 3, defaultH: 1, text: '' },
  search:     { label: 'Search Bar', icon: '🔍', css: 'comp-search', defaultW: 10, defaultH: 2, text: '🔍  Search...' },
  footer:     { label: 'Footer', icon: '▬▬', css: 'comp-footer', defaultW: 12, defaultH: 2, text: '© 2026 AppName' },
  map:        { label: 'Map View', icon: '🗺', css: 'comp-map', defaultW: 12, defaultH: 8, text: '📍 Map View' },
  chart:      { label: 'Chart', icon: '📊', css: 'comp-chart', defaultW: 10, defaultH: 6, text: '📊' },
  logo:       { label: 'Logo', icon: '◈', css: 'comp-logo', defaultW: 4, defaultH: 2, text: '◈ BRAND' },
  badge:      { label: 'Badge', icon: '●', css: 'comp-badge', defaultW: 2, defaultH: 1, text: '3' },
  sidebar:    { label: 'Sidebar', icon: '▌▌', css: 'comp-sidebar', defaultW: 3, defaultH: 12, text: 'Nav' },
};


// ═══════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════
//
// Each level now includes:
//   components[]     — what the player drags onto the canvas
//     .zone          — valid region { colMin, colMax, rowMin, rowMax } (generous, multiple correct positions)
//     .idealZone     — legacy fallback; auto-expanded to zone with ±2 tolerance
//   flowOrder[]      — IDs in expected top-to-bottom reading order
//   semanticGroups[] — clusters of related components that should be near each other
//   constraints[]    — structural rules that must hold (above, below, fullWidth, etc.)
//   conventions[]    — where users universally expect certain elements
//   goldenPath[]     — the user's task sequence for scanning (most important for UX)
//   primaryCTA       — the ID of the main call-to-action button

const LEVELS = [

  // ─── LEVEL 1: Simple Login ───
  {
    id: 1,
    client: 'FreshStart App',
    projectType: 'LOGIN SCREEN',
    screenName: 'Login — 375×812',
    gridCols: 12,
    gridRows: 20,
    canvasW: 340,
    canvasH: 620,
    description: 'We need a clean, simple login screen. Logo at top, email and password fields, a big sign-in button, and a "Forgot password?" link at the bottom.',
    requirements: [
      'Logo centered near the top',
      'Heading that says "Welcome Back"',
      'Email input field',
      'Password input field',
      'Primary sign-in button below inputs',
      'Small text link for "Forgot password?"',
    ],
    primaryCTA: 'signin',

    components: [
      { type: 'logo',    id: 'logo1',    label: '◈ FreshStart', text: '◈ FreshStart', w: 6, h: 2,
        zone: { colMin: 1, colMax: 11, rowMin: 0, rowMax: 5 },
        idealZone: { col: 3, row: 2, w: 6, h: 2 }, required: true },
      { type: 'heading', id: 'heading1', label: 'Welcome Back', text: 'Welcome Back', w: 8, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 8 },
        idealZone: { col: 2, row: 5, w: 8, h: 2 }, required: true },
      { type: 'input',   id: 'email',    label: 'Email Input',  text: 'Email address', w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 5, rowMax: 14 },
        idealZone: { col: 1, row: 8, w: 10, h: 2 }, required: true },
      { type: 'input',   id: 'password', label: 'Password Input', text: 'Password', w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 7, rowMax: 16 },
        idealZone: { col: 1, row: 11, w: 10, h: 2 }, required: true },
      { type: 'button',  id: 'signin',   label: 'Sign In Button', text: 'Sign In', w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 10, rowMax: 18 },
        idealZone: { col: 1, row: 14, w: 10, h: 2 }, required: true },
      { type: 'text',    id: 'forgot',   label: 'Forgot Password?', text: 'Forgot password?', w: 6, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 13, rowMax: 20 },
        idealZone: { col: 3, row: 17, w: 6, h: 1 }, required: true },
    ],

    flowOrder: ['logo1', 'heading1', 'email', 'password', 'signin', 'forgot'],

    semanticGroups: [
      { ids: ['email', 'password'], label: 'Form fields', maxDist: 5 },
      { ids: ['email', 'password', 'signin'], label: 'Login form', maxDist: 8 },
    ],

    constraints: [
      { type: 'above', a: 'logo1', b: 'heading1' },
      { type: 'above', a: 'heading1', b: 'email' },
      { type: 'above', a: 'email', b: 'password' },
      { type: 'above', a: 'password', b: 'signin' },
      { type: 'above', a: 'signin', b: 'forgot' },
      { type: 'centered', a: 'logo1' },
      { type: 'centered', a: 'signin' },
    ],

    conventions: [
      { id: 'logo1',   expect: 'top' },
      { id: 'signin',  expect: 'prominent' },
      { id: 'heading1', expect: 'center' },
    ],

    goldenPath: [
      { id: 'logo1',    step: 'See brand' },
      { id: 'heading1', step: 'Understand context' },
      { id: 'email',    step: 'Enter email' },
      { id: 'password', step: 'Enter password' },
      { id: 'signin',   step: 'Submit' },
      { id: 'forgot',   step: 'Recovery option' },
    ],

    feedback: {
      s: '"This is exactly what we envisioned. Clean, intuitive, perfect hierarchy. Ship it."',
      a: '"Great layout! The flow feels natural. Minor spacing tweaks and this is golden."',
      b: '"Solid work. A few things feel slightly off but the bones are there."',
      c: '"It\'s... functional? Some placements don\'t feel intuitive though."',
      d: '"Our users would be confused by this layout. Back to the drawing board."',
      f: '"Did you even read the brief? This is a mess."',
    },
  },

  // ─── LEVEL 2: Social Profile ───
  {
    id: 2,
    client: 'Chirp Social',
    projectType: 'USER PROFILE',
    screenName: 'Profile — 375×812',
    gridCols: 12,
    gridRows: 22,
    canvasW: 340,
    canvasH: 680,
    description: 'Design a social media profile page. We need a cover image at top, avatar overlapping it, username, bio text, a follow button, and a content feed area below.',
    requirements: [
      'Cover image spanning full width at top',
      'Avatar overlapping the cover image',
      'Username heading below avatar',
      'Bio text under the name',
      'Follow button, prominent placement',
      'Divider separating profile from content',
      'Content cards in the feed area',
      'Tab bar at the bottom',
    ],
    primaryCTA: 'follow',

    components: [
      { type: 'image',   id: 'cover',   label: 'Cover Photo',    text: '🖼',  w: 12, h: 5,
        zone: { colMin: 0, colMax: 12, rowMin: 0, rowMax: 6 },
        idealZone: { col: 0, row: 0, w: 12, h: 5 }, required: true },
      { type: 'avatar',  id: 'avatar1', label: 'Profile Avatar', text: '👤', w: 3, h: 3,
        zone: { colMin: 2, colMax: 10, rowMin: 2, rowMax: 8 },
        idealZone: { col: 4, row: 3, w: 3, h: 3 }, required: true },
      { type: 'heading', id: 'username', label: 'Username', text: '@janedoe', w: 8, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 5, rowMax: 11 },
        idealZone: { col: 2, row: 7, w: 8, h: 2 }, required: true },
      { type: 'text',    id: 'bio',     label: 'Bio Text', text: 'Designer. Dog person. Coffee enthusiast ☕', w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 7, rowMax: 13 },
        idealZone: { col: 1, row: 9, w: 10, h: 2 }, required: true },
      { type: 'button',  id: 'follow',  label: 'Follow Button', text: 'Follow', w: 6, h: 2,
        zone: { colMin: 1, colMax: 11, rowMin: 9, rowMax: 15 },
        idealZone: { col: 3, row: 11, w: 6, h: 2 }, required: true },
      { type: 'divider', id: 'div1',    label: 'Divider', text: '', w: 10, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 11, rowMax: 16 },
        idealZone: { col: 1, row: 13, w: 10, h: 1 }, required: true },
      { type: 'card',    id: 'post1',   label: 'Post Card 1', text: '📸 Photo Post', w: 11, h: 4,
        zone: { colMin: 0, colMax: 12, rowMin: 12, rowMax: 20 },
        idealZone: { col: 0, row: 14, w: 11, h: 4 }, required: true },
      { type: 'card',    id: 'post2',   label: 'Post Card 2', text: '📝 Text Post', w: 11, h: 3,
        zone: { colMin: 0, colMax: 12, rowMin: 15, rowMax: 22 },
        idealZone: { col: 0, row: 18, w: 11, h: 3 }, required: false },
      { type: 'tabBar',  id: 'tabs',    label: 'Tab Bar', text: '🏠  🔍  ➕  ❤  👤', w: 12, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 18, rowMax: 22 },
        idealZone: { col: 0, row: 20, w: 12, h: 2 }, required: true },
    ],

    flowOrder: ['cover', 'avatar1', 'username', 'bio', 'follow', 'div1', 'post1', 'post2', 'tabs'],

    semanticGroups: [
      { ids: ['avatar1', 'username', 'bio'], label: 'Profile info', maxDist: 6 },
      { ids: ['post1', 'post2'], label: 'Feed content', maxDist: 6 },
    ],

    constraints: [
      { type: 'above', a: 'cover', b: 'username' },
      { type: 'above', a: 'username', b: 'bio' },
      { type: 'above', a: 'bio', b: 'follow' },
      { type: 'above', a: 'follow', b: 'div1' },
      { type: 'above', a: 'div1', b: 'post1' },
      { type: 'fullWidth', a: 'cover' },
      { type: 'fullWidth', a: 'tabs' },
      { type: 'bottomRegion', a: 'tabs' },
      { type: 'centered', a: 'avatar1' },
      { type: 'centered', a: 'username' },
    ],

    conventions: [
      { id: 'cover',   expect: 'top' },
      { id: 'cover',   expect: 'fullWidth' },
      { id: 'tabs',    expect: 'bottom' },
      { id: 'follow',  expect: 'center' },
      { id: 'avatar1', expect: 'center' },
    ],

    goldenPath: [
      { id: 'cover',    step: 'See cover photo' },
      { id: 'avatar1',  step: 'See who this is' },
      { id: 'username', step: 'Read name' },
      { id: 'bio',      step: 'Read bio' },
      { id: 'follow',   step: 'Decide to follow' },
      { id: 'post1',    step: 'Browse content' },
    ],

    feedback: {
      s: '"Wow, this feels like a real app already. The avatar placement is *chef\'s kiss*."',
      a: '"Really clean profile layout. Users will feel right at home."',
      b: '"Good structure. The hierarchy mostly works, just tighten up a few spots."',
      c: '"The profile elements are there but the layout feels disjointed."',
      d: '"I can\'t tell where the profile ends and the feed begins."',
      f: '"This looks like someone threw components at a wall. Revision needed."',
    },
  },

  // ─── LEVEL 3: E-Commerce Product ───
  {
    id: 3,
    client: 'Shoply',
    projectType: 'PRODUCT PAGE',
    screenName: 'Product Detail — 375×900',
    gridCols: 12,
    gridRows: 26,
    canvasW: 340,
    canvasH: 760,
    description: 'Product detail page for our e-commerce app. Large product image, price, title, description, size/color selectors, Add to Cart button, and related items at bottom.',
    requirements: [
      'Navigation bar at top',
      'Large product image at top',
      'Product title (heading)',
      'Price display, prominent',
      'Product description text',
      'Size selectors in a row',
      'Add to Cart button — must be very prominent',
      'Divider before related items',
      'Related product cards at bottom',
    ],
    primaryCTA: 'addcart',

    components: [
      { type: 'navbar',  id: 'nav1',          label: 'Top Nav',       text: '← Shoply       🛒', w: 12, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 0, rowMax: 3 },
        idealZone: { col: 0, row: 0, w: 12, h: 2 }, required: true },
      { type: 'image',   id: 'product_img',   label: 'Product Image', text: '👟',               w: 12, h: 8,
        zone: { colMin: 0, colMax: 12, rowMin: 1, rowMax: 12 },
        idealZone: { col: 0, row: 2, w: 12, h: 8 }, required: true },
      { type: 'heading', id: 'product_title',  label: 'Product Title', text: 'Air Max Pulse',    w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 8, rowMax: 16 },
        idealZone: { col: 1, row: 10, w: 10, h: 2 }, required: true },
      { type: 'heading', id: 'price',          label: 'Price',         text: '$149.99',          w: 4, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 9, rowMax: 17 },
        idealZone: { col: 1, row: 12, w: 4, h: 2 }, required: true },
      { type: 'text',    id: 'desc',           label: 'Description',   text: 'Inspired by the original Air Max, bringing you the next level of comfort.', w: 10, h: 3,
        zone: { colMin: 0, colMax: 12, rowMin: 11, rowMax: 20 },
        idealZone: { col: 1, row: 14, w: 10, h: 3 }, required: true },
      { type: 'toggle',  id: 'size_s',         label: 'Size S',        text: 'S',                w: 2, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 14, rowMax: 21 },
        idealZone: { col: 1, row: 17, w: 2, h: 1 }, required: false },
      { type: 'toggle',  id: 'size_m',         label: 'Size M',        text: 'M',                w: 2, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 14, rowMax: 21 },
        idealZone: { col: 3, row: 17, w: 2, h: 1 }, required: false },
      { type: 'toggle',  id: 'size_l',         label: 'Size L',        text: 'L',                w: 2, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 14, rowMax: 21 },
        idealZone: { col: 5, row: 17, w: 2, h: 1 }, required: false },
      { type: 'button',  id: 'addcart',        label: 'Add to Cart',   text: '🛒 Add to Cart',  w: 10, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 16, rowMax: 24 },
        idealZone: { col: 1, row: 19, w: 10, h: 2 }, required: true },
      { type: 'divider', id: 'div2',           label: 'Divider',       text: '',                 w: 10, h: 1,
        zone: { colMin: 0, colMax: 12, rowMin: 19, rowMax: 25 },
        idealZone: { col: 1, row: 22, w: 10, h: 1 }, required: true },
      { type: 'card',    id: 'related1',       label: 'Related Item 1', text: '👟 Similar',      w: 5, h: 3,
        zone: { colMin: 0, colMax: 12, rowMin: 20, rowMax: 26 },
        idealZone: { col: 0, row: 23, w: 5, h: 3 }, required: false },
      { type: 'card',    id: 'related2',       label: 'Related Item 2', text: '👟 Similar',      w: 5, h: 3,
        zone: { colMin: 0, colMax: 12, rowMin: 20, rowMax: 26 },
        idealZone: { col: 6, row: 23, w: 5, h: 3 }, required: false },
    ],

    flowOrder: ['nav1', 'product_img', 'product_title', 'price', 'desc', 'size_s', 'addcart', 'div2', 'related1'],

    semanticGroups: [
      { ids: ['product_title', 'price', 'desc'], label: 'Product info', maxDist: 7 },
      { ids: ['size_s', 'size_m', 'size_l'], label: 'Size selectors', maxDist: 4 },
      { ids: ['related1', 'related2'], label: 'Related products', maxDist: 5 },
      { ids: ['desc', 'size_s', 'addcart'], label: 'Purchase flow', maxDist: 8 },
    ],

    constraints: [
      { type: 'above', a: 'nav1', b: 'product_img' },
      { type: 'above', a: 'product_img', b: 'product_title' },
      { type: 'above', a: 'product_title', b: 'addcart' },
      { type: 'above', a: 'addcart', b: 'div2' },
      { type: 'fullWidth', a: 'nav1' },
      { type: 'topRegion', a: 'nav1' },
      { type: 'sameRow', a: 'size_s', b: 'size_m' },
      { type: 'sameRow', a: 'size_m', b: 'size_l' },
    ],

    conventions: [
      { id: 'nav1',         expect: 'top' },
      { id: 'nav1',         expect: 'fullWidth' },
      { id: 'product_img',  expect: 'top' },
      { id: 'addcart',      expect: 'prominent' },
      { id: 'price',        expect: 'leftEdge' },
    ],

    goldenPath: [
      { id: 'product_img',   step: 'See product' },
      { id: 'product_title', step: 'Read name' },
      { id: 'price',         step: 'Check price' },
      { id: 'desc',          step: 'Read details' },
      { id: 'size_s',        step: 'Pick size' },
      { id: 'addcart',       step: 'Add to cart' },
    ],

    feedback: {
      s: '"This is production-ready. The visual hierarchy guides the eye perfectly to that Add to Cart button."',
      a: '"Great product page! The flow from image to price to CTA is smooth."',
      b: '"The layout works but the Add to Cart button could be more prominent."',
      c: '"Users might struggle to find the purchase button. Needs better hierarchy."',
      d: '"The product info is scattered. This would hurt conversion rates."',
      f: '"I wouldn\'t buy a thing from this layout. Complete redo needed."',
    },
  },

  // ─── LEVEL 4: Dashboard ───
  {
    id: 4,
    client: 'DataViz Corp',
    projectType: 'ANALYTICS DASHBOARD',
    screenName: 'Dashboard — 1280×800',
    gridCols: 12,
    gridRows: 18,
    canvasW: 580,
    canvasH: 480,
    description: 'Desktop analytics dashboard. Sidebar navigation on the left, top search bar, 3 metric cards in a row, a large chart below, and a data list at the bottom right.',
    requirements: [
      'Sidebar navigation on the left edge',
      'Search bar at the top',
      'Three metric cards in a horizontal row',
      'Large chart taking up most of the center',
      'Data list/table on the right side',
      'User avatar in the top corner',
    ],
    primaryCTA: null,

    components: [
      { type: 'sidebar', id: 'sidebar',      label: 'Sidebar Nav', text: '📊 DataViz\n━━━\n🏠 Home\n📈 Analytics\n👥 Users\n⚙ Settings', w: 3, h: 18,
        zone: { colMin: 0, colMax: 4, rowMin: 0, rowMax: 18 },
        idealZone: { col: 0, row: 0, w: 3, h: 18 }, required: true },
      { type: 'search',  id: 'search1',      label: 'Search Bar', text: '🔍 Search dashboards...', w: 7, h: 2,
        zone: { colMin: 2, colMax: 12, rowMin: 0, rowMax: 4 },
        idealZone: { col: 3, row: 0, w: 7, h: 2 }, required: true },
      { type: 'avatar',  id: 'user_avatar',  label: 'User Avatar', text: '👤', w: 2, h: 2,
        zone: { colMin: 8, colMax: 12, rowMin: 0, rowMax: 4 },
        idealZone: { col: 10, row: 0, w: 2, h: 2 }, required: true },
      { type: 'card',    id: 'metric1',      label: 'Metric: Users', text: '👥 12,847\nActive Users', w: 3, h: 3,
        zone: { colMin: 2, colMax: 12, rowMin: 2, rowMax: 8 },
        idealZone: { col: 3, row: 3, w: 3, h: 3 }, required: true },
      { type: 'card',    id: 'metric2',      label: 'Metric: Revenue', text: '💰 $48.2K\nRevenue', w: 3, h: 3,
        zone: { colMin: 2, colMax: 12, rowMin: 2, rowMax: 8 },
        idealZone: { col: 6, row: 3, w: 3, h: 3 }, required: true },
      { type: 'card',    id: 'metric3',      label: 'Metric: Growth', text: '📈 +23%\nGrowth', w: 3, h: 3,
        zone: { colMin: 2, colMax: 12, rowMin: 2, rowMax: 8 },
        idealZone: { col: 9, row: 3, w: 3, h: 3 }, required: true },
      { type: 'chart',   id: 'main_chart',   label: 'Revenue Chart', text: '📊 Revenue Over Time', w: 6, h: 8,
        zone: { colMin: 2, colMax: 12, rowMin: 5, rowMax: 18 },
        idealZone: { col: 3, row: 7, w: 6, h: 8 }, required: true },
      { type: 'list',    id: 'data_list',    label: 'Recent Activity', text: '• New signup — 2m ago\n• Purchase — 5m ago\n• Refund — 12m ago', w: 3, h: 8,
        zone: { colMin: 6, colMax: 12, rowMin: 5, rowMax: 18 },
        idealZone: { col: 9, row: 7, w: 3, h: 8 }, required: true },
    ],

    flowOrder: ['sidebar', 'search1', 'user_avatar', 'metric1', 'metric2', 'metric3', 'main_chart', 'data_list'],

    semanticGroups: [
      { ids: ['metric1', 'metric2', 'metric3'], label: 'KPI cards', maxDist: 5 },
      { ids: ['main_chart', 'data_list'], label: 'Data visualization', maxDist: 8 },
      { ids: ['search1', 'user_avatar'], label: 'Top bar', maxDist: 6 },
    ],

    constraints: [
      { type: 'leftOf', a: 'sidebar', b: 'search1' },
      { type: 'leftOf', a: 'sidebar', b: 'metric1' },
      { type: 'sameRow', a: 'metric1', b: 'metric2' },
      { type: 'sameRow', a: 'metric2', b: 'metric3' },
      { type: 'above', a: 'metric1', b: 'main_chart' },
      { type: 'sameRow', a: 'search1', b: 'user_avatar' },
      { type: 'fullWidth', a: 'sidebar' },
    ],

    conventions: [
      { id: 'sidebar',     expect: 'leftEdge' },
      { id: 'sidebar',     expect: 'top' },
      { id: 'search1',     expect: 'top' },
      { id: 'user_avatar', expect: 'topRight' },
    ],

    goldenPath: [
      { id: 'sidebar',   step: 'Orient via navigation' },
      { id: 'search1',   step: 'Find specific data' },
      { id: 'metric1',   step: 'Scan top-level KPIs' },
      { id: 'main_chart', step: 'Analyze trends' },
      { id: 'data_list', step: 'Review recent activity' },
    ],

    feedback: {
      s: '"This dashboard tells a story. The data hierarchy is perfect — execs will love it."',
      a: '"Clean dashboard layout. Information is well-organized and scannable."',
      b: '"The structure is there but some elements feel cramped or misaligned."',
      c: '"Hard to tell what\'s important at a glance. Needs better visual weight."',
      d: '"This dashboard creates more confusion than clarity."',
      f: '"Our analysts would quit if they had to use this layout."',
    },
  },

  // ─── LEVEL 5: Food Delivery ───
  {
    id: 5,
    client: 'NomNom',
    projectType: 'FOOD DELIVERY HOME',
    screenName: 'Home — 375×812',
    gridCols: 12,
    gridRows: 24,
    canvasW: 340,
    canvasH: 700,
    description: 'Home screen for a food delivery app. Search at top, category icons in a row, featured restaurant cards, a promotions banner, and bottom tab navigation.',
    requirements: [
      'Search bar at the very top',
      'Category icons in a horizontal row',
      'Promotional banner (hero)',
      'Restaurant cards — at least 2',
      'Tab bar navigation at bottom',
      'Heading for the restaurant section',
    ],
    primaryCTA: 'food_search',

    components: [
      { type: 'search',  id: 'food_search', label: 'Search Food', text: '🔍 What are you craving?', w: 11, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 0, rowMax: 4 },
        idealZone: { col: 0, row: 0, w: 11, h: 2 }, required: true },
      { type: 'icon',    id: 'cat_pizza',   label: '🍕 Pizza',   text: '🍕', w: 2, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 7 },
        idealZone: { col: 0, row: 3, w: 2, h: 2 }, required: true },
      { type: 'icon',    id: 'cat_burger',  label: '🍔 Burgers', text: '🍔', w: 2, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 7 },
        idealZone: { col: 2, row: 3, w: 2, h: 2 }, required: true },
      { type: 'icon',    id: 'cat_sushi',   label: '🍣 Sushi',   text: '🍣', w: 2, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 7 },
        idealZone: { col: 4, row: 3, w: 2, h: 2 }, required: true },
      { type: 'icon',    id: 'cat_salad',   label: '🥗 Salad',   text: '🥗', w: 2, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 7 },
        idealZone: { col: 6, row: 3, w: 2, h: 2 }, required: true },
      { type: 'icon',    id: 'cat_coffee',  label: '☕ Coffee',   text: '☕', w: 2, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 2, rowMax: 7 },
        idealZone: { col: 8, row: 3, w: 2, h: 2 }, required: false },
      { type: 'hero',    id: 'promo',       label: 'Promo Banner', text: '🔥 50% OFF First Order!', w: 12, h: 4,
        zone: { colMin: 0, colMax: 12, rowMin: 4, rowMax: 13 },
        idealZone: { col: 0, row: 6, w: 12, h: 4 }, required: true },
      { type: 'heading', id: 'nearby_title', label: 'Nearby Heading', text: 'Nearby Restaurants', w: 8, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 8, rowMax: 16 },
        idealZone: { col: 1, row: 11, w: 8, h: 2 }, required: true },
      { type: 'card',    id: 'rest1',       label: 'Restaurant 1', text: '🍕 Mario\'s — ⭐ 4.8\n25 min · $2.99 delivery', w: 11, h: 4,
        zone: { colMin: 0, colMax: 12, rowMin: 10, rowMax: 22 },
        idealZone: { col: 0, row: 13, w: 11, h: 4 }, required: true },
      { type: 'card',    id: 'rest2',       label: 'Restaurant 2', text: '🍔 Burger Barn — ⭐ 4.5\n30 min · Free delivery', w: 11, h: 4,
        zone: { colMin: 0, colMax: 12, rowMin: 13, rowMax: 22 },
        idealZone: { col: 0, row: 17, w: 11, h: 4 }, required: true },
      { type: 'tabBar',  id: 'food_tabs',   label: 'Tab Bar', text: '🏠  🔍  🛒  ❤  👤', w: 12, h: 2,
        zone: { colMin: 0, colMax: 12, rowMin: 20, rowMax: 24 },
        idealZone: { col: 0, row: 22, w: 12, h: 2 }, required: true },
    ],

    flowOrder: ['food_search', 'cat_pizza', 'promo', 'nearby_title', 'rest1', 'rest2', 'food_tabs'],

    semanticGroups: [
      { ids: ['cat_pizza', 'cat_burger', 'cat_sushi', 'cat_salad', 'cat_coffee'], label: 'Category icons', maxDist: 4 },
      { ids: ['rest1', 'rest2'], label: 'Restaurant listings', maxDist: 6 },
      { ids: ['nearby_title', 'rest1', 'rest2'], label: 'Restaurant section', maxDist: 8 },
    ],

    constraints: [
      { type: 'above', a: 'food_search', b: 'cat_pizza' },
      { type: 'above', a: 'cat_pizza', b: 'promo' },
      { type: 'above', a: 'promo', b: 'nearby_title' },
      { type: 'above', a: 'nearby_title', b: 'rest1' },
      { type: 'above', a: 'rest1', b: 'rest2' },
      { type: 'sameRow', a: 'cat_pizza', b: 'cat_burger' },
      { type: 'sameRow', a: 'cat_burger', b: 'cat_sushi' },
      { type: 'sameRow', a: 'cat_sushi', b: 'cat_salad' },
      { type: 'fullWidth', a: 'promo' },
      { type: 'bottomRegion', a: 'food_tabs' },
      { type: 'fullWidth', a: 'food_tabs' },
      { type: 'topRegion', a: 'food_search' },
    ],

    conventions: [
      { id: 'food_search', expect: 'top' },
      { id: 'food_tabs',   expect: 'bottom' },
      { id: 'food_tabs',   expect: 'fullWidth' },
      { id: 'promo',       expect: 'fullWidth' },
    ],

    goldenPath: [
      { id: 'food_search',  step: 'Search for food' },
      { id: 'cat_pizza',    step: 'Browse categories' },
      { id: 'promo',        step: 'See deals' },
      { id: 'nearby_title', step: 'Find nearby options' },
      { id: 'rest1',        step: 'Pick a restaurant' },
    ],

    feedback: {
      s: '"I\'m hungry just looking at this. Perfect UX — the search-to-order flow is seamless."',
      a: '"Great layout! Users will find food fast. The category row is a nice touch."',
      b: '"Functional design. Some spacing issues but the flow mostly works."',
      c: '"The categories and restaurants blur together. Needs clearer sections."',
      d: '"Users would abandon this for another app. Too confusing."',
      f: '"I ordered from a competitor just looking at this. Start over."',
    },
  },
];
