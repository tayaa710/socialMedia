# How to Fix Routing Issues on Render.com

To fix the "Not Found" error when accessing routes like `/messenger` directly on your deployed Render.com site, follow these steps:

1. Log in to your [Render.com Dashboard](https://dashboard.render.com/)
2. Select your static site `authentra-frontend`
3. Go to the **Redirects/Rewrites** tab
4. Add a new rule with the following settings:
   - **Source Path**: `/*`
   - **Destination Path**: `/index.html`
   - **Action**: `Rewrite`
5. Click **Save Changes**

This will tell Render.com to serve your main `index.html` file for all routes, allowing your React Router to handle the routing client-side.

After making this change, you should be able to access `https://authentra-frontend.onrender.com/messenger` and any other routes directly.

## Why this works

Single-page applications (SPAs) like yours built with React Router handle routing on the client side, not the server side. When deployed to a static host like Render, direct URLs to routes like `/messenger` look for a file at that path, but no such file exists because all routes are handled by your root `index.html` file.

The rewrite rule tells Render to serve your main `index.html` file for any route, allowing your client-side React Router to take over from there. 