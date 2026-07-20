# 🏆 Forge of Legends: Total War — Edición 2: La Liga de las Eras

Plataforma para administrar la liga competitiva de **Pokémon TCG Pocket**: 16 equipos,
15 fechas históricas ("eras"), versus generados automáticamente, tabla general en vivo
y panel administrador — todo sin base de datos ni servidor propio. Los datos viven como
archivos JSON dentro de este mismo repositorio de GitHub.

## Cómo funciona el almacenamiento (sin backend)

- **Lectura pública**: cualquier visitante del sitio lee los archivos
  `public/data/*.json` directamente desde
  `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/public/data/...`
  (o desde la copia que Cloudflare sirve de forma estática si el repo aún no está
  configurado en `config.json`).
- **Escritura desde /admin**: cuando guardas equipos, fechas o resultados, la app usa la
  [API de contenidos de GitHub](https://docs.github.com/en/rest/repos/contents) para
  hacer un commit directo al archivo JSON correspondiente. Esto requiere un **Personal
  Access Token (PAT)** con permiso `repo` (clásico) o `contents: write` (fine-grained).
  El token se pega una sola vez en `/admin`, vive solo en `sessionStorage` de tu
  navegador y nunca se sube al repo ni se envía a ningún servidor de terceros.
- Cada fecha (16 equipos ÷ 2) genera 8 versus por ronda con el **método del círculo**
  de round-robin: con 16 equipos y 15 fechas, cada equipo enfrenta a todos los demás
  exactamente una vez, así que **no puede haber repeticiones** entre fechas.

> ⚠️ Nota de seguridad: como es un sitio 100% estático, la protección del `/admin`
> (PIN + token) es una barrera de conveniencia, no una autenticación real de servidor.
> No compartas el PIN ni el token, usa un token con permisos mínimos (solo ese repo) y
> rótalo si lo compartiste por error.

## Estructura del proyecto

```
forge-of-legends/
├── public/data/
│   ├── teams.json       # equipos (id, name, logo)
│   ├── leagues.json     # las 15 fechas oficiales (nombre, formato, reglas, campeón, estado)
│   ├── matches.json     # versus generados + resultados
│   ├── standings.json   # caché de la tabla general (se recalcula al guardar resultados)
│   └── config.json      # título de liga, repo de GitHub, PIN de admin, puntos por victoria
├── src/
│   ├── components/      # Navbar, TeamCard, MatchCard, LeagueCard, StandingsTable
│   ├── context/          # DataContext: carga y guarda todo el estado de la liga
│   ├── pages/            # Home, Standings, Leagues, LeagueDetail
│   ├── pages/admin/      # Login, Dashboard, Equipos, Fechas, Versus (todas protegidas)
│   └── utils/
│       ├── github.js        # lectura (raw) y escritura (contents API) de JSON en GitHub
│       ├── matchmaking.js   # round-robin (método del círculo) sin repeticiones
│       └── standings.js     # cálculo de la tabla: puntos → victorias → diferencia
└── vite.config.js
```

## 1. Instalación local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Sin configurar GitHub todavía, la app funciona igual
leyendo los JSON locales de `public/data/`.

## 2. Sube el proyecto a GitHub

```bash
git init
git add .
git commit -m "Forge of Legends: Total War — setup inicial"
git branch -M main
git remote add origin https://github.com/<TU_USUARIO>/<TU_REPOSITORIO>.git
git push -u origin main
```

## 3. Conecta la app a tu repositorio

Edita `public/data/config.json` y reemplaza:

```json
"github": {
  "owner": "TU_USUARIO",
  "repo": "TU_REPOSITORIO",
  "branch": "main"
}
```

Cambia también `"adminPin"` por el PIN que quieras usar para entrar a `/admin`.
Haz commit y push de ese cambio.

## 4. Crea tu Personal Access Token de GitHub

1. GitHub → **Settings → Developer settings → Personal access tokens**.
2. Crea un token (fine-grained, restringido solo a este repositorio) con permiso de
   **Contents: Read and write**.
3. Guárdalo en un lugar seguro — lo pegarás en `/admin` cada vez que quieras hacer
   cambios desde ese navegador.

## 5. Despliega en Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecciona tu repositorio.
3. Configuración de build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy. Cloudflare Pages reconstruye el sitio automáticamente en cada push a `main`
   (por ejemplo, cuando actualizas `leagues.json` manualmente), pero los cambios hechos
   desde `/admin` se ven **al instante** para todos los visitantes porque se leen en
   vivo desde `raw.githubusercontent.com`, sin esperar el rebuild.

## 6. Cargar los 16 equipos

El repositorio ya viene con los 10 equipos que figuran como "último campeón" de alguna
fecha (Palomos Team, BRS, Pokemaster, Squirtle Squad, Los Primates, Soul Silvers, The
Unlucky, Eevengers, Team 14, Dark Raiders). Entra a `/admin → Equipos` y agrega los 6
equipos restantes hasta llegar a 16.

## 7. Generar el versus de una fecha

`/admin → Versus` → elige la fecha → **Generar versus**. El sistema arma los 8
enfrentamientos de esa ronda usando el calendario round-robin, garantizando que ningún
par de equipos se repita mientras la liga esté completa. Luego, por cada partido,
selecciona el ganador y escribe el marcador (`3-1`, por ejemplo) y guarda: la tabla
general se recalcula sola y se guarda un caché en `standings.json`.

## Reglas de puntuación

- Victoria = **3 puntos**.
- Orden de la tabla: **puntos → victorias → diferencia de resultados** (suma de la
  diferencia de marcador de cada partido ganado menos la de cada partido perdido).

## Las 15 fechas oficiales

Pharaon League · Saw League · Gym Alma · Liga Evil · World Collision · Gym Bosque ·
Gym Primates · Pokemaster League · Gym Agua · Garchomp Cup · Altar de Muertos ·
Blue Lock Pocket · Flygon Cup · No Se Leer TCG Pocket · Kalos Naval.

Todas sus reglas oficiales, formato y último campeón ya están cargados en
`public/data/leagues.json`.
