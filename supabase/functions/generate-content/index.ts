import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { contentType, platform, topic, profession, targetAudience, niche } = await req.json();

    const openRouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterApiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    let systemPrompt = `You are a professional content creator and personal branding expert. Generate engaging social media content.`;

    if (profession) systemPrompt += ` The user is a ${profession}.`;
    if (targetAudience) systemPrompt += ` Their target audience is ${targetAudience}.`;
    if (niche) systemPrompt += ` They focus on ${niche}.`;

    let userPrompt = "";
    let count = 5;

    switch (contentType) {
      case "posts":
        count = 5;
        userPrompt = `Create 5 engaging ${platform} posts about: ${topic}. Each post should be compelling, valuable, and optimized for ${platform}. Format each post clearly separated with "---" between them.`;
        break;
      case "hooks":
        count = 5;
        userPrompt = `Create 5 viral attention-grabbing hooks for ${platform} about: ${topic}. Make them punchy, curiosity-driving, and scroll-stopping. Each hook should be 1-2 sentences max. Format each hook clearly separated with "---" between them.`;
        break;
      case "stories":
        count = 3;
        userPrompt = `Create 3 storytelling posts for ${platform} about: ${topic}. Each should follow a narrative arc with a clear beginning, middle, and end. Make them personal, relatable, and emotionally engaging. Format each story clearly separated with "---" between them.`;
        break;
      case "calendar":
        count = 7;
        userPrompt = `Create a 7-day content calendar for ${platform} around the theme: ${topic}. For each day, provide a complete post idea with the content. Format each day clearly with "Day X:" followed by the content, separated with "---" between days.`;
        break;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    const contentArray = generatedText
      .split("---")
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0)
      .slice(0, count);

    return new Response(
      JSON.stringify({ content: contentArray }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
