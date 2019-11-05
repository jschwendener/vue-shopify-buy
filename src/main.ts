import Vue from 'vue'
import App from './App.vue'

import VueShopifyBuy from './plugins/vue-shopify-buy'

Vue.use(VueShopifyBuy, {
  domain: 'rarestreet.myshopify.com',
  storefrontAccessToken: '7cc230c64e5261b2241f5aa4428168ba'
})

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App)
}).$mount('#app')
