import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 })
    }

    // Simulate AI response (replace with actual OpenAI API call)
    const responses = [
      "Based on your question about farming, I'd recommend consulting with local agricultural extension services for region-specific advice.",
      "For optimal crop growth, ensure proper soil drainage, adequate sunlight, and regular monitoring for pests and diseases.",
      "Consider implementing sustainable farming practices like crop rotation, composting, and integrated pest management.",
      "Weather conditions play a crucial role in farming decisions. Monitor forecasts and adjust irrigation and planting schedules accordingly.",
      "Soil testing is essential for understanding nutrient levels and pH. This helps determine the right fertilizers and amendments needed.",
    ]

    // Simple keyword-based responses
    let response = responses[Math.floor(Math.random() * responses.length)]

    if (message.toLowerCase().includes("weather")) {
      response =
        "Weather monitoring is crucial for farming success. Check current conditions, forecasts, and plan your activities accordingly. Extreme weather events require special precautions for crop protection."
    } else if (message.toLowerCase().includes("pest")) {
      response =
        "For pest management, identify the specific pest first. Use integrated pest management (IPM) approaches combining biological, cultural, and chemical controls. Regular monitoring helps catch infestations early."
    } else if (message.toLowerCase().includes("soil")) {
      response =
        "Healthy soil is the foundation of successful farming. Test soil pH and nutrients regularly. Add organic matter through compost or cover crops. Maintain proper drainage and avoid compaction."
    } else if (message.toLowerCase().includes("water")) {
      response =
        "Efficient water management involves proper irrigation timing, soil moisture monitoring, and water conservation techniques. Water early morning or late evening to reduce evaporation losses."
    }

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}
