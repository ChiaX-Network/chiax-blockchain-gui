import defaultsForPlotter from '../utils/defaultsForPlotter';
import optionsForPlotter from '../utils/optionsForPlotter';

import PlotterName from './PlotterName';

export default {
  displayName: 'Xxch Proof of Space',
  options: optionsForPlotter(PlotterName.XXCHPOS),
  defaults: defaultsForPlotter(PlotterName.XXCHPOS),
  installInfo: { installed: true },
};
