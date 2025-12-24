
import { Tool, ToolOption } from './types';

const COMMON_PRO_OPTIONS: ToolOption[] = [
  { id: 'language', label: 'Output Language', type: 'select', choices: ['English', 'Hindi', 'Spanish', 'French', 'Urdu', 'German'], defaultValue: 'English' },
  { id: 'seo_intensity', label: 'SEO Intensity', type: 'select', choices: ['Standard', 'High', 'Aggressive'], defaultValue: 'High' },
  { id: 'audience_target', label: 'Target Audience', type: 'select', choices: ['General', 'Gamers', 'Techies', 'Kids', 'Professionals'], defaultValue: 'General' },
  { id: 'monetization', label: 'Primary Goal', type: 'select', choices: ['AdSense', 'Affiliate', 'Sponsorship', 'Fiverr Sales', 'Brand Growth'], defaultValue: 'AdSense' }
];

export const TOOLS: Tool[] = [
  // --- YOUTUBE LINK ANALYSIS ENGINES (New & Critical) ---
  { id: 'video-audit-pro', name: 'Neural Video Audit', icon: 'fa-magnifying-glass-chart', category: 'youtube', isHot: true, description: 'Paste a video link for a full 90-point algorithmic performance audit.', placeholder: 'https://www.youtube.com/watch?v=...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'comment-sentiment', name: 'Comment Sentiment AI', icon: 'fa-face-smile', category: 'youtube', description: 'Analyze comment section sentiment and fan heatmaps via video link.', placeholder: 'Paste Video Link here...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'auto-timestamps', name: 'AI Timestamps Pro', icon: 'fa-list-ol', category: 'youtube', description: 'Automatically generate SEO chapters and timestamps from video URL.', placeholder: 'Paste Video Link here...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'content-extractor', name: 'Video Data Extractor', icon: 'fa-file-export', category: 'youtube', description: 'Extract transcript, tags, and hidden metadata from any video link.', placeholder: 'https://youtu.be/abc123xyz', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'thumbnail-dl-pro', name: 'Ultra Thumbnail Grabber', icon: 'fa-image', category: 'youtube', description: 'Download 4K thumbnails and analyze their visual CTR ranking.', placeholder: 'Paste Video Link to download art...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'competitor-spy', name: 'Competitor Video Spy', icon: 'fa-user-secret', category: 'youtube', description: 'Compare your video against a competitor link for discovery ranking.', placeholder: 'Paste Competitor Video Link...', advancedOptions: COMMON_PRO_OPTIONS },

  // --- FIVERR FREELANCE TOOLS ---
  { id: 'fiverr-gig-title', name: 'Fiverr Gig Title AI', icon: 'fa-briefcase', category: 'fiverr', isHot: true, description: 'Generate high-ranking Fiverr Gig titles with low competition keywords.', placeholder: 'Describe your service (e.g., Video Editing)...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'fiverr-description', name: 'Gig Description Pro', icon: 'fa-pen-nib', category: 'fiverr', description: 'Write persuasive Fiverr gig descriptions that convert visitors into buyers.', placeholder: 'Main service features...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'buyer-request', name: 'Buyer Request Responder', icon: 'fa-comment-dots', category: 'fiverr', description: 'AI-generated personalized responses to Fiverr buyer requests.', placeholder: 'Paste the Buyer Request text here...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'fiverr-tags', name: 'Fiverr Tag Finder', icon: 'fa-tags', category: 'fiverr', description: 'Extract the best tags for your Fiverr gig based on top-selling competitors.', placeholder: 'Gig category or keywords...' },

  // --- AI CONTENT GENERATION ---
  { id: 'title-generator', name: 'AI Title Generator', icon: 'fa-heading', category: 'ai', isHot: true, description: 'Generate 20+ viral titles with high CTR.', placeholder: 'Main video topic...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'script-generator', name: 'AI Script Generator', icon: 'fa-scroll', category: 'ai', isHot: true, description: 'Complete cinematic video scripts.', placeholder: 'Detailed video theme or outline...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'idea-generator', name: 'AI Video Ideas', icon: 'fa-lightbulb', category: 'ai', isHot: true, description: 'Daily trending content ideas.', placeholder: 'Enter your niche (e.g., Cooking, Tech)...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'description-gen', name: 'AI Description Pro', icon: 'fa-file-lines', category: 'ai', description: 'SEO-optimized descriptions with timestamps.', placeholder: 'Video outline...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'hook-generator', name: 'Viral Hook Gen', icon: 'fa-play-circle', category: 'ai', description: 'Engaging first 15 seconds to stop the scroll.', placeholder: 'Target audience...', advancedOptions: COMMON_PRO_OPTIONS },

  // --- SEO & DATA ANALYSIS ---
  { id: 'seo-analyzer', name: 'SEO Analyzer', icon: 'fa-chart-simple', category: 'seo', isHot: true, description: 'Deep audit of your title and tags.', placeholder: 'Enter Title & Tags...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'keyword-research', name: 'Keyword Research', icon: 'fa-magnifying-glass', category: 'seo', description: 'Find low competition ranking tags.', placeholder: 'Main keyword...', advancedOptions: COMMON_PRO_OPTIONS },

  // --- ANALYTICS & REVENUE ---
  { id: 'earnings-calculator', name: 'Earnings Calculator', icon: 'fa-calculator', category: 'monetization', isHot: true, description: 'Estimate AdSense revenue.', placeholder: 'Monthly View Count...', advancedOptions: COMMON_PRO_OPTIONS },
  { id: 'sponsorship-calc', name: 'Sponsorship Calc', icon: 'fa-handshake-angle', category: 'monetization', description: 'How much to charge brands.', placeholder: 'Average View Count...', advancedOptions: COMMON_PRO_OPTIONS },

  // --- STRATEGY & PLANNING ---
  { id: 'content-calendar', name: '30-Day Growth Plan', icon: 'fa-calendar-days', category: 'planning', isHot: true, description: 'Full content schedule build.', placeholder: 'Your niche and goal...', blogSlug: '30-day-growth-sprint' }
];

export const CATEGORIES = [
  { id: 'all', name: 'Dashboard', icon: 'fa-th' },
  { id: 'fiverr', name: 'Fiverr Gigs', icon: 'fa-handshake' },
  { id: 'youtube', name: 'Video Audit', icon: 'fa-video' },
  { id: 'ai', name: 'AI Engines', icon: 'fa-robot' },
  { id: 'seo', name: 'SEO Labs', icon: 'fa-magnifying-glass-chart' },
  { id: 'monetization', name: 'Money', icon: 'fa-dollar-sign' },
  { id: 'analytics', name: 'Stats', icon: 'fa-chart-line' },
  { id: 'planning', name: 'Strategy', icon: 'fa-chess-king' }
];
