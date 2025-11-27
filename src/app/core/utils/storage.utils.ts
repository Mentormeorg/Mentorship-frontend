export function getStorage(isLocalStorage = true): Storage {
  return isLocalStorage ? localStorage : sessionStorage;
}

export function setStorage<T>(
  key: string,
  value: T,
  isLocalStorage?: boolean
): void {
  getStorage().setItem(key, JSON.stringify(value));
}

export function getStorageItem<T>(
  key: string,
  isLocalStorage?: boolean
): T | null {
  const item = getStorage().getItem(key);
  if (item === null) {
    return null;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

export function removeStorageItem(
  key: string,
  isLocalStorage?: boolean
): void {
  getStorage().removeItem(key);
}

export function clearStorage(isLocalStorage?: boolean): void {
  getStorage().clear();
}
