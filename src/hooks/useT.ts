"use client";

import { useDispatch, useSelector } from "react-redux";
import { translate } from "@/locales";
import type { AppDispatch, RootState } from "@/store/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useT() {
  const locale = useAppSelector((state) => state.ui.locale);
  return (key: string, params?: Record<string, string | number | null>) => translate(locale, key, params);
}
