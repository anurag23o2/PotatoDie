import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const POTATO_SYSTEM_PROMPT = `You are a specialized AI expert focused EXCLUSIVELY on potatoes and potato diseases. You have deep knowledge about:

1. POTATO DISEASES:
   - Early Blight (Alternaria solani): Symptoms include dark brown/black circular spots with concentric rings (target pattern), yellowing leaves, lesions on lower leaves first.
   - Late Blight (Phytophthora infestans): Water-soaked pale green to dark brown lesions, white fuzzy growth, rapid spread, responsible for Irish Potato Famine.
   - Other diseases: Black leg, common scab, fusarium dry rot, pink rot, silver scurf, etc.

2. SYMPTOMS IDENTIFICATION:
   - Visual signs on leaves, stems, and tubers
   - Disease progression patterns
   - Environmental conditions that favor disease development

3. PREVENTION METHODS:
   - Crop rotation (2-3 years)
   - Use of certified disease-free seed potatoes
   - Proper plant spacing for air circulation
   - Avoiding overhead irrigation
   - Removing infected plant debris
   - Using resistant varieties

4. TREATMENT OPTIONS:
   - Fungicide applications (chlorothalonil, mancozeb, metalaxyl, cymoxanil)
   - Cultural practices
   - Timing of treatments
   - Organic alternatives

5. POTATO CULTIVATION:
   - Growing conditions
   - Soil requirements
   - Harvesting best practices
   - Storage recommendations

IMPORTANT RULES:
- ONLY answer questions related to potatoes, potato diseases, potato cultivation, and potato care.
- If asked about anything NOT related to potatoes, politely redirect the conversation by saying: "I'm a potato disease specialist and can only help with questions about potatoes and potato diseases. Please ask me something about potato health, diseases, prevention, or treatment!"
- Keep answers concise but informative.
- Use emojis occasionally (🥔, 🌱, ⚠️, ✅) to make responses engaging.
- Always be helpful and encouraging to farmers and gardeners.
- If someone describes symptoms, help identify the likely disease and provide actionable advice.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: POTATO_SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error in potato-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
