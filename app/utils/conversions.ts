import { LAND_SIZE_DECIMALS } from "@/constants/contract";

function convertDecimalToDMS(decimal: number): string {
    const deg = Math.floor(Math.abs(decimal));
    const minFloat = (Math.abs(decimal) - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = ((minFloat - min) * 60).toFixed(2);

    return `${deg}° ${min}' ${sec}" ${decimal >= 0 ? 'N' : 'S'}`;
}

export function parseDDAndConvertToDMS(input: string): string | null {
    if (!input) return null;
    input = input.trim();
    const parts = input.split(',').map((part) => part.trim());
    if (parts.length !== 2) return null;

    const [latStr, lngStr] = parts;
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;

    if (!isValidLat || !isValidLng) return null;

    return `${convertDecimalToDMS(lat)} ${convertDecimalToDMS(lng).replace('N', 'E').replace('S', 'W')}`;
}

export function isValidDDLocation(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    if (input.includes('°') || input.includes('E') || input.includes('N')) return false;

    const parts = input.trim().split(',').map(part => part.trim());
    if (parts.length !== 2) return false;

    const [latStr, lngStr] = parts;
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;

    return isValidLat && isValidLng;
}

// Format date to be more readable
export const formatDate = (timestamp: number | bigint) => {
    if (typeof timestamp === 'bigint') {
        timestamp = Number(timestamp);
    }

    return new Date(Date(timestamp)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export function normalizeAcreAmount(acre: bigint) {
    return Number(acre) / (10 ** LAND_SIZE_DECIMALS);
}