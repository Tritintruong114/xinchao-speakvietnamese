import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

function isDefinitivelyOffline(s: NetInfoState): boolean {
  if (s.isConnected === false) return true;
  if (s.isInternetReachable === false) return true;
  return false;
}

/**
 * Live connectivity for offline UX (NetInfo).
 * When `isInternetReachable` is null, we only treat as offline if `isConnected === false`.
 */
export function useNetworkStatus() {
  const [snapshot, setSnapshot] = useState<NetInfoState | null>(null);

  useEffect(() => {
    let mounted = true;
    void NetInfo.fetch().then((s) => {
      if (mounted) setSnapshot(s);
    });
    const unsub = NetInfo.addEventListener((s) => {
      setSnapshot(s);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const isOffline = snapshot == null ? false : isDefinitivelyOffline(snapshot);

  return {
    snapshot,
    isOffline,
    refresh: () => NetInfo.fetch().then(setSnapshot),
  };
}
