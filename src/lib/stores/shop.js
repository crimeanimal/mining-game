import { writable } from 'svelte/store';

export const shop = writable({
    inventory: [
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
        },
        {
            id: 5,
            name: 'ore selling dog',
            description: 'will sell ore for you so you can do other stuff i guess, kinda fucked up to make a little doggie do',
            price: 90000,
            unlock: 30
        }
    ]});