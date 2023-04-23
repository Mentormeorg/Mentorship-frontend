export function getStorage(isLocalStorage: boolean = true): Storage {
	return isLocalStorage ? localStorage : sessionStorage;
}

export function setStorage<T>(
	key: string,
	value: T,
	isLocalStorage?: boolean,
): void {
	getStorage().setItem(key, JSON.stringify(value));
}

export function getStorageItem<T>(key: string, isLocalStorage?: boolean): T {
	return JSON.parse(getStorage().getItem(key) || '{}');
}

export function removeStorageItem(key: string, isLocalStorage?: boolean): void {
	getStorage().removeItem(key);
}

export function clearStorage(isLocalStorage?: boolean): void {
	getStorage().clear();
}
