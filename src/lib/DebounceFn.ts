// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebounceFunction = <T extends any[]>(
  func: (...args: T) => void,
  delay: number
) => (...args: T) => void;

export const debounce: DebounceFunction = (func, delay) => {
  let timeoutId: NodeJS.Timeout;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
