import Vue from 'vue'
import ShopifyBuy, { ProductVariant, LineItem } from 'shopify-buy'

const CHECKOUT_ID_STORAGE_KEY = 'vue-shopify-checkout-id'

interface StateConfig {
    checkoutId: string
    client?: ShopifyBuy.Client
    cart?: ShopifyBuy.Cart
    cartLoading: boolean
}

export const State = Vue.observable<StateConfig>({
    checkoutId: window.localStorage.getItem(CHECKOUT_ID_STORAGE_KEY) || '',
    cart: null,
    cartLoading: false
})

const Shopify = {
    init(config: ShopifyBuy.Config) {
        Vue.set(State, 'client', ShopifyBuy.buildClient({
            domain: config.domain,
            storefrontAccessToken: config.storefrontAccessToken
        }))

        return this
    },

    getClient() {
        return State.client!
    },

    getCart() {
        return new Promise<ShopifyBuy.Cart>(async (resolve) => {
            let cart = null

            if (State.checkoutId.length === 0) {
                cart = await this.getClient().checkout.create()
                State.checkoutId = cart.id as string
                window.localStorage.setItem(CHECKOUT_ID_STORAGE_KEY, cart.id as string)

                this.updateCart(cart)
                resolve(cart)
            } else if (!State.cart) {
                cart = await this.getClient().checkout.fetch(State.checkoutId)

                if (!cart) {
                    cart = await this.getClient().checkout.create()
                }

                this.updateCart(cart)
                resolve(cart)
            } else {
                resolve(State.cart)
            }
        })
    },

    getState() {
        return State
    },

    async addItem(variant: ProductVariant, qty: number = 1) {
        State.cartLoading = true
        await this.getCart()
        const updatedCart = await this.getClient().checkout.addLineItems(State.checkoutId, [{
            // @ts-ignore
            variantId: variant.id,
            quantity: qty
        }])

        State.cartLoading = false
        this.updateCart(updatedCart)
    },

    async removeItem(item: LineItem) {
        State.cartLoading = true
        await this.getCart()
        const updatedCart = await this.getClient().checkout.removeLineItems(State.checkoutId, [item.id as string])

        State.cartLoading = false
        this.updateCart(updatedCart)
    },

    async updateItemQuantity(item: LineItem, qty: number) {
        State.cartLoading = true
        await this.getCart()
        // @ts-ignore
        const updatedCart = await this.getClient().checkout.updateLineItems(State.checkoutId, [{
            id: item.id,
            quantity: qty
        }])

        State.cartLoading = false
        this.updateCart(updatedCart)
    },

    updateCart(updatedCart: ShopifyBuy.Cart) {
        Vue.set(State, 'cart', updatedCart)
    }
}

export default Shopify