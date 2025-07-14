# Shader Template • Next.js 15 + Three.js 0.177

Minimal starter to build custom WebGL shaders with **React-Three-Fiber**, **Turbopack HMR** and zero-config GLSL loading.

---

## Stack

| Layer          | Details                                                 |
| -------------- | ------------------------------------------------------- |
| Framework      | Next 15 (`app/` router)                                 |
| Bundler (dev)  | Turbopack — automatic HMR for `.glsl`, `.vert`, `.frag` |
| Bundler (prod) | Webpack 5 (Next default)                                |
| 3D             | Three.js 0.177 + @react-three/fiber 9.1                 |
| UI utils       | @react-three/drei                                       |
| Styling        | Tailwind 4 (optional; purge enabled)                    |
| Lint / Format  | ESLint 9, Prettier 3                                    |
| Package        | pnpm                                                    |

---

## Quick start

```bash
pnpm i            # install
pnpm dev          # dev server (Turbopack, port 3000)
pnpm build        # production build (Webpack)
pnpm start        # serve production
```

> ⚠️ Requires Node ≥ 20.0.0 and pnpm ≥ 8.14.0  
> If install fails, check `.npmrc` and your Node version.
> Note: Turbopack only covers development; builds always use Webpack until Next ships stable support.

## File layout

```bash
src/
 ├─ app/              # Next routes
 ├─ components/
 │   └─ ShaderPlane.tsx   # sample mesh + material
 ├─ shaders/
 │   ├─ sample.vert
 │   ├─ sample.frag
 │   └─ types.d.ts        # GLSL module declarations
 └─ styles/
```

## How to add a shader

1. Drop your .vert and .frag (or .glsl) into src/shaders/.
2. Import them:

```bash
import vs from '@/shaders/my.vert';
import fs from '@/shaders/my.frag';
```

3. Pass them to <shaderMaterial>; React-Three-Fiber handles the rest.
   For hot reload add:

```bash
const key = vs + fs;          // forces remount on edit
<shaderMaterial key={key} ... />
```

4. If you need textures, load via useLoader(TextureLoader, 'path') and bind as uniform.

## Production build caveats

- Webpack requires the same GLSL rule (raw-loader) declared in next.config.ts.
- Mobile WebGL 1: keep uniform counts < 128 and avoid high precision loops.
- Alpha-blended meshes: set transparent, and consider depthWrite={false} to fix order issues.

## License

MIT
