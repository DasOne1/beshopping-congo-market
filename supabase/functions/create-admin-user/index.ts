
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, password, fullName, role } = await req.json();

    const { count, error: countError } = await supabaseAdmin
      .from("admin_profiles")
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error("Error counting admin profiles:", countError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    let isAllowed = false;

    if (count === 0) {
      if (role !== 'admin') {
         return new Response(JSON.stringify({ error: "The first user must have the 'admin' role." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
         });
      }
      isAllowed = true;
    } else {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized: Missing token" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
        });
      }
      
      const userClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await userClient.auth.getUser();

      if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 401,
          });
      }

      const { data: adminProfile, error: adminError } = await supabaseAdmin
        .from("admin_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!adminError && adminProfile && adminProfile.role === 'admin') {
        isAllowed = true;
      }
    }
    
    if (!isAllowed) {
        return new Response(JSON.stringify({ error: "Forbidden: Not an admin or permission denied" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        });
    }

    if (!email || !password || !fullName || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { data: newUser, error: creationError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (creationError) {
      console.error("User creation error:", creationError);
      return new Response(JSON.stringify({ error: creationError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const { error: profileError } = await supabaseAdmin
      .from("admin_profiles")
      .insert({
        user_id: newUser.user.id,
        full_name: fullName,
        email: email,
        role: role,
        is_active: true
      });

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        console.error("Profile creation error:", profileError);
        return new Response(JSON.stringify({ error: profileError.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }

    return new Response(JSON.stringify({ message: "User created successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

