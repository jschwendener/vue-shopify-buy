# vue-shopify-buy
    A Vue plugin that provides renderless components for the Shopify Buy SDK / Storefront API

## Install
```bash
# npm
$ npm install vue-shopify-buy --save

# yarn
$ yarn add vue-shopify-buy
```

## Setup
Initialize the plugin with your Shopify __Domain__ and __Storefront Access Token__. ([How to generate a Storefront Access Token](https://help.shopify.com/en/manual/apps/private-apps#generate-credentials-from-the-shopify-admin)).
```js
import Vue from 'vue'
import VueShopifyBuy from 'vue-shopify-buy'

Vue.use(VueShopifyBuy, {
  domain: 'xxxxx.myshopify.com', // Insert your Shopify Domain
  storefrontAccessToken: 'xxxxxxxx' // Insert your Shopify Storefront Access Token
})
```

## Components
Component | Description
--- | ---
`shopify-cart` | Provides access to the cart
`shopify-product` | Provides access to a single product
`shopify-product-list` | Provides access to a list of products
`shopify-collection-list` | Provides access to a list of collections

### Cart
todo

### Product
todo

### Product List
todo

### Collection List
todo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
