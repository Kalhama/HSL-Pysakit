# HSL Pysäkit

HSL pysäkit on infosivusto, joka näyttää pikanäkymässä suosikkibussipysäkkisi tiedot, sään ja kellonajan. 🚌☀️🕒

<div style="text-align: center;">
    <img src="/examples/mockup.png" width="70%" />
</div>

## Live-esimerkki

- Vieraile osoitteessa: [hslweather.max.kalhama.fi](https://hslweather.max.kalhama.fi)

## Rakenne

Monorepo, hallittuna [pnpm workspaceilla](https://pnpm.io/workspaces):

- `packages/frontend` - Vite/React-sovellus (selain)
- `packages/backend` - Hono-pohjainen sääpalvelu, joka välittää ja välimuistittaa MET Norwayn sääennusteen

Sään haku on siirretty backendin taakse, koska [MET Norwayn API](https://api.met.no) vaatii kutsuihin
yksilöivän `User-Agent`-otsakkeen, jota selain ei voi asettaa - lisäksi backend pystyy välimuistittamaan
vastaukset ja piilottamaan MET Norwayn vastausmuodon frontendilta.

## Kehittäminen

1. Asenna Node.js
   - [Node.js asennus](https://nodejs.org/en/)
2. Asenna pnpm
   - [pnpm asennus](https://pnpm.io/installation)
3. Siirry projektin juurihakemistoon
4. Suorita `pnpm install` asentaaksesi riippuvuudet molempiin paketteihin
5. Kopioi `packages/backend/.env.example` -> `packages/backend/.env` (oletusarvot toimivat paikallisesti)
6. Suorita `pnpm dev` käynnistääksesi frontendin ja backendin samanaikaisesti paikallisesti

## Tuotantoversio

1. Suorita `pnpm build` luodaksesi tuotantoversiot molemmista paketeista
   - Frontendin buildatut tiedostot löytyvät `packages/frontend/dist/`-kansiosta 📁
   - Backend buildataan `packages/backend/dist/`-kansioon ja käynnistetään komennolla `pnpm --filter @hsl-pysakit/backend start`

## Lokaalit määritykset

- Frontendin ympäristömuuttujat löytyvät tiedostosta [packages/frontend/env.ts](./packages/frontend/env.ts)
  (`VITE_WEATHER_BACKEND_URL` osoittaa sääbackendiin, oletuksena `http://localhost:3001`)
- Backendin ympäristömuuttujat: [packages/backend/.env.example](./packages/backend/.env.example)

## Käytetyt ulkoiset rajapinnat

- [MET Norway / Locationforecast](https://api.met.no/doc/locationforecast/HowTO) (sää, backendin kautta)
- [Digitransit / HSL](https://digitransit.fi/en/developers/apis/)

## Kehitykseen osallistuminen

Katso avoimet ongelmat: [Github Issues](https://github.com/Kalhama/HSL-Pysakit/issues) ✍️
