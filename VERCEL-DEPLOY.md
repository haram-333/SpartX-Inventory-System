# 🚀 Vercel Deployment Guide

## Environment Variables

Add these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### 1. MONGODB_URI
```
mongodb+srv://SpartX:c847%402H5@spartx-inventory-system.mvozmoy.mongodb.net/SpartX-Inventory-System?retryWrites=true&w=majority&appName=SpartX-Inventory-System
```

### 2. NEXTAUTH_URL
```
https://spartx-inventory-system.vercel.app
```
*(Replace with your actual Vercel domain after first deployment)*

### 3. NEXTAUTH_SECRET
```
4f79666130e6b43df597b6ab7bb4bb710a0ed2ef0bf7ac5a618d97c68ddeba50
```

---

## Deployment Steps

1. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import from GitHub: `haram-333/SpartX-Inventory-System`
   - Select the repository

2. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add the 3 variables above
   - Make sure to select **Production, Preview, and Development** environments for each

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

4. **Set up Database:**
   - After deployment, visit: `https://your-project.vercel.app/setup-collections`
   - Click "Setup Collections" to initialize database

5. **Login:**
   - Email: `admin@alloyrim.com`
   - Password: `admin123`

---

## Important Notes

- The auth secret is currently hardcoded in `src/lib/auth.ts` (line 8)
- For production, consider using environment variables
- Make sure MongoDB connection allows your Vercel serverless functions IP

---

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check Vercel build logs

**Can't login?**
- Make sure you ran `/setup-collections` first
- Check MongoDB connection is working

**Connection error?**
- Verify MongoDB URI in environment variables
- Check MongoDB network access (allow Vercel IPs)

