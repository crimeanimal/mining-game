import { writable} from "svelte/store";
import { messages } from "./message";
import { player } from "./player";


/**
 * @type {any}
 */
let playerValue
player.subscribe((currentPlayer) => {
    playerValue = currentPlayer
})


function createSave() {
    const { subscribe, set, update } = writable('');
    return {
        subscribe,
        set,
        update,
        playerObjToB64: () => update((n) => {
            n = btoa(JSON.stringify(playerValue))
            navigator.clipboard.writeText(n).then(() => {
                console.log('Content copied to clipboard');
                messages.newMessage('STATE', 'Player state copied to clipboard')
                    /* Resolved - text copied to clipboard successfully */
                },() => {
                console.error('Failed to copy');
                messages.newMessage('STATE', 'Player state failed to save')
                    /* Rejected - text failed to copy to the clipboard */
            });
            return n
        })
    }
}

export const save = createSave()