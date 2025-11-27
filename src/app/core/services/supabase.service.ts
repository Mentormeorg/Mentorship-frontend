import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})

export class SupabaseService {
	private _client: SupabaseClient;

	constructor() {
		// Custom lock function to bypass Navigator LockManager issues
		const noOpLock = async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
			return await fn();
		};

		this._client = createClient(
			environment.supabase.url,
			environment.supabase.anonKey,
			{
				auth: {
					lock: noOpLock
				}
			}
		);
	}


	get client(): SupabaseClient {
		return this._client;
	}
}

