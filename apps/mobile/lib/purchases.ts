import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';

let configured = false;

function revenueCatApiKey(): string | undefined {
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY,
    default: undefined,
  });
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

/**
 * Gọi một lần khi app có user; nếu chưa có API key (dev) thì bỏ qua an toàn.
 */
export async function ensurePurchasesConfigured(appUserId?: string | null): Promise<void> {
  const key = revenueCatApiKey();
  if (!key) {
    configured = false;
    return;
  }
  try {
    Purchases.setLogLevel(LOG_LEVEL.WARN);
    if (!configured) {
      Purchases.configure({ apiKey: key });
      configured = true;
    }
    if (appUserId) await Purchases.logIn(appUserId);
    else await Purchases.logOut();
  } catch (e) {
    console.warn('[purchases] configure/login failed', e);
    configured = false;
  }
}

function hasActiveEntitlement(info: CustomerInfo): boolean {
  return Object.keys(info.entitlements.active).length > 0;
}

export type RestoreOutcome = 'restored' | 'empty' | 'error';

/**
 * Khôi phục giao dịch (App Store Guideline 3.1.1). Luôn trả outcome rõ ràng để UI toast.
 */
export async function restorePurchasesWithOutcome(): Promise<RestoreOutcome> {
  const key = revenueCatApiKey();
  if (!key) {
    return 'empty';
  }
  try {
    if (!configured) {
      Purchases.configure({ apiKey: key });
      configured = true;
    }
    const info = await Purchases.restorePurchases();
    return hasActiveEntitlement(info) ? 'restored' : 'empty';
  } catch (e) {
    console.warn('[purchases] restore failed', e);
    return 'error';
  }
}
