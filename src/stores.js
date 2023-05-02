import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store'

// concept: log in by name
export let storedData = persisted('storedData', {});
export let currentUser = persisted('currentUser', "");
export let currentEvent = persisted('currentEvent', "");