import _Vue, { PluginObject } from 'vue'
import ShopifyBuy from 'shopify-buy'
import Shopify from './shopify'

import ProductProvider from './components/ProductProvider'
import CartProvider from './components/CartProvider'
import ProductListProvider from './components/ProductListProvider'
import CollectionListProvider from './components/CollectionListProvider'

const ShopifyBuyPlugin: PluginObject<ShopifyBuy.Config> = {
    install(Vue: typeof _Vue, options?: ShopifyBuy.Config) {
        if (typeof options === 'undefined') {
            throw Error('Shopify Buy Plugin: Please provide the domain and storefront access token')
        }

        const shopify = Shopify.init({
            domain: options.domain,
            storefrontAccessToken: options.storefrontAccessToken
        });

        (Vue as any).shopify = shopify.getClient()
        Vue.prototype.$shopify = shopify.getClient()

        Vue.component('shopify-cart', CartProvider)
        Vue.component('shopify-product', ProductProvider)
        Vue.component('shopify-product-list', ProductListProvider)
        Vue.component('shopify-collection-list', CollectionListProvider)
    }
}

export default ShopifyBuyPlugin