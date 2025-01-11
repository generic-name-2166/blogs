export function setAuth(bearer: string | null): HeadersInit | undefined {
  return bearer
    ? {
        Authorization: `Bearer ${bearer}`,
      }
    : undefined;
}
