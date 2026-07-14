const pageCache = new Map()

export const getPageCache = (key) => pageCache.get(key) || null

export const setPageCache = (key, data) => pageCache.set(key, data)

export const removePageCache = (key) => pageCache.delete(key)

export const clearAllPageCache = () => pageCache.clear()
