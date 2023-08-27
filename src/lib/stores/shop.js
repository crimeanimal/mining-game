import { writable } from 'svelte/store';

export const shop = writable({
    inventory: [
        {
            id: 1,
            name: 'pick upgrade',
            description: 'increase damage done by picks by 10%',
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
        },
        {
            id: 6,
            name: '"performance enhancing dog treats"',
            description: 'i really don\'t think you should feel good about this. doggies sell 2x as fast',
            price: 50000,
            unlock: 40
        },
        {
            id: 7,
            name: 'woder boddle',
            description: 'jesus christ it took you this long to think of getting them water?? decreases ore selling dog death risk by 0.01%',
            price: 100000,
            unlock: 70
        }
    ]});