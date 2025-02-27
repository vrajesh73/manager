import { PlacementGroup } from '@linode/api-v4';

export type PlacementGroupsDrawerPropsBase = {
  onClose: () => void;
  open: boolean;
};

export type PlacementGroupsCreateDrawerProps = PlacementGroupsDrawerPropsBase & {
  allPlacementGroups: PlacementGroup[];
  onPlacementGroupCreate?: (placementGroup: PlacementGroup) => void;
  selectedRegionId?: string;
};

export type PlacementGroupsEditDrawerProps = PlacementGroupsDrawerPropsBase & {
  onPlacementGroupEdit?: (placementGroup: PlacementGroup) => void;
};

export type PlacementGroupsAssignLinodesDrawerProps = PlacementGroupsDrawerPropsBase & {
  onLinodeAddedToPlacementGroup?: (placementGroup: PlacementGroup) => void;
  selectedPlacementGroup: PlacementGroup | undefined;
};
