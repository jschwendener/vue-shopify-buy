import Vue, { VNode } from 'vue'
import Shopify from '../shopify'

export default Vue.extend({
    props: {
        withProducts: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            collections: [] as ShopifyBuy.Collection[],
            error: null,
            loading: false,
        }
    },

    async created() {
        this.loading = true

        try {
            if (this.withProducts) {
                this.collections = await Shopify.getClient().collection.fetchAllWithProducts()
            } else {
                this.collections = await Shopify.getClient().collection.fetchAll()
            }
        } catch (err) {
            this.loading = false
            this.error = err
        }

        this.loading = false
    },

    render(): VNode {
        return this.$scopedSlots.default({
            collections: this.collections,
            error: this.error,
            loading: this.loading
        }) as any
    }
})