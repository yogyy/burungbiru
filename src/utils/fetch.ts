export default async function fetchJSON<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);
  return await res.json();
}
