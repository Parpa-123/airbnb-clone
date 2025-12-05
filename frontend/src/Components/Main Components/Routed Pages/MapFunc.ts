export const MapFunc = async (query: string) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    )
    const data = await res.json()
    if (!data || data.length === 0) {
        throw new Error('No results found')
    }
    return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon)
    };
};