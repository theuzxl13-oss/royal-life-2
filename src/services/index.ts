import { demoMode } from '../lib/config';
import type { Api } from './api';
import { demoApi } from './demoApi';
import { supabaseApi } from './supabaseApi';

export const api: Api = demoMode ? demoApi : supabaseApi;
export { ApiError } from './api';
