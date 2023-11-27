import { WalletType } from '@xxch-network/api';
import type { Wallet } from '@xxch-network/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Xxch';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
