import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import xxchFormatter from './xxchFormatter';

export default function mojoToCAT(mojo: string | number | BigNumber): BigNumber {
  return xxchFormatter(mojo, Unit.MOJO).to(Unit.CAT).toBigNumber();
}
