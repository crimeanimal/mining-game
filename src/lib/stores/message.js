import { writable } from 'svelte/store';

function createMessages() {
    const { subscribe, set, update } = writable([{
        time: new Date().toLocaleTimeString(),
        type: 'GREETING',
        content: 'Welcome to the mines!!!'
    }])
    return {
        subscribe,
        set,
        update,
        newMessage: (/** @type { string } */ type, /** @type { string } */ content) => update((n) => { 
            let message = {
                time: new Date().toLocaleTimeString(),
                type,
                content
            }
            return [message, ...n]
        })
    }
}

export const messages = createMessages()