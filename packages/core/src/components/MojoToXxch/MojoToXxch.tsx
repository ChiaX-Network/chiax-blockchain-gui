import BigNumber from 'bignumber.js';
import React from 'react';

import useCurrencyCode from '../../hooks/useCurrencyCode';
import mojoToXxch from '../../utils/mojoToXxchLocaleString';
import FormatLargeNumber from '../FormatLargeNumber';

export type MojoToXxchProps = {
  value: number | BigNumber;
};

export default function MojoToXxch(props: MojoToXxchProps) {
  const { value } = props;
  const currencyCode = useCurrencyCode();
  const updatedValue = mojoToXxch(value);

  return (
    <>
      <FormatLargeNumber value={updatedValue} />
      &nbsp;{currencyCode ?? ''}
    </>
  );
}
