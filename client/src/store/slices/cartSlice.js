import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../lib/api";
import { toast } from "sonner";
import { fetchProfile, logout } from "./authSlice";

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

export const clearCartServer = createAsyncThunk(
  "cart/clearServer",
  async (_, { getState }) => {
    const { auth } = getState();
    if (auth.token) {
      await authApi.syncCart([]);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    isCartOpen: false,
    isInitialized: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const book = action.payload;
      const id = book._id || book.id;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
        toast.success("Quantity Updated", {
          description: `Increased ${book.title} quantity.`,
        });
      } else {
        state.items.push({ ...book, id, quantity: 1 });
        toast.success("Added to Cart", {
          description: `${book.title} is now in your cart.`,
        });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const itemToRemove = state.items.find((i) => i.id === id);
      state.items = state.items.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(state.items));
      toast.success("Item Removed", {
        description: `${itemToRemove?.title || "Book"} removed from cart.`,
      });
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
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const serverCart = action.payload.cart || [];
        const itemsFromServer = serverCart
          .map((item) => ({
            ...item.book,
            id: item.book._id || item.book.id,
            quantity: item.quantity,
          }))
          .filter((item) => item.id);

        const localItems = JSON.parse(localStorage.getItem("cart")) || [];

        const cartMap = new Map();

        itemsFromServer.forEach((item) => {
          cartMap.set(item.id, item);
        });

        localItems.forEach((localItem) => {
          if (!cartMap.has(localItem.id)) {
            cartMap.set(localItem.id, localItem);
          }
        });

        const merged = Array.from(cartMap.values());

        state.items = merged;
        localStorage.setItem("cart", JSON.stringify(state.items));
        state.isInitialized = true;
      })
      .addCase(clearCartServer.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem("cart");
      })
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem("cart");
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
