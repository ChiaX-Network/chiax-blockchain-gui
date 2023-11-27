import BigNumber from 'bignumber.js';

const MOJO_PER_XXCH = new BigNumber('1000000000000');
const HEIGHT_CHANGE = 1_000_000
const REWARD_PER_VALUE: Array<[number, number]> = [
  [7_000_000, 0.2],
  [14_000_000, 0.1],
  [21_000_000, 0.05],
  [28_000_000, 0.025],
];
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8
const STAKE_REWARD = '4';
const COMMUNITY_REWARD = '0.06'; // 6 / 100

export function calculateReward(height: number, index: number = 0): number {
  if (height >= 28_000_000) {
    return 0.0125
  }
  const [heightPer, rewardPer] = REWARD_PER_VALUE[index]
  return height < heightPer ? rewardPer : calculateReward(height, index + 1);
}

export function calculatePoolReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_XXCH.times(1_000_000).times(POOL_REWARD)
  }
  return MOJO_PER_XXCH.times(calculateReward(height)).times(height>HEIGHT_CHANGE?POOL_REWARD:0);
}

export function calculateBaseFarmerReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_XXCH.times(1_000_000).times(FARMER_REWARD)
  }
  return MOJO_PER_XXCH.times(calculateReward(height)).times(height>HEIGHT_CHANGE?FARMER_REWARD:1);
}

export function calculateStakeReward(height: number): BigNumber {
  return MOJO_PER_XXCH.times(calculateReward(height)).times(STAKE_REWARD);
}

export function calculateCommunityReward(height: number): BigNumber {
  return calculateStakeReward(height).times(COMMUNITY_REWARD);
}

