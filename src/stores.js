import { writable } from 'svelte/store';

// concept: log in by name
export let storedData = writable({});
export let currentUser = writable("");
export let tTT = writable("");