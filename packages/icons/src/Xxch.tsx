import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import XxchBlackIcon from './images/xxch-black.svg';
import XxchIcon from './images/xxch.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={XxchIcon} viewBox="0 0 400 400" {...props} />;
}

export function XxchBlack(props: SvgIconProps) {
  return <SvgIcon component={XxchBlackIcon} viewBox="0 0 400 400" sx={{ width: '100px', height: '100px' }} {...props} />;
}
