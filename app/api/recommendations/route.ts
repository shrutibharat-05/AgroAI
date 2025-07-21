import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { crop, weather } = await request.json()

    if (!crop || !weather) {
      return NextResponse.json({ message: "Crop and weather parameters are required" }, { status: 400 })
    }

    // Generate recommendation based on crop and weather
    const recommendation = generateRecommendation(crop, weather)

    return NextResponse.json({
      crop,
      weather,
      recommendation,
    })
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while generating recommendation" }, { status: 500 })
  }
}

function generateRecommendation(crop: string, weather: string): string {
  const cropLower = crop.toLowerCase()
  const weatherLower = weather.toLowerCase()

  // Base recommendations for different crops
  const cropAdvice: { [key: string]: string } = {
    wheat: "Wheat requires well-drained soil and moderate temperatures. Ensure proper spacing for air circulation.",
    rice: "Rice needs consistent water supply and warm temperatures. Monitor for blast disease in humid conditions.",
    corn: "Corn requires deep, fertile soil with good drainage. Provide adequate nitrogen during growth stages.",
    tomatoes:
      "Tomatoes need warm temperatures and consistent moisture. Provide support structures and monitor for blight.",
    potatoes: "Potatoes prefer cool, moist conditions. Hill soil around plants and watch for late blight.",
    soybeans: "Soybeans fix their own nitrogen but need phosphorus and potassium. Ensure good drainage.",
    cotton: "Cotton requires warm temperatures and moderate rainfall. Monitor for bollworm and other pests.",
    lettuce: "Lettuce prefers cool weather and consistent moisture. Provide shade in hot conditions.",
    carrots: "Carrots need loose, deep soil. Thin seedlings properly and maintain consistent moisture.",
    onions: "Onions require well-drained soil and full sun. Reduce watering as bulbs mature.",
  }

  // Weather-specific advice
  const weatherAdvice: { [key: string]: string } = {
    sunny: "Take advantage of sunny conditions for field work. Ensure adequate irrigation to prevent drought stress.",
    cloudy: "Cloudy conditions reduce evaporation. Adjust irrigation schedules and monitor for fungal diseases.",
    rainy: "Excess moisture can lead to root rot and fungal issues. Ensure proper drainage and avoid field traffic.",
    stormy: "Protect crops from wind damage. Check for hail damage and provide support for tall plants.",
    hot: "High temperatures can stress plants. Increase irrigation frequency and provide shade if possible.",
    cold: "Cold weather slows growth. Protect sensitive crops with row covers or delay planting.",
    humid: "High humidity promotes fungal diseases. Improve air circulation and consider fungicide applications.",
    dry: "Dry conditions require increased irrigation. Mulch around plants to retain soil moisture.",
    windy: "Strong winds can damage plants and increase water loss. Provide windbreaks and stake tall plants.",
    foggy: "Fog can promote fungal diseases. Ensure good air circulation and monitor plant health closely.",
  }

  let recommendation = `For ${crop} in ${weather} conditions:\n\n`

  // Add crop-specific advice
  if (cropAdvice[cropLower]) {
    recommendation += `Crop Care: ${cropAdvice[cropLower]}\n\n`
  }

  // Add weather-specific advice
  if (weatherAdvice[weatherLower]) {
    recommendation += `Weather Considerations: ${weatherAdvice[weatherLower]}\n\n`
  }

  // Add specific combinations
  if (weatherLower === "rainy" && ["tomatoes", "potatoes"].includes(cropLower)) {
    recommendation += `Special Alert: Rainy conditions increase risk of blight diseases in ${crop}. Consider preventive fungicide applications and improve drainage.\n\n`
  }

  if (weatherLower === "hot" && ["lettuce", "carrots"].includes(cropLower)) {
    recommendation += `Heat Stress Warning: ${crop} is sensitive to high temperatures. Provide shade cloth and increase watering frequency.\n\n`
  }

  if (weatherLower === "cold" && ["tomatoes", "corn", "cotton"].includes(cropLower)) {
    recommendation += `Cold Protection: ${crop} is sensitive to cold temperatures. Use row covers or delay planting until temperatures warm up.\n\n`
  }

  // Add general recommendations
  recommendation += `General Recommendations:
• Monitor soil moisture levels regularly
• Check for pest and disease symptoms daily
• Maintain proper plant spacing for air circulation
• Apply fertilizers based on soil test results
• Keep detailed records of weather and crop performance

Remember to consult with local agricultural extension services for region-specific advice and current pest/disease alerts.`

  return recommendation
}
