import Vue, { VNode } from 'vue'
import Shopify from '../shopify'
import ShopifyBuy from 'shopify-buy'

interface VariantOption {
    name: string
    value: string
    type: any
}

export default Vue.extend({
    props: {
        product: {
            type: Object as () => ShopifyBuy.Product,
            default: null
        },

        handle: {
            type: String,
            default: null
        },

        id: {
            type: String,
            default: null
        }
    },

    data() {
        return {
            productInternal: this.product,
            selectedOptions: Array<ShopifyBuy.Option>(),
            loading: false,
            error: null
        }
    },

    render(): VNode {
        return this.$scopedSlots.default({
            product: this.productInternal,
            loading: this.loading,
            error: this.error,

            cheapestVariant: this.cheapestVariant,
            selectedVariant: this.selectedVariant,
            variants: this.variants,
            options: this.options,
            shouldDisplayOptions: this.shouldDisplayOptions,
            coverImage: this.coverImage,
            addToCart: (variant: ShopifyBuy.ProductVariant, qty: number) => Shopify.addItem(variant, qty),
            cartIsUpdating: Shopify.getState().cartLoading,
            selectOption: this.selectOption
        }) as any
    },

    async created() {
        if (!this.productInternal) {
            this.loading = true
            
            try {
                if (this.id) {
                    this.productInternal = await Shopify.getClient().product.fetch(this.id)
                } else if (this.handle) {
                    this.productInternal = await Shopify.getClient().product.fetchByHandle(this.handle)
                }
            } catch (err) {
                this.loading = false
                this.error = err
            }

            this.loading = false
        }

        this.productInternal.options.forEach(option => {
            this.selectOption(option, option.values[0].value)
        })
    },

    computed: {
        selectedVariant(): ShopifyBuy.ProductVariant | null {
            if (!this.productInternal) {
                return null
            }

            let userSelectedOptions = this.selectedOptions
            return this.productInternal.variants.find(variant => {
                return ((variant as any).selectedOptions as VariantOption[]).every(variantOption => {
                    const variantOptionValue = variantOption.value || variantOption
                    // @ts-ignore
                    return userSelectedOptions[variantOption.name] === variantOptionValue
                })
            }) || null
        },

        cheapestVariant(): ShopifyBuy.ProductVariant | null {
            if (!this.productInternal) {
                return null
            }

            return this.productInternal.variants.reduce((prev, cur) => {
                prev = prev || cur
                if (parseInt(cur.price) < parseInt(prev.price)) {
                    return cur
                }

                return prev
            })
        },

        variants(): ShopifyBuy.ProductVariant[] {
            if (!this.productInternal) {
                return []
            }

            return this.productInternal.variants
        },

        options(): ShopifyBuy.Option[] {
            if (!this.productInternal) {
                return []
            }

            return this.productInternal.options
        },

        shouldDisplayOptions(): boolean {
            return this.options.length > 1
                || (this.options.length == 1 && this.options[0].values.length > 1)
        },

        coverImage(): ShopifyBuy.Image | null {
            if (!this.productInternal) {
                return null
            }

            if (this.productInternal.images.length > 0) {
                return this.productInternal.images[0]
            }

            return this.cheapestVariant!.image
        }
    },

    methods: {
        selectOption(option: ShopifyBuy.Option, value: any) {
            this.selectedOptions = Object.assign({}, this.selectedOptions, {
                [option.name]: value
            })
        },
    },
})