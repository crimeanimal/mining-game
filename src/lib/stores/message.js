import { writable } from 'svelte/store';

export const messages = writable([{
    time: new Date().toLocaleTimeString(),
    content: 'Welcome to the mines!!!'
}]);