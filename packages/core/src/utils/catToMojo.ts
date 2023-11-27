import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import xxchFormatter from './xxchFormatter';

export default function catToMojo(cat: string | number | BigNumber): BigNumber {
  return xxchFormatter(cat, Unit.CAT).to(Unit.MOJO).toBigNumber();
}
