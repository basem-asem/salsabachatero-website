import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    suppliers: [],
    cartItems:[],
    supNames:[],
    quantity: 0, // Number of unique products in the cart
    total: 0,
    vats: 0,
    delFe: 0,
    discount:0,
    finalTotal:0,
    discountPer:0,
  },
  reducers: {
    addOrUpdateProduct: (state, action) => {
      const existingProduct = state.products.find(p => p.docid === action.payload.product.docid);
      const existingSupName = state.supNames.includes(action.payload.supplierDisplayName);

      if (!existingSupName) {
        state.suppliers.push(action.payload.supplier);
        state.supNames.push(action.payload.supplierDisplayName);
      }

      if (existingProduct) {
        if(action.payload.quantity){
          existingProduct.quanties += action.payload.quantity;
        }else{
          existingProduct.quanties += 1;
        }

      } else {
        state.products.push({ ...action.payload.product });

        state.quantity += 1; // Increment unique product count
      }
      
      state.total += action.payload.product.price * action.payload.product.quanties;
      state.vats = (state.total * action.payload.vat) / 100;
    },
    updateProductQuantity: (state, action) => {
      const product = state.products.find(p => p.docid === action.payload.id);
      if (product) {
        state.total -= product.price * product.quanties;
        state.vats -= (product.price * product.quanties * action.payload.vat) / 100;
        product.quanties = action.payload.quantity;
        state.total += product.price * product.quanties;
        state.vats += (product.price * product.quanties * action.payload.vat) / 100;
      }
    },
    addProductToCartItem:(state, action)=>{
      state.cartItems.push(action.payload);
    },
    addCoupon: (state, action) => {
      const discountPercentage = action.payload.discount;
      state.discountPer = action.payload.discount;
      state.discount = (discountPercentage * state.total) / 100;
       state.finalTotal = state.total -state.discount;
    },
    deleteProduct: (state, action) => {
      const index = state.products.findIndex(p => p.docid === action.payload.id);
      if (index !== -1) {
        const deletedProduct = state.products[index];
        const deletedQuantity = deletedProduct.quanties;
        const deletedPrice = deletedProduct.on_sale ? deletedProduct.sale_price : deletedProduct.price;
        const deletedVat = (deletedPrice * deletedQuantity * action.payload.vat) / 100;

        // Update total by subtracting the total price of the deleted product
        state.total -= deletedPrice * deletedQuantity;
        state.vats -= deletedVat;

        // Create a new array excluding the deleted product
        state.products = state.products.filter(p => p.docid !== action.payload.id);

        // Update quantity of unique products
        state.quantity -= 1;

        // Update suppliers list if needed
        const remainingSuppliers = state.products.map(p => p.supplier);
        state.suppliers = Array.from(new Set(remainingSuppliers));
      }
    },
    reset: (state) => {
      state.products = [];
      state.suppliers = [];
      state.quantity = 0;
      state.total = 0;
      state.vats = 0;
      state.delFe = 0;
      state.discount = 0;
      state.finalTotal = 0;
    },
  },
});

export const { addOrUpdateProduct, updateProductQuantity, deleteProduct, reset,addCoupon,addProductToCartItem } = cartSlice.actions;
export default cartSlice.reducer;
