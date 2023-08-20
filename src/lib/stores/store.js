import { writable } from 'svelte/store';

export const inventoryStore = writable([
    {
        id: 1,
        name: 'pick upgrade',
        description: 'increase ore produced by mining by 10%',
        price: 25,
        unlock: 1
    },
    {
        id: 2,
        name: 'drill',
        description: 'automatically mine',
        price: 50,
        unlock: 1
    },
    {
        id: 3,
        name: 'extra arm',
        description: 'you can hold another pick',
        price: 1000,
        unlock: 5
    },
    {
        id: 4,
        name: 'diamond drillbits',
        description: 'increase drill base damage',
        price: 750,
        unlock: 5
    }
]);