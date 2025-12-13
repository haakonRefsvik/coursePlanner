export async function fetchCourse(id: string, semester: string) {
  const response = await fetch(
    `https://gw-uio.intark.uh-it.no/tp-uio/ws/1.4/open/?type=course&id=${id}&sem=${semester}`,
    {
      headers: {
        "X-Gravitee-Api-Key": process.env.TP_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    console.log(semester +", " + id)
    throw new Error("Failed to fetch");
  }

  return response.json();
}
