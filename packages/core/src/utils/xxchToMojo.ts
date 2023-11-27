import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import xxchFormatter from './xxchFormatter';

export default function xxchToMojo(xxch: string | number | BigNumber): BigNumber {
  return xxchFormatter(xxch, Unit.XXCH).to(Unit.MOJO).toBigNumber();
}
