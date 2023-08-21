import { writable } from 'svelte/store';

export const messageStore = writable([{
    time: new Date().toLocaleTimeString(),
    content: 'Welcome to the mines!!!'
}]);