/* ==========================================
   SPOTTIX WARD DATA
   Mock resolution data per BBMP ward.
   Ward names match KGISWardName field in
   assets/bbmp-wards.geojson (243 wards).
   ========================================== */

const WARD_DATA = {
  "Malleswaram":         { wardNo: 10,  resolutionRate: 91, activeIssues: 11, resolvedIssues: 315 },
  "Yelahanka":           { wardNo: 5,   resolutionRate: 85, activeIssues: 16, resolvedIssues: 210 },
  "Yelahanka Satellite Town": { wardNo: 4, resolutionRate: 83, activeIssues: 18, resolvedIssues: 196 },
  "HSR Layout":          { wardNo: 151, resolutionRate: 92, activeIssues: 14, resolvedIssues: 342 },
  "Koramangala":         { wardNo: 150, resolutionRate: 76, activeIssues: 28, resolvedIssues: 295 },
  "Indiranagar":         { wardNo: 81,  resolutionRate: 88, activeIssues: 9,  resolvedIssues: 428 },
  "Domlur":              { wardNo: 83,  resolutionRate: 84, activeIssues: 16, resolvedIssues: 277 },
  "Whitefield":          { wardNo: 84,  resolutionRate: 52, activeIssues: 78, resolvedIssues: 194 },
  "Bellandur":           { wardNo: 152, resolutionRate: 48, activeIssues: 84, resolvedIssues: 156 },
  "Hebbal":              { wardNo: 22,  resolutionRate: 71, activeIssues: 32, resolvedIssues: 204 },
  "Byrasandra":          { wardNo: 196, resolutionRate: 79, activeIssues: 18, resolvedIssues: 189 },
  "Jayanagar":           { wardNo: 167, resolutionRate: 83, activeIssues: 21, resolvedIssues: 312 },
  "JP Nagar":            { wardNo: 177, resolutionRate: 67, activeIssues: 45, resolvedIssues: 187 },
  "Marathahalli":        { wardNo: 85,  resolutionRate: 55, activeIssues: 62, resolvedIssues: 174 },
  "BTM Layout":          { wardNo: 155, resolutionRate: 74, activeIssues: 33, resolvedIssues: 221 },
  "Rajajinagar":         { wardNo: 55,  resolutionRate: 89, activeIssues: 12, resolvedIssues: 298 },
  "Electronic City":     { wardNo: 193, resolutionRate: 44, activeIssues: 91, resolvedIssues: 134 },
  "Vijayanagar":         { wardNo: 49,  resolutionRate: 81, activeIssues: 19, resolvedIssues: 267 },
  "Banashankari":        { wardNo: 161, resolutionRate: 69, activeIssues: 38, resolvedIssues: 198 },
  "Basavanagudi":        { wardNo: 163, resolutionRate: 86, activeIssues: 15, resolvedIssues: 308 },
  "Shivajinagar":        { wardNo: 72,  resolutionRate: 78, activeIssues: 24, resolvedIssues: 245 },
  "Cox Town":            { wardNo: 77,  resolutionRate: 82, activeIssues: 17, resolvedIssues: 289 },
  "Frazer Town":         { wardNo: 78,  resolutionRate: 73, activeIssues: 29, resolvedIssues: 213 },
  "Benson Town":         { wardNo: 76,  resolutionRate: 90, activeIssues: 8,  resolvedIssues: 334 },
  "Ulsoor":              { wardNo: 80,  resolutionRate: 77, activeIssues: 26, resolvedIssues: 231 },
  "Kammanahalli":        { wardNo: 88,  resolutionRate: 62, activeIssues: 49, resolvedIssues: 178 },
  "RT Nagar":            { wardNo: 10,  resolutionRate: 75, activeIssues: 27, resolvedIssues: 222 },
  "Sadashivanagar":      { wardNo: 11,  resolutionRate: 94, activeIssues: 6,  resolvedIssues: 389 },
  "Yeshwanthpur":        { wardNo: 40,  resolutionRate: 68, activeIssues: 41, resolvedIssues: 196 },
  "Dasarahalli":         { wardNo: 35,  resolutionRate: 53, activeIssues: 66, resolvedIssues: 158 },
  "Kempegowda Ward":     { wardNo: 1,   resolutionRate: 72, activeIssues: 30, resolvedIssues: 215 },
  "Peenya":              { wardNo: 12,  resolutionRate: 61, activeIssues: 47, resolvedIssues: 172 },
  "Nandini Layout":      { wardNo: 14,  resolutionRate: 77, activeIssues: 23, resolvedIssues: 238 },
  "Subramanya Nagar":    { wardNo: 15,  resolutionRate: 80, activeIssues: 20, resolvedIssues: 260 },
  "Kadu Malleshwara":    { wardNo: 17,  resolutionRate: 88, activeIssues: 10, resolvedIssues: 310 },
  "Rajamahal Guttahalli":{ wardNo: 18,  resolutionRate: 82, activeIssues: 16, resolvedIssues: 278 },
  "Aramane Nagara":      { wardNo: 9,   resolutionRate: 74, activeIssues: 28, resolvedIssues: 225 },
  "Dattatreya Temple":   { wardNo: 20,  resolutionRate: 66, activeIssues: 42, resolvedIssues: 183 },
  "Srirampura":          { wardNo: 21,  resolutionRate: 58, activeIssues: 55, resolvedIssues: 162 },
  "Kothigepalya":        { wardNo: 23,  resolutionRate: 70, activeIssues: 35, resolvedIssues: 208 },
  "Vidhata Soudha":      { wardNo: 24,  resolutionRate: 85, activeIssues: 13, resolvedIssues: 295 },
};

/**
 * Returns data for a ward by name.
 * Falls back to a deterministic pseudo-random value if the ward isn't explicitly listed,
 * so every one of the 243 wards gets a colour on the map.
 */
function getWardData(wardName) {
  if (!wardName) return { wardNo: null, resolutionRate: 60, activeIssues: 20, resolvedIssues: 150 };
  if (WARD_DATA[wardName]) return WARD_DATA[wardName];

  // Deterministic hash → reproducible rate per ward name
  let hash = 0;
  for (let i = 0; i < wardName.length; i++) {
    hash = (hash * 31 + wardName.charCodeAt(i)) & 0xffff;
  }
  const rate = 40 + (hash % 56); // spread across 40–95%
  return {
    wardNo: null,
    resolutionRate: rate,
    activeIssues: 5 + (hash % 80),
    resolvedIssues: 100 + (hash % 350),
  };
}

export default WARD_DATA;
export { getWardData };

