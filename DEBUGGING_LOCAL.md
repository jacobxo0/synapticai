# Mind Mate Local Development Guide

## Prerequisites

### Version Requirements
```bash
# Check Node.js version
node -v  # Required: v18.17.0 or later
yarn -v  # Required: v1.22.19 or later
```

### Environment Setup
```bash
# Clone repository
git clone https://github.com/mindmate/mindmate.git
cd mindmate

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env.local
```

## Required Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Starting Development Server

### 1. Start Frontend
```bash
# Start development server
yarn dev

# Expected output
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 2. Verify Services
```bash
# Check if services are running
curl http://localhost:3000/api/health

# Expected output
{"status":"healthy","version":"1.0.0"}
```

## Common Issues & Solutions

### 1. Port Conflicts
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process using port
taskkill /PID <process_id> /F
```

### 2. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
yarn install --force

# Rebuild
yarn build
```

### 3. Component Not Showing
```bash
# Check browser console
# Enable React DevTools
# Verify component props
console.log('Component Props:', props)
```

### 4. State/Debug Overlays
```bash
# Enable Zustand DevTools
import { devtools } from 'zustand/middleware'

# Add to store creation
const useStore = create(devtools(store))
```

## Debugging Tools

### 1. React DevTools
```bash
# Install Chrome extension
https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
```

### 2. Zustand DevTools
```javascript
// Enable in development
if (process.env.NODE_ENV === 'development') {
  import('zustand/middleware/devtools')
}
```

### 3. Framer Motion Debug
```javascript
// Add to motion components
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  onAnimationComplete={() => console.log('Animation complete')}
/>
```

## Logging & Tracing

### 1. Console Logging
```javascript
// Add to components
useEffect(() => {
  console.log('Component mounted')
  return () => console.log('Component unmounted')
}, [])
```

### 2. Network Requests
```javascript
// Add to API calls
fetch('/api/endpoint')
  .then(res => {
    console.log('Response:', res)
    return res.json()
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err))
```

### 3. State Changes
```javascript
// Add to Zustand store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => {
    console.log('Previous state:', state)
    return { count: state.count + 1 }
  })
}))
```

## Performance Monitoring

### 1. React Profiler
```javascript
// Wrap components
<React.Profiler
  id="ComponentName"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} ${phase} took ${actualDuration}ms`)
  }}
>
  <YourComponent />
</React.Profiler>
```

### 2. Memory Usage
```bash
# Check memory usage
node --inspect-brk node_modules/.bin/next dev
```

## Hot Reload Issues

### 1. File Watching
```bash
# Check file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 2. Cache Issues
```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache
```

## Support

### Common Error Messages
| Error | Solution |
|-------|----------|
| `Module not found` | Run `yarn install` |
| `Port already in use` | Kill process or change port |
| `Invalid API key` | Check `.env.local` |
| `Component not rendering` | Check React DevTools |

### Contact
- Frontend Team: frontend@mindmate.app
- Infrastructure: infrastructure@mindmate.app
- Emergency: +1-XXX-XXX-XXXX 