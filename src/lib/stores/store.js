import { writable } from 'svelte/store';

export const inventoryStore = writable([
    {
        id: 1,
        name: 'pick upgrade',
        description: 'increase ore produced by mining by 10%',
        price: 100
    },
    {
        id: 2,
        name: 'idk upgrade',
        description: 'increase ore produced by mining by 10%',
        price: 10000000
    },
]);