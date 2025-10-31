// utils/themeStorage.ts
import { Theme } from "@/app/types"; 

const THEMES_KEY = 'themes';

export const getThemesFromLocalStorage = (): Theme[] => {
  if (typeof window === 'undefined') return [];
  const themes = localStorage.getItem(THEMES_KEY);
  return themes ? JSON.parse(themes) : [];
  console.log("thems",themes)
};
export const saveThemesToLocalStorage = (themes: Theme[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

export const addThemeToLocalStorage = (theme: Theme) => {
  const themes = getThemesFromLocalStorage();
  themes.push(theme);
  saveThemesToLocalStorage(themes);
};

export const removeThemeFromLocalStorage = (id: string) => {
  const themes = getThemesFromLocalStorage();
  const updatedThemes = themes.filter(theme => theme.id !== id);
  saveThemesToLocalStorage(updatedThemes);
};

export const getThemeFromLocalStorage = (id: string): Theme | undefined => {
  const themes = getThemesFromLocalStorage();
  return themes.find(theme => theme.id === id);
};