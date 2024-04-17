import { Dashboard, getDashboards } from '@linode/api-v4';
import {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';
import { useQuery } from '@tanstack/react-query';

import { queryPresets } from '../base';

export const queryKey = 'cloudview-dashboards';

export const useCloudViewDashboardsQuery = (
  params: Params = {},
  filter: Filter = {},
  enabled: boolean = true
) => {
  return useQuery<ResourcePage<Dashboard>, APIError[]>(
    [queryKey, 'paginated', params, filter],
    () => getDashboards(params, filter),
    { ...queryPresets.longLived, enabled, keepPreviousData: true }
  );
};
