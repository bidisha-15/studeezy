import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code in callback" }, { status: 400 });

  // Exchange code for token
  const tokenRes = await axios.post("https://hosted-svc.civic.com/oauth/token", {
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.NEXT_PUBLIC_CIVIC_REDIRECT_URI,
    client_id: process.env.CIVIC_CLIENT_ID,
    client_secret: process.env.CIVIC_SECRET,
  });

  const { access_token } = tokenRes.data;

  // Fetch user info
  const userRes = await axios.get("https://hosted-svc.civic.com/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const user = userRes.data;

  console.log("✅ Civic user:", user);

  // TODO: Save user to DB or cookie here

  // Redirect user to dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
