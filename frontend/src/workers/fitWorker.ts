import { fitParties } from "../utils/fitParties";

self.onmessage = async (e) => {
  const events = e.data;
  console.log("jobber");
  const result = await fitParties(events);
  postMessage(result);
};
