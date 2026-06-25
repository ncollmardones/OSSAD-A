const BACKEND_URL = "https://ossad-a-production-6b88.up.railway.app";
 
export async function calculateZonalStats(
  salar: string,
  indexA: string,
  indexB: string,
  year: number,
  season: string,
  stat: string,
  cloudCover: number
) {
  // Convertir estación a minúsculas para que coincida con el backend
  const seasonMap: Record<string, string> = {
    "Verano":    "verano",
    "Otoño":     "otoño",
    "Invierno":  "invierno",
    "Primavera": "primavera",
  };
 
  const res = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      salar,
      season: seasonMap[season] ?? season.toLowerCase(),
      year: String(year),
    })
  });
 
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error en el backend");
  }
 
  return await res.json();
}