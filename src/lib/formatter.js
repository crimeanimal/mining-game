const currency = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact'
})
const item = new Intl.NumberFormat("en-US", {
    notation: 'compact'
})
const chart = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 5,
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
    },
    chart: (/** @type {number | bigint | string | undefined} */ value) => {
        if (value != undefined && typeof value != 'string') {
            return '₥'+chart.format(value)
        }
    },
} 