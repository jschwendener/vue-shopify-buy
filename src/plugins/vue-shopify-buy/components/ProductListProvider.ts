import Vue, { VNode } from 'vue'
import Shopify from '../shopify'

export default Vue.extend({
    props: {
        collection: {
            type: String,
            default: null
        },

        limit: {
            type: Number,
            default: 250
        }
    },

    data() {
        return {
            products: [] as ShopifyBuy.Product[],
            error: null,
            loading: false,
        }
    },

    async created() {
        this.loading = true

        try {
            if (this.collection) {
                const collection = await Shopify.getClient().collection.fetchWithProducts(this.collection)
                this.products = (collection as any).products

            } else {
                this.products = await Shopify.getClient().product.fetchAll(this.limit)
            }
        } catch (err) {
            this.loading = false
            this.error = err
        }

        this.loading = false
    },

    render(): VNode {
        return this.$scopedSlots.default({
            products: this.products,
            error: this.error,
            loading: this.loading
        }) as any
    }
})