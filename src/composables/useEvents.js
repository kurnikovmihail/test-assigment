import { ref } from "vue";
import { uid, nowTs } from "../utils";

export function useEvents() {
  const events = ref([]);

  function pushEvent(ev) {
    events.value.push({ id: uid(), time: nowTs(), ...ev });
  }

  return {
    events,
    pushEvent,
  };
}
