type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asMessage = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isRecord(error)) return fallback;

  const data = isRecord(error.data) ? error.data : null;
  const nestedError = data && isRecord(data.error) ? data.error : null;
  const errorMessages =
    data && Array.isArray(data.errorMessages) ? data.errorMessages : [];
  const firstError =
    errorMessages.length > 0 && isRecord(errorMessages[0])
      ? errorMessages[0]
      : null;
  const errorSources =
    data && Array.isArray(data.errorSources)
      ? data.errorSources
      : Array.isArray(error.errorSources)
        ? error.errorSources
        : [];
  const firstErrorSource =
    errorSources.length > 0 && isRecord(errorSources[0])
      ? errorSources[0]
      : null;

  return (
    asMessage(data?.message) ||
    asMessage(nestedError?.message) ||
    asMessage(firstError?.message) ||
    asMessage(firstErrorSource?.message) ||
    asMessage(error.message) ||
    asMessage(error.error) ||
    fallback
  );
};
