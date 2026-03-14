import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RepositoryInfo {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
  updated_at: string;
}

async function getRepositoryInfo(
  owner: string,
  repo: string,
  token: string
): Promise<RepositoryInfo> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    name: data.name,
    url: data.html_url,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
    updated_at: data.updated_at,
  };
}

async function listRepositories(token: string): Promise<RepositoryInfo[]> {
  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const repos = await response.json();

  return repos.map((repo: any) => ({
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    updated_at: repo.updated_at,
  }));
}

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, token, owner, repo } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "GitHub token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let result;

    if (action === "validate") {
      result = await validateToken(token);
    } else if (action === "list-repos") {
      result = await listRepositories(token);
    } else if (action === "get-repo") {
      if (!owner || !repo) {
        return new Response(
          JSON.stringify({ error: "Owner and repo are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      result = await getRepositoryInfo(owner, repo, token);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
