import Vue, { VNode } from 'vue'
import Shopify from '../shopify'
import { LineItem } from 'shopify-buy'

export default Vue.extend({
    render(): VNode {
        if (!this.cart) {
            return
        }

        // @ts-ignore
        return this.$scopedSlots.default({
            ...this.cart,
            removeItem: this.removeItem,
            updateItemQuantity: this.updateItemQuantity,
            cartIsUpdating: Shopify.getState().cartLoading
        }) as any
    },
    
    async created() {
        const cart = await Shopify.getCart()
        this.$emit('ready', cart)
    },

    computed: {
        cart() {
            return Shopify.getState().cart
        },
    },

    methods: {
        removeItem(item: LineItem) {
            Shopify.removeItem(item)
        },

        updateItemQuantity(item: LineItem, qty: number) {
            console.log(item, qty)
            Shopify.updateItemQuantity(item, qty)
        },
    }
})