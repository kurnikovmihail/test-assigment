import { ref } from "vue";
import { safeParse } from "../utils";

export function useLocalStorage(STORAGE_KEY) {
  const localStorageJson = ref(localStorage.getItem(STORAGE_KEY) || "{}");

  function refreshLocalStorageJson() {
    localStorageJson.value = localStorage.getItem(STORAGE_KEY) || "{}";
  }

  function readStorage() {
    return safeParse(localStorage.getItem(STORAGE_KEY));
  }

  function writeStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    refreshLocalStorageJson();
  }

  return {
    localStorageJson,
    refreshLocalStorageJson,
    readStorage,
    writeStorage,
  };
}
