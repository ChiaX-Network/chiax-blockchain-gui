import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import xxchFormatter from './xxchFormatter';

export default function mojoToCATLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return xxchFormatter(mojo, Unit.MOJO).to(Unit.CAT).toLocaleString(locale);
}
