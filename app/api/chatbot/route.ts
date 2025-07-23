import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 })
    }

    // Enhanced keyword-based responses with more agricultural knowledge
    const messageText = message.toLowerCase().trim()
    let response = ""

    // Weather-related questions
    if (messageText.includes("weather") || messageText.includes("rain") || messageText.includes("temperature")) {
      response =
        "Weather monitoring is crucial for farming success. Check current conditions, forecasts, and plan your activities accordingly. Extreme weather events require special precautions for crop protection. Consider factors like temperature, humidity, wind speed, and precipitation when making farming decisions."
    }
    // Pest management
    else if (messageText.includes("pest") || messageText.includes("insect") || messageText.includes("bug")) {
      response =
        "For effective pest management, first identify the specific pest affecting your crops. Use integrated pest management (IPM) approaches that combine biological controls (beneficial insects), cultural practices (crop rotation), and targeted chemical treatments when necessary. Regular monitoring helps catch infestations early when they're easier to control."
    }
    // Soil health
    else if (messageText.includes("soil") || messageText.includes("fertilizer") || messageText.includes("nutrient")) {
      response =
        "Healthy soil is the foundation of successful farming. Test soil pH and nutrient levels regularly - most crops prefer pH between 6.0-7.0. Add organic matter through compost, cover crops, or well-rotted manure. Maintain proper drainage and avoid soil compaction by minimizing heavy machinery use on wet soils."
    }
    // Water management
    else if (messageText.includes("water") || messageText.includes("irrigation") || messageText.includes("drought")) {
      response =
        "Efficient water management involves proper irrigation timing, soil moisture monitoring, and water conservation techniques. Water early morning or late evening to reduce evaporation losses. Consider drip irrigation or soaker hoses for efficient water delivery. Mulching helps retain soil moisture and reduce watering needs."
    }
    // Tomato-specific questions
    else if (messageText.includes("tomato")) {
      response =
        "Tomatoes thrive in warm weather with temperatures between 65-75°F (18-24°C). Plant after the last frost date in your area. They need well-draining soil with pH 6.0-6.8, consistent watering, and support structures like cages or stakes. Watch for common issues like blight, hornworms, and blossom end rot."
    }
    // Planting timing
    else if (messageText.includes("plant") && (messageText.includes("time") || messageText.includes("when"))) {
      response =
        "Planting timing depends on your location, climate zone, and the specific crop. Generally, cool-season crops (lettuce, peas, broccoli) can be planted in early spring, while warm-season crops (tomatoes, peppers, squash) should be planted after the last frost. Check your local frost dates and use a planting calendar for your region."
    }
    // Disease management
    else if (messageText.includes("disease") || messageText.includes("fungus") || messageText.includes("blight")) {
      response =
        "Plant diseases are often caused by fungi, bacteria, or viruses. Prevention is key: ensure good air circulation, avoid overhead watering, practice crop rotation, and choose disease-resistant varieties. Remove infected plant material promptly. For fungal diseases, copper-based fungicides or neem oil can be effective treatments."
    }
    // Crop rotation
    else if (messageText.includes("rotation") || messageText.includes("rotate")) {
      response =
        "Crop rotation is essential for soil health and pest management. Rotate crops from different plant families each season. For example, follow heavy feeders (tomatoes, corn) with light feeders (herbs, lettuce), then soil builders (legumes like beans or peas). This helps prevent soil depletion and breaks pest and disease cycles."
    }
    // General farming advice
    else {
      const generalResponses = [
        "Successful farming requires attention to soil health, proper timing, and regular monitoring. Consider factors like your local climate, soil conditions, and market demands when planning your crops.",
        "Sustainable farming practices like composting, cover cropping, and integrated pest management can improve long-term productivity while protecting the environment.",
        "Keep detailed records of your farming activities, including planting dates, weather conditions, and harvest yields. This data helps you make better decisions in future seasons.",
        "Consider joining local farming groups or extension services for region-specific advice and support from experienced farmers in your area.",
        "Start small and gradually expand your farming operations as you gain experience. Focus on learning the basics of soil management, plant care, and pest identification.",
      ]
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)]
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}
