export const GeoUtils = {
  EARTH_RADIUS_METERS: 6371000,
  radiansToDegrees: (r: number) => r * 180 / Math.PI,
  degreesToRadians: (d: number) => d * Math.PI / 180,
  getDistanceOnEarthInMeters: (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const lat1Rad = GeoUtils.degreesToRadians(lat1);
    const lat2Rad = GeoUtils.degreesToRadians(lat2);
    const lonDelta = GeoUtils.degreesToRadians(lon2 - lon1);
    return GeoUtils.EARTH_RADIUS_METERS * Math.acos(Math.min(1, Math.max(-1, Math.sin(lat1Rad) * Math.sin(lat2Rad) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDelta))));
  }
};
