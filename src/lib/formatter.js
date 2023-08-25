const currency = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact'
})
const item = new Intl.NumberFormat("en-US", {
    notation: 'compact'
})
export const formatter = {
    currency: (/** @type {number | bigint | undefined} */ value) => {
        if (value != undefined) {
            return '₥'+currency.format(value)
        }
    },
    item: (/** @type {number | bigint | undefined} */ value) => {
        if (value != undefined) {
            return item.format(value)
        }
    }
} 