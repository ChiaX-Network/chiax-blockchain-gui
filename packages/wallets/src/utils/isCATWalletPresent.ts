import type { Wallet, CATToken } from '@xxch-network/api';
import { WalletType } from '@xxch-network/api';

export default function isCATWalletPresent(wallets: Wallet[], token: CATToken): boolean {
  return !!wallets?.find((wallet) => {
    if ([WalletType.CAT, WalletType.CRCAT].includes(wallet.type) && wallet.meta?.assetId === token.assetId) {
      return true;
    }

    return false;
  });
}
