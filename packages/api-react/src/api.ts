import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from './xxchLazyBaseQuery';

export { baseQuery };

export default createApi({
  reducerPath: 'xxchApi',
  baseQuery,
  endpoints: () => ({}),
});
