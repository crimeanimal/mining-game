import { writable } from 'svelte/store';

export const inventoryStore = writable([
    {
        id: 1,
        name: 'pick upgrade',
        description: 'increase ore produced by mining by 10%',
        price: 25
    },
    {
        id: 2,
        name: 'drill',
        description: 'automatically mine',
        price: 50
    },
]);