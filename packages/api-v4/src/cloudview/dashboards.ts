import { Filter, Params, ResourcePage as Page } from '../types';
import { API_ROOT } from '../constants';
import Request, { setMethod, setParams, setURL, setXFilter } from '../request';
import { Dashboard } from './types';

export const getDashboards = (params?: Params, filter?: Filter) =>
  Request<Page<Dashboard>>(
    setURL(`${API_ROOT}/monitor/dashboards`),
    setMethod('GET'),
    setXFilter(filter),
    setParams(params)
  );
