<template>
  <div id="app">
    <h1>Shopify Buy Vue Test</h1>
    <shopify-product :id="testProductId" v-slot="{ product, coverImage, variants, loading, error, addToCart }">
      <div v-if="loading">Loading</div>
      <div v-else-if="error">{{ error[0].message }}</div>
      <div v-else>
        <img :src="coverImage.src" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%;">
        <h2>{{ product.title }}</h2>
        <div v-html="product.description"></div>
        <div><strong>CHF {{ variants[0].price }}</strong></div>
        <button @click="addToCart(variants[0])">Add to cart</button>
      </div>
    </shopify-product>

    <shopify-cart v-slot="{ lineItems, amount, totalPriceV2, webUrl, cartIsUpdating, removeItem, updateItemQuantity }">
      <div v-if="lineItems.length > 0" class="cart">
          <div v-if="cartIsUpdating">Loading</div>
          <table class="shopify-cart__list">
            <tr
                v-for="item in lineItems" 
                :key="item.id">
                <td>{{ item.quantity }}x {{ item.title }}</td>
                <td>{{ item.variant.price }}</td>
                <td><input type="number" :value="item.quantity" @input="updateItemQuantity(item, parseInt($event.target.value))"></td>
                <td><button @click.prevent="removeItem(item)">x</button></td>
            </tr>
        </table>

        Total {{ amount }} {{ totalPriceV2.currencyCode }}

        <a :href="webUrl">Go to checkout</a>
      </div>
    </shopify-cart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'app',
  data() {
    return {
      product: null as ShopifyBuy.Product | null,
      products: [] as ShopifyBuy.Product[],
      testProductId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE3NTE2NjY4NTIxNQ=='
    }
  },

  async created() {
    this.$shopify.product.fetch(this.testProductId).then(product => {
      this.product = product
    })

    this.$shopify.product.fetchAll(250).then(products => this.products = products)
  }
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
