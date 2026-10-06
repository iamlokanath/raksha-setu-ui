import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Locale } from "@/locales";

type Principal = {
  id: string;
  name: string;
  role: string;
  organization?: string;
  tenant_id: string;
  tenant_name?: string;
  shelter_id: string | null;
  block_id: string | null;
  permissions: string[];
};

const auth = createSlice({
  name: "auth",
  initialState: { principal: null as Principal | null, status: "idle", error: null as string | null },
  reducers: {
    setPrincipal(state, action: PayloadAction<Principal | null>) {
      state.principal = action.payload;
      state.status = action.payload ? "succeeded" : "idle";
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = action.payload ? "failed" : state.status;
    },
  },
});

const ui = createSlice({
  name: "ui",
  initialState: { locale: "en" as Locale, notice: "" },
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
    },
    setNotice(state, action: PayloadAction<string>) {
      state.notice = action.payload;
    },
  },
});

export const { setPrincipal, setAuthError } = auth.actions;
export const { setLocale, setNotice } = ui.actions;

export const store = configureStore({ reducer: { auth: auth.reducer, ui: ui.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
