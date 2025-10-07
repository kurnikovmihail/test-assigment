<template>
  <div class="container">
    <h2>Тестовое задание — Vue3 (JS)</h2>

    <div class="top">
      <input
        type="number"
        step="any"
        placeholder="price"
        v-model="localInputs.price"
        @input="onInput('price', localInputs.price)"
      />
      <input
        type="number"
        step="any"
        placeholder="qty"
        v-model="localInputs.qty"
        @input="onInput('qty', localInputs.qty)"
      />
      <input
        type="number"
        step="any"
        placeholder="amount"
        v-model="localInputs.amount"
        @input="onInput('amount', localInputs.amount)"
      />
      <button @click="onSubmit">Submit</button>
    </div>

    <div class="labels">
      <div class="label">Цена: {{ state.price }}</div>
      <div class="label">Количество: {{ state.qty }}</div>
      <div class="label">Сумма: {{ state.amount }}</div>
      <div class="label">
        localStorage:
        <div class="json">{{ localStorageJson }}</div>
      </div>
    </div>

    <div>
      <h3>События (новые сверху)</h3>
      <div class="box">
        <div v-for="ev in eventsReverse" :key="ev.id" class="event">
          <div>
            <strong>[{{ ev.time }}]</strong>
            <span class="small">{{ ev.type }}</span>
          </div>
          <div class="small">{{ ev.note }}</div>
          <div v-if="ev.payload">
            payload:
            <pre class="json">{{ JSON.stringify(ev.payload, null, 2) }}</pre>
          </div>
          <div v-if="ev.ls">
            localStorage snapshot:
            <pre class="json">{{ JSON.stringify(ev.ls, null, 2) }}</pre>
          </div>
        </div>
        <div v-if="events.length === 0" class="small">Событий ещё нет</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { useEvents } from "../composables/useEvents";
import { useLocalStorage } from "../composables/useLocalStorage";
import { useCalculator } from "../composables/useCalculator";

const STORAGE_KEY = "vue3-test-assignment";

export default {
  setup() {
    // === LocalStorage ===
    const { localStorageJson, readStorage, writeStorage, refreshLocalStorageJson } =
      useLocalStorage(STORAGE_KEY);

    // === Calculator ===
    const { state, commitInput } = useCalculator(readStorage());

    // === Events ===
    const { events, pushEvent } = useEvents();

    // === Локальные инпуты ===
    const localInputs = reactive({
      price: String(state.price),
      qty: String(state.qty),
      amount: String(state.amount),
    });

    function onInput(field, value) {
      commitInput(field, value);

      // синхронизация
      localInputs.price = String(state.price);
      localInputs.qty = String(state.qty);
      localInputs.amount = String(state.amount);

      refreshLocalStorageJson();
    }

    let isSending = false;
    async function onSubmit() {
      if (isSending) return;
      isSending = true;

      const toSend = { price: state.price, qty: state.qty, amount: state.amount };
      const lsBefore = readStorage();

      pushEvent({
        type: "submit-click",
        note: "Clicked submit — starting request (1s sim)",
        payload: toSend,
        ls: lsBefore,
      });

      await new Promise((r) => setTimeout(r, 1000));

      const success = Math.round(state.amount) % 2 === 0;
      state.counter += 1;

      if (success) {
        writeStorage({ ...state });
      }

      const lsAfter = readStorage();

      pushEvent({
        type: "submit-response",
        note: `Backend responded: ${success ? "success" : "failure"}`,
        payload: { sent: toSend, response: { success } },
        ls: lsAfter,
      });

      refreshLocalStorageJson();
      isSending = false;
    }

    const eventsReverse = computed(() => [...events.value].reverse());

    watch(
      () => [state.price, state.qty, state.amount],
      () => {
        localInputs.price = String(state.price);
        localInputs.qty = String(state.qty);
        localInputs.amount = String(state.amount);
      }
    );

    return {
      state,
      localInputs,
      onInput,
      onSubmit,
      events,
      eventsReverse,
      localStorageJson,
    };
  },
};
</script>
