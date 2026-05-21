/**
 * PLAN LIMITS CONFIGURATION
 * Source of truth for all tiered features and constraints.
 * 
 * Rules:
 * - BASIC: Watermark ON, Cart Warning ON, Business Features DISABLED, Custom Domain DISABLED.
 * - BASIC+: Bank/Referral DISABLED, Chatbot 3-day Trial, No watermark/warning.
 * - STANDARD: Referral max 2 columns, Bank max 3 + 1 QRIS, Chatbot 7-day Trial.
 * - STANDARD_PRO: All features ON, Bank max 6 + 1 QRIS, Chatbot 20-day Trial.
 * - PREMIUM: All features ON, Bank max 8 + 1 QRIS, Unlimited Chatbot.
 */

export const PLAN_CONFIG = {
  FREE: {
    label: 'Free',
    showWatermark: true,
    showCartWarning: true,
    canCustomDomain: false,
    businessFeatures: false,
    bankLimit: 0,
    referralLimit: 0,
    chatbotTrialDays: 0,
    hasInvoice: false,
    storageLimit: 5 * 1024 * 1024, // 5MB
  },
  BASIC: {
    label: 'Basic',
    showWatermark: true,
    showCartWarning: true,
    canCustomDomain: false,
    businessFeatures: false,
    bankLimit: 0,
    referralLimit: 0,
    chatbotTrialDays: 0,
    hasInvoice: false,
    storageLimit: 15 * 1024 * 1024, // 15MB
  },
  BASIC_PLUS: {
    label: 'Basic Plus',
    showWatermark: false,
    showCartWarning: false,
    canCustomDomain: true,
    businessFeatures: false, // Audit Fix: Lock referral/bank for BASIC+
    bankLimit: 0,
    referralLimit: 0,
    chatbotTrialDays: 3,
    hasInvoice: false,
    storageLimit: 20 * 1024 * 1024, // 20MB
  },
  STANDARD: {
    label: 'Standard',
    showWatermark: false,
    showCartWarning: false,
    canCustomDomain: true,
    businessFeatures: true,
    bankLimit: 3,
    referralLimit: 2,
    chatbotTrialDays: 7,
    hasInvoice: false,
    storageLimit: 50 * 1024 * 1024, // 50MB
  },
  STANDARD_PRO: {
    label: 'Standard Pro',
    showWatermark: false,
    showCartWarning: false,
    canCustomDomain: true,
    businessFeatures: true,
    bankLimit: 6,
    referralLimit: 100, // Unlimited-ish
    chatbotTrialDays: 20,
    hasInvoice: true,
    storageLimit: 150 * 1024 * 1024, // 150MB
  },
  PREMIUM: {
    label: 'Premium',
    showWatermark: false,
    showCartWarning: false,
    canCustomDomain: true,
    businessFeatures: true,
    bankLimit: 8,
    referralLimit: 100,
    chatbotTrialDays: -1, // Unlimited
    hasInvoice: true,
    storageLimit: 250 * 1024 * 1024, // 250MB
  }
};

export type PlanType = keyof typeof PLAN_CONFIG;

export function getPlanConfig(plan: string = 'BASIC') {
  const p = (plan || 'BASIC').toUpperCase() as PlanType;
  const config = PLAN_CONFIG[p] || PLAN_CONFIG.BASIC;
  
  console.log(`🛡️ PlanGuard: Checking limits for [${p}]`, config);
  return config;
}

/**
 * Check if chatbot trial is still valid
 */
export function isChatbotActive(client: any) {
  if (!client.hasChatbot) return false;
  
  const config = getPlanConfig(client.plan);
  if (config.chatbotTrialDays === -1) return true; // Unlimited
  if (config.chatbotTrialDays === 0) return false; // Not allowed

  const chatbotConfig = client.chatbotConfig || {};
  if (!chatbotConfig.activatedAt) return false;

  const activatedAt = new Date(chatbotConfig.activatedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - activatedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isActive = diffDays <= config.chatbotTrialDays;
  
  if (!isActive) {
    console.log(`⚠️ PlanGuard: Chatbot trial EXPIRED for [${client.name}] (${diffDays}/${config.chatbotTrialDays} days)`);
  } else {
    console.log(`🤖 PlanGuard: Chatbot active for [${client.name}] (${diffDays}/${config.chatbotTrialDays} days left)`);
  }

  return isActive;
}
