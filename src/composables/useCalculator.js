import { reactive } from "vue";
import { debounce } from "../utils";

/**
 * Логика калькулятора: price, qty, amount
 */
export function useCalculator(initial = {}) {
  const state = reactive({
    price: Number(initial.price) || 0,
    qty: Number(initial.qty) || 0,
    amount: Number(initial.amount) || 0,
    lastEdited: { price: 0, qty: 0, amount: 0 },
    counter: typeof initial.counter === "number" ? initial.counter : 0,
  });

  /** Определяем, какое поле обновлялось раньше */
  function earliestOtherField(changed) {
    const others = ["price", "qty", "amount"].filter((k) => k !== changed);
    const [a, b] = others;
    return state.lastEdited[a] <= state.lastEdited[b] ? a : b;
  }

  /** Обновление значений с дебаунсом */
  const commitInput = debounce((field, rawVal) => {
    const val = Number(rawVal);
    state.lastEdited[field] = Date.now();
    if (!isFinite(val)) return;

    state[field] = val;
    const toRecalc = earliestOtherField(field);

    try {
      if (field === "price") {
        if (toRecalc === "qty") {
          state.qty = state.price !== 0 ? state.amount / state.price : 0;
        } else {
          state.amount = state.price * state.qty;
        }
      } else if (field === "qty") {
        if (toRecalc === "price") {
          state.price = state.qty !== 0 ? state.amount / state.qty : 0;
        } else {
          state.amount = state.price * state.qty;
        }
      } else if (field === "amount") {
        if (toRecalc === "price") {
          state.price = state.qty !== 0 ? state.amount / state.qty : 0;
        } else {
          state.qty = state.price !== 0 ? state.amount / state.price : 0;
        }
      }
    } catch {}
  }, 300);

  return {
    state,
    commitInput,
  };
}
