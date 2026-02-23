// IP geolocation and privacy masking
interface IPLocation {
  ip: string
  city: string
  region: string
  country: string
  lat: number
  lng: number
}

interface MaskedLocation {
  city: string
  country: string
  region: string
}

// Simulate IP geolocation - in production use MaxMind, IP2Location, etc.
export async function getIPLocation(ip: string): Promise<IPLocation> {
  // Mock data - replace with real API call
  const locations: { [key: string]: IPLocation } = {
    default: {
      ip,
      city: "San Francisco",
      region: "California",
      country: "United States",
      lat: 37.7749,
      lng: -122.4194,
    },
  }

  return locations.default
}

// Mask IP location to city/country level
export function maskIPLocation(
  location: IPLocation,
  maskLevel: "city" | "region" | "country" = "city",
): MaskedLocation {
  if (maskLevel === "country") {
    return {
      city: "Hidden",
      region: "Hidden",
      country: location.country,
    }
  }
  if (maskLevel === "region") {
    return {
      city: "Hidden",
      region: location.region,
      country: location.country,
    }
  }
  return {
    city: location.city,
    region: location.region,
    country: location.country,
  }
}

// Format location display
export function formatLocation(location: MaskedLocation | null, isMasked: boolean): string {
  if (!location) return "Location unknown"
  if (isMasked && location.city === "Hidden") {
    return `${location.region}, ${location.country}`
  }
  return `${location.city}, ${location.country}`
}
