# OAuth Setup for Multiple Apps (Bursa + Bursa-Join)

Since you have two separate apps:
- **Bursa** (main app - where businesses are displayed)
- **Bursa-Join** (registration/join form - this app)

Here's how to configure OAuth properly:

## Option 1: Same OAuth App (Recommended)

If both apps use the **same Supabase project** (which they likely do), use **one OAuth app** for both:

### Google Cloud Console Configuration

1. **App Name**: Set to "Bursa" (this will show as "Sign in to Bursa")

2. **Authorized Domains**: Add ALL domains that will use OAuth:
   - `ypyackkpsqjvifukarrj.supabase.co` (required - Supabase domain)
   - Your main Bursa app domain (e.g., `bursa.com` or `bursa.vercel.app`)
   - Your Bursa-Join app domain (e.g., `join.bursa.com` or `bursa-join.vercel.app`)

3. **Application Home Page**: 
   - Use your main Bursa app URL (e.g., `https://bursa.com`)

4. **Privacy Policy Link**: 
   - `https://your-main-domain.com/privacy` OR
   - `https://your-join-domain.com/privacy`
   - (Wherever you host the privacy policy page)

5. **Terms of Service Link**: 
   - `https://your-main-domain.com/terms` OR
   - `https://your-join-domain.com/terms`
   - (Wherever you host the terms page)

### Where to Host Privacy/Terms Pages?

**Option A: Host on Main Bursa App** (Recommended)
- Users see consistent branding
- Single source of truth
- URLs: `https://bursa.com/privacy` and `https://bursa.com/terms`

**Option B: Host on Bursa-Join App**
- If main app doesn't have these pages yet
- URLs: `https://join.bursa.com/privacy` and `https://join.bursa.com/terms`

**Option C: Host on Both**
- Duplicate the pages in both apps
- Use same URLs in OAuth config (pick one as primary)

## Option 2: Separate OAuth Apps (Not Recommended)

Only use this if:
- Apps use different Supabase projects
- You want completely separate OAuth flows
- Different branding requirements

This is more complex and usually unnecessary.

## Recommended Setup

1. **Use the same OAuth app** (since same Supabase project)
2. **Add both domains** to authorized domains
3. **Host privacy/terms on main Bursa app** (better UX)
4. **Point OAuth config to main app URLs**

### Example Configuration:

```
App Name: Bursa
Application Home Page: https://bursa.com
Privacy Policy: https://bursa.com/privacy
Terms of Service: https://bursa.com/terms

Authorized Domains:
- ypyackkpsqjvifukarrj.supabase.co
- bursa.com
- join.bursa.com (or bursa-join.vercel.app)
```

## Next Steps

1. Decide where to host privacy/terms pages (recommend main app)
2. Add privacy/terms pages to that app if not already there
3. Add all your domains to "Authorized domains" in Google Cloud Console
4. Fill in the App domain section with the correct URLs
5. Save and test

## Testing

After configuration:
1. Test OAuth from both apps
2. Verify "Sign in to Bursa" appears (not the Supabase domain)
3. Check that privacy/terms links work
4. Revoke and re-authorize to see updated consent screen

