import BigNumber from 'bignumber.js';

const MOJO_PER_XXCH = new BigNumber('1000000000000');
const REWARD_PER_VALUE: Array<[number, number]> = [
  [7_000_000, 0.2],
];
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8

export function calculateReward(height: number, index: number = 0): number {
  if (height > 7_000_000) {
    return 0.2
  }
  const [heightPer, rewardPer] = REWARD_PER_VALUE[index]
  return height < heightPer ? rewardPer : calculateReward(height, index + 1);
}

export function calculatePoolReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_XXCH.times(1_000_000).times(POOL_REWARD)
  }
  return MOJO_PER_XXCH.times(0);
}

export function calculateBaseFarmerReward(height: number): BigNumber {

  if (height === 0) {
    return MOJO_PER_XXCH.times(1_000_000).times(FARMER_REWARD)
  }
  return MOJO_PER_XXCH.times(0.2);
}

export function calculateStakeReward(height: number): BigNumber {
  return MOJO_PER_XXCH.times(0.8);
}
