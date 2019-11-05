import Vue from 'vue'
import ShopifyBuy from 'shopify-buy'

declare module 'vue/types/vue' {
  interface Vue {
    $shopify: ShopifyBuy.Client
  }
}