import { fitParties } from "../utils/fitParties";

self.onmessage = async (e) => {
  const events = e.data;
  const result = await fitParties(events);
  postMessage(result);
};
