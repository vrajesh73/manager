import {
  APIError,
  CloudViewMetricsRequest,
  CloudViewMetricsResponse,
  getCloudViewMetrics,
} from '@linode/api-v4';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '../preferences';

export const useCloudViewMetricsQuery = (
  serviceType: string,
  request: CloudViewMetricsRequest,
  props: any,
  widgetProps: any[]
) => {
  return useQuery<CloudViewMetricsResponse, APIError[]>(
    [queryKey, serviceType, request, props, widgetProps], // querykey and dashboardId makes this uniquely identifiable
    () => getCloudViewMetrics(serviceType, request),
    {
      enabled: true,
      refetchInterval: 5000,
    }
  );
};
