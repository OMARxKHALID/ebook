import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../lib/api";
import { toast } from "sonner";
import { fetchProfile } from "./authSlice";

export const syncCart = createAsyncThunk(
  "cart/sync",
  async (cartItems, { getState }) => {
    const { auth } = getState();
    if (auth.token) {
      await authApi.syncCart(cartItems);
    }
    return cartItems;
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    isCartOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const book = action.payload;
      const id = book._id || book.id;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
        toast.success("Increased quantity in cart");
      } else {
        state.items.push({ ...book, id, quantity: 1 });
        toast.success("Added to cart");
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
      toast.success("Removed from cart");
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      const serverCart = action.payload.cart || [];
      const itemsFromServer = serverCart.map((item) => ({
        ...item.book,
        id: item.book._id || item.book.id,
        quantity: item.quantity,
      }));

      // Simple merge: Priority to server cart, but keep local-only items
      const localItems = [...state.items];
      const merged = [...itemsFromServer];

      localItems.forEach((localItem) => {
        const existsOnServer = merged.find((s) => s.id === localItem.id);
        if (!existsOnServer) {
          merged.push(localItem);
        }
      });

      state.items = merged;
      localStorage.setItem("cart", JSON.stringify(state.items));
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
