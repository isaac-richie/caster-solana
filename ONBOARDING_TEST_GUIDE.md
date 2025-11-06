# 🧪 Onboarding Flow - Testing Guide

## ✅ Pre-Test Checklist

- [x] Frontend running on http://localhost:3000
- [x] Backend running on http://localhost:8000
- [x] react-joyride installed
- [x] No linting errors
- [x] OnboardingProvider integrated in layout

---

## 🧪 Testing Steps

### **Test 1: First-Time User Experience**

1. **Clear localStorage** (to simulate new user):
   - Open http://localhost:3000
   - Press `F12` (or `Cmd+Option+I` on Mac) to open Developer Tools
   - Go to **Console** tab
   - Type: `localStorage.clear()` and press Enter
   - Refresh the page (`F5` or `Cmd+R`)

2. **Expected Result:**
   - ✅ Welcome modal should appear after 1 second
   - ✅ Shows PolyCaster branding
   - ✅ Lists key features
   - ✅ Has "Start Interactive Tour" and "Skip & Explore" buttons

3. **Click "Start Interactive Tour"**
   - ✅ Welcome modal closes
   - ✅ Tour starts with step 1 (Welcome message in center)
   - ✅ Shows "Next" button
   - ✅ Shows "Skip Tour" button

4. **Go through the tour:**
   - ✅ Step 1: Welcome message (center)
   - ✅ Step 2: Search bar (bottom)
   - ✅ Step 3: Category filters (bottom)
   - ✅ Step 4: Market card (top)
   - ✅ Step 5: Watchlist button (left)
   - ✅ Step 6: Alerts button (left)
   - ✅ Step 7: AI Analysis button (top)
   - ✅ Step 8: Wallet button (left)
   - ✅ Each step highlights the correct element
   - ✅ Tooltips are readable and informative

5. **Complete the tour:**
   - ✅ Click "Finish" on last step
   - ✅ Tour closes
   - ✅ localStorage saves completion

6. **Refresh page:**
   - ✅ Welcome modal should NOT appear again
   - ✅ Tour should NOT start automatically

---

### **Test 2: Restart Tour via Help Button**

1. **Find Help button:**
   - ✅ Look in header (next to Theme toggle)
   - ✅ Should show Help icon (question mark)

2. **Click Help button:**
   - ✅ Dropdown menu appears
   - ✅ Shows "Start Tour" option
   - ✅ Shows "Documentation" option

3. **Click "Start Tour":**
   - ✅ Tour starts from beginning
   - ✅ All steps work correctly

---

### **Test 3: Skip Tour**

1. **Clear localStorage again:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Welcome modal appears:**
   - ✅ Click "Skip & Explore"
   - ✅ Modal closes
   - ✅ No tour starts
   - ✅ localStorage saves that welcome was seen

3. **Refresh page:**
   - ✅ Welcome modal should NOT appear again

---

### **Test 4: Mobile Responsiveness**

1. **Open Developer Tools:**
   - Press `F12`
   - Click device toggle (Cmd+Shift+M)
   - Select mobile device (iPhone/Android)

2. **Test tour on mobile:**
   - ✅ Welcome modal is responsive
   - ✅ Tour tooltips are readable
   - ✅ All elements are accessible
   - ✅ Buttons are properly sized

---

## 🐛 Common Issues & Fixes

### **Issue: Welcome modal doesn't appear**
- **Fix**: Clear localStorage and refresh
- **Check**: Console for errors

### **Issue: Tour doesn't highlight elements**
- **Fix**: Check that data attributes are present:
  - `data-onboarding="search"`
  - `data-onboarding="categories"`
  - `data-onboarding="watchlist"`
  - etc.

### **Issue: Tour steps are misaligned**
- **Fix**: Check element positioning in DOM
- **Check**: Console for warnings

### **Issue: Help button doesn't work**
- **Fix**: Check that `useOnboarding` hook is available
- **Check**: OnboardingProvider is in layout

---

## ✅ Expected Behavior Summary

### **First Visit:**
1. Page loads → 1 second delay → Welcome modal appears
2. User clicks "Start Tour" → Tour begins
3. User completes tour → Saved to localStorage
4. Page refresh → No welcome modal, no tour

### **Returning User:**
1. Page loads → No interruptions
2. User can click Help button → Restart tour anytime

### **Skip Behavior:**
1. User clicks "Skip" → Modal closes, no tour
2. Page refresh → No welcome modal

---

## 📊 Success Criteria

- ✅ Welcome modal appears for new users
- ✅ Tour guides through all 8 steps
- ✅ Elements are highlighted correctly
- ✅ Tour can be skipped
- ✅ Completion is saved
- ✅ Tour doesn't show again after completion
- ✅ Help button allows restart
- ✅ Mobile responsive
- ✅ No console errors

---

## 🎯 Quick Test Commands

**Clear onboarding data:**
```javascript
localStorage.removeItem('polycaster_welcome_seen')
localStorage.removeItem('polycaster_onboarding_completed')
location.reload()
```

**Check what's stored:**
```javascript
console.log({
  welcome_seen: localStorage.getItem('polycaster_welcome_seen'),
  completed: localStorage.getItem('polycaster_onboarding_completed')
})
```

**Force show welcome modal:**
```javascript
localStorage.removeItem('polycaster_welcome_seen')
localStorage.removeItem('polycaster_onboarding_completed')
location.reload()
```

---

## 🚀 Ready to Test!

Open http://localhost:3000 and follow the steps above. Let me know if you encounter any issues!

