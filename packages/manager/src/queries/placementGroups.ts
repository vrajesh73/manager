import {
  assignLinodesToPlacementGroup,
  createPlacementGroup,
  deletePlacementGroup,
  getPlacementGroup,
  getPlacementGroups,
  unassignLinodesFromPlacementGroup,
  updatePlacementGroup,
} from '@linode/api-v4';
import {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAll } from 'src/utilities/getAll';

import { profileQueries } from './profile';

import type {
  AssignLinodesToPlacementGroupPayload,
  CreatePlacementGroupPayload,
  PlacementGroup,
  UnassignLinodesFromPlacementGroupPayload,
  UpdatePlacementGroupPayload,
} from '@linode/api-v4';

export const queryKey = 'placement-groups';

export const useUnpaginatedPlacementGroupsQuery = (enabled = true) =>
  useQuery<PlacementGroup[], APIError[]>({
    enabled,
    queryFn: () => getAllPlacementGroupsRequest(),
    queryKey: [queryKey, 'all'],
  });

const getAllPlacementGroupsRequest = () =>
  getAll<PlacementGroup>((params, filters) =>
    getPlacementGroups(params, filters)
  )().then((data) => data.data);

export const usePlacementGroupsQuery = (
  params: Params,
  filter: Filter,
  enabled: boolean = true
) =>
  useQuery<ResourcePage<PlacementGroup>, APIError[]>({
    enabled,
    keepPreviousData: true,
    queryFn: () => getPlacementGroups(params, filter),
    queryKey: [queryKey, 'paginated', params, filter],
  });

export const usePlacementGroupQuery = (
  placementGroupId: number,
  enabled: boolean = true
) => {
  return useQuery<PlacementGroup, APIError[]>({
    enabled,
    queryFn: () => getPlacementGroup(placementGroupId),
    queryKey: [queryKey, 'placement-group', placementGroupId],
  });
};

export const useCreatePlacementGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<PlacementGroup, APIError[], CreatePlacementGroupPayload>({
    mutationFn: createPlacementGroup,
    onSuccess: (placementGroup) => {
      queryClient.invalidateQueries([queryKey, 'paginated']);
      queryClient.setQueryData(
        [queryKey, 'placement-groups', placementGroup.id],
        placementGroup
      );
      // If a restricted user creates an entity, we must make sure grants are up to date.
      queryClient.invalidateQueries(profileQueries.grants.queryKey);
    },
  });
};

export const useMutatePlacementGroup = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<PlacementGroup, APIError[], UpdatePlacementGroupPayload>({
    mutationFn: (data) => updatePlacementGroup(id, data),
    onSuccess: (placementGroup) => {
      queryClient.invalidateQueries([queryKey, 'paginated']);
      queryClient.setQueryData(
        [queryKey, 'placement-group', id],
        placementGroup
      );
    },
  });
};

export const useDeletePlacementGroup = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<{}, APIError[]>({
    mutationFn: () => deletePlacementGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey, 'paginated']);
      queryClient.removeQueries([queryKey, 'placement-group', id]);
    },
  });
};

export const useAssignLinodesToPlacementGroup = (placementGroupId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    PlacementGroup,
    APIError[],
    AssignLinodesToPlacementGroupPayload
  >({
    mutationFn: (data) => assignLinodesToPlacementGroup(placementGroupId, data),
    onSuccess: (updatedPlacementGroup) => {
      queryClient.invalidateQueries([queryKey, 'paginated']);
      queryClient.setQueryData(
        [queryKey, 'placement-group', placementGroupId],
        updatedPlacementGroup
      );
    },
  });
};

export const useUnassignLinodesFromPlacementGroup = (
  placementGroupId: number
) => {
  const queryClient = useQueryClient();
  return useMutation<
    PlacementGroup,
    APIError[],
    UnassignLinodesFromPlacementGroupPayload
  >({
    mutationFn: (data) =>
      unassignLinodesFromPlacementGroup(placementGroupId, data),
    onSuccess: (updatedPlacementGroup) => {
      queryClient.invalidateQueries([queryKey, 'paginated']);
      queryClient.setQueryData(
        [queryKey, 'placement-group', placementGroupId],
        updatedPlacementGroup
      );
    },
  });
};
