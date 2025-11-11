# Splitting Monorepo into Two Separate Repositories

This guide will help you split the monorepo into:
- **Frontend**: `cater-frontend` (https://github.com/isaac-richie/cater-frontend.git)
- **Backend**: `caster-backend` (https://github.com/isaac-richie/caster-backend.git)

---

## 🚀 Quick Split Commands

### Step 1: Push Frontend to cater-frontend

```bash
# Create a temporary directory for frontend
cd /Users/0xhardhat/PolyCaster
git subtree push --prefix=polycasterz origin-frontend main

# Or use the script below
```

### Step 2: Push Backend to caster-backend

```bash
# Create a temporary directory for backend
cd /Users/0xhardhat/PolyCaster
git subtree push --prefix=backend-ts origin-backend main

# Or use the script below
```

---

## 📋 Manual Split Process

### Option 1: Using Git Subtree (Recommended)

This keeps history and is cleaner.

### Option 2: Create Fresh Repos

Push only the relevant files to each repo.

---

## ⚠️ Important Notes

1. **Keep main repo** for development
2. **Separate repos** for deployment
3. **Update deployment guides** with new repo URLs
4. **Environment variables** stay the same


