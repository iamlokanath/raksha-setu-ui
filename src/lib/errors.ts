export const ERROR_KEYS: Record<string, string> = {
  VALIDATION_ERROR: "errors.validation",
  AUTH_INVALID: "errors.auth_invalid",
  PERMISSION_DENIED: "errors.permission_denied",
  NOT_FOUND: "errors.not_found",
  DUPLICATE_MISMATCH: "errors.duplicate_mismatch",
  CONFLICT_STALE: "errors.conflict_stale",
  INVALID_STATE: "errors.invalid_state",
  HUMAN_APPROVAL_REQUIRED: "errors.human_approval_required",
  CONFIGURATION_REQUIRED: "errors.configuration_required",
  INTERNAL_ERROR: "errors.internal",
  NETWORK: "errors.network",
  REQUIRED: "validation.required",
  MIN_VALUE: "validation.min_value",
  MAX_LENGTH: "validation.max_length",
  SUM_EXCEEDS_POPULATION: "validation.sum_exceeds",
  FUTURE_TIMESTAMP: "validation.future_time",
  RESOURCE_SET: "validation.resource_set",
  INVALID: "validation.invalid",
  UNKNOWN_FIELD: "validation.invalid",
};

export function messageKeyFor(code: string) {
  return ERROR_KEYS[code] ?? "errors.unexpected";
}

export function fieldMessageKey(code: string) {
  return ERROR_KEYS[code] ?? "validation.invalid";
}
