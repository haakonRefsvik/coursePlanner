import fetch from "node-fetch";

export async function fetchCourse(id: string) {
  const response = await fetch(
    `https://gw-uio.intark.uh-it.no/tp-uio/ws/1.4/open/?type=course&id=${id}&sem=25h`,
    {
      headers: {
        "X-Gravitee-Api-Key": process.env.TP_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
}
