export interface IPLocation {
  city: string
  region: string
  country: string
  latitude: number
  longitude: number
}

export enum PrivacyLevel {
  PUBLIC = "public",
  CITY = "city",
  REGION = "region",
  COUNTRY = "country",
  MASKED = "masked",
}

export interface PrivacySettings {
  ipMaskingEnabled: boolean
  privacyLevel: PrivacyLevel
  relayOnlyWebRTC: boolean
  dataCollectionOptOut: boolean
}

export class IPMaskingService {
  private privacySettings: PrivacySettings = {
    ipMaskingEnabled: true,
    privacyLevel: PrivacyLevel.COUNTRY,
    relayOnlyWebRTC: true,
    dataCollectionOptOut: true,
  }

  setPrivacyLevel(level: PrivacyLevel): void {
    this.privacySettings.privacyLevel = level
  }

  toggleIPMasking(enabled: boolean): void {
    this.privacySettings.ipMaskingEnabled = enabled
  }

  toggleRelayOnlyWebRTC(enabled: boolean): void {
    this.privacySettings.relayOnlyWebRTC = enabled
  }

  getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings }
  }

  maskLocation(location: IPLocation): string {
    if (!this.privacySettings.ipMaskingEnabled) {
      return `${location.city}, ${location.region}, ${location.country}`
    }

    switch (this.privacySettings.privacyLevel) {
      case PrivacyLevel.CITY:
        return `${location.city}, ${location.country}`
      case PrivacyLevel.REGION:
        return `${location.region}, ${location.country}`
      case PrivacyLevel.COUNTRY:
        return location.country
      case PrivacyLevel.MASKED:
        return "Location Masked"
      default:
        return "Location Masked"
    }
  }

  getWebRTCConfig() {
    if (!this.privacySettings.relayOnlyWebRTC) {
      return {
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }, { urls: ["stun:stun1.l.google.com:19302"] }],
      }
    }

    return {
      iceServers: [
        {
          urls: ["turn:relay.example.com"],
          username: "user",
          credential: "pass",
        },
      ],
      iceTransportPolicy: "relay" as const,
    }
  }
}

export const ipMaskingService = new IPMaskingService()
