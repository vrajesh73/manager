import { Dashboard } from '@linode/api-v4/lib/cloudview/types';
import * as Factory from 'factory.ts';

import { cloudViewFilterFactory } from './cloudViewFilters';
import { cloudViewWidgetFactory } from './cloudViewWidgets';

export const dashboardFactory = Factory.Sync.makeFactory<Dashboard>({
  created: '2023-07-12T16:08:53',
  filters: cloudViewFilterFactory.buildList(2),
  id: Factory.each((i) => i),
  instance_id: Factory.each((i) => i * 2),
  label: Factory.each((i) => `cloudview-${i}`),
  namespace_id: Factory.each((i) => i * 3),
  service_type: Factory.each((i) => {
    if (i % 2 == 0) {
      // aclb
      return `ACLB`;
    } else {
      // dbaas
      return `linodes`;
    }
  }),
  updated: '2023-07-12T16:08:55',
  widgets: cloudViewWidgetFactory.buildList(2),
});
