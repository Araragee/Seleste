/** Resolve a file in /public against the configured base path (works when hosted in a subfolder). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
