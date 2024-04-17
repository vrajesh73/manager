import { Widgets } from '@linode/api-v4/lib/cloudview/types';
import * as Factory from 'factory.ts';

import { cloudViewFilterFactory } from './cloudViewFilters';

export const cloudViewWidgetFactory = Factory.Sync.makeFactory<Widgets>({
  aggregate_function: '',
  filters: cloudViewFilterFactory.buildList(2),
  group_by: 'dummy',
  label: Factory.each((i) => `widget-${i}`),
  metric: '200X',
  y_label: 'Count',
});
