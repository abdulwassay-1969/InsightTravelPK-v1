'use server';

export interface AltitudeHealthWarning {
  elevation: number;
  tempDropCelsius: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  recommendations: string[];
}

export interface RoadStatus {
  passName: string;
  elevation: number;
  isOpen: boolean;
  statusNotes: string;
}

export async function getAltitudeHealthWarnings(
  elevationMeters: number, 
  acclimatizationDays: number = 0
): Promise<AltitudeHealthWarning> {
  // Temperature drops by ~6.5°C per 1000 meters
  const tempDropCelsius = parseFloat((6.5 * (elevationMeters / 1000)).toFixed(1));
  
  let riskLevel: AltitudeHealthWarning['riskLevel'] = 'Low';
  const symptoms: string[] = [];
  const recommendations: string[] = [];

  if (elevationMeters >= 4000) {
    riskLevel = acclimatizationDays >= 2 ? 'High' : 'Severe';
    symptoms.push("Severe headache", "Shortness of breath at rest", "Dizziness", "Nausea", "Insomnia");
    recommendations.push(
      "Spend at least 2 days acclimatizing at 2500m-3000m before ascending.",
      "Ascend no more than 300-500 meters per day.",
      "Stay well hydrated (4-5 liters of water daily). Avoid alcohol and sleeping pills.",
      "Carry portable oxygen cans if driving through Khunjerab Pass or Deosai."
    );
  } else if (elevationMeters >= 3000) {
    riskLevel = acclimatizationDays >= 1 ? 'Moderate' : 'High';
    symptoms.push("Mild headache", "Fatigue", "Shortness of breath on exertion", "Difficulty sleeping");
    recommendations.push(
      "Allocate a rest/acclimatization day.",
      "Avoid heavy physical activity in the first 24 hours.",
      "Drink water frequently.",
      "Descend immediately if symptoms worsen."
    );
  } else if (elevationMeters >= 2500) {
    riskLevel = 'Moderate';
    symptoms.push("Mild fatigue", "Slight breathlessness");
    recommendations.push(
      "Keep physical exertion light.",
      "Eat light carbohydrate-rich meals.",
      "Stay hydrated."
    );
  } else {
    riskLevel = 'Low';
    symptoms.push("None expected");
    recommendations.push("Safe elevation level. No special altitude precautions needed.");
  }

  return {
    elevation: elevationMeters,
    tempDropCelsius,
    riskLevel,
    symptoms,
    recommendations
  };
}

export async function getRoadStatus(): Promise<RoadStatus[]> {
  // Simulated database return of northern pass statuses (usually closed in winter/spring)
  return [
    {
      passName: "Babusar Pass (Naran to Chilas)",
      elevation: 4173,
      isOpen: true,
      statusNotes: "Open for all vehicles. Expect brief delays during afternoon showers due to wet roads."
    },
    {
      passName: "Deosai Plains Pass (Astore to Skardu)",
      elevation: 4114,
      isOpen: true,
      statusNotes: "Open for 4x4 jeeps only. Road is clear of snow but tracks remain muddy."
    },
    {
      passName: "Khunjerab Pass (Pakistan-China Border)",
      elevation: 4693,
      isOpen: true,
      statusNotes: "Open for travelers. Keep warm clothing; temperatures can drop below freezing during mornings."
    },
    {
      passName: "Lowari Tunnel (Dir to Chitral)",
      elevation: 3118,
      isOpen: true,
      statusNotes: "Open 24/7. Cargo vehicle clearance checks may cause short queues."
    }
  ];
}
