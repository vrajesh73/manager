import { object, string, array } from 'yup';

const labelErrorMessage = 'Label must be between 3 and 50 characters.';

export const createObjectStorageKeysSchema = object({
  label: string()
    .required('Label is required.')
    .min(3, labelErrorMessage)
    .max(50, labelErrorMessage)
    .trim(),
  regions: array()
    .of(string())
    .min(1, 'Select at least one region to continue')
    .notRequired(),
});

export const updateObjectStorageKeysSchema = object({
  label: string()
    .notRequired()
    .min(3, labelErrorMessage)
    .max(50, labelErrorMessage)
    .trim(),
  regions: array()
    .of(string())
    .min(
      1,
      'You need to select at least one region. To delete all keys, go to the Access Keys page in Cloud Manager and select Revoke.'
    )
    .notRequired(),
});
