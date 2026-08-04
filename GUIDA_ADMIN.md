# Jami Candles — Guida: Supabase e Area Admin

> Documento di riferimento per la gestione del sito e del pannello amministratore.

---

## 1. SUPABASE — Il backend del sito

### Cos'è Supabase?
**Supabase** è il servizio cloud gratuito usato come database e storage.
È stato scelto perché il sito è Angular puro (nessun server proprio), quindi serve un servizio esterno per:
- salvare le foto delle candele
- gestire il catalogo prodotti (nome, prezzo, descrizione, fragranze)
- gestire il login dell'area admin

### Creare un nuovo progetto Supabase
1. Vai su [https://supabase.com](https://supabase.com) e crea un account (gratuito)
2. Click **New project**
3. Dai un nome (es. `jami-candles`) e scegli la regione più vicina (Europe West)
4. Prendi nota di **Project URL** e **anon public key** (le trovi in *Settings → API*)

### Dove inserire le chiavi
Modifica entrambi i file:

**`src/environments/environment.ts`** (sviluppo):
```typescript
supabase: {
  url:     'https://TUOID.supabase.co',
  anonKey: 'eyJ...',
},
imageSource: 'local',   // in sviluppo usa le foto locali
```

**`src/environments/environment.prod.ts`** (produzione):
```typescript
supabase: {
  url:     'https://TUOID.supabase.co',
  anonKey: 'eyJ...',
},
imageSource: 'supabase', // in produzione carica da Supabase
```

---

## 2. CONFIGURAZIONE SUPABASE (da fare una sola volta)

### Step A — Creare il bucket `candele`

1. Dashboard Supabase → **Storage** → **New bucket**
2. Nome: `candele`
3. Spunta **Public bucket** (le immagini devono essere visibili pubblicamente)
4. Click **Save**

### Step B — Creare la tabella `products`

Vai in **SQL Editor** e incolla questa query:

```sql
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  notes       text,
  description text,
  price       text,
  tag         text,
  image_url   text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- Rendi la tabella leggibile pubblicamente
alter table public.products enable row level security;

create policy "Lettura pubblica"
  on public.products for select using (true);

create policy "Solo admin può scrivere"
  on public.products for all
  using (auth.role() = 'authenticated');
```

### Step C — Creare l'utente admin

1. Dashboard Supabase → **Authentication** → **Users**
2. Click **Add user → Create new user**
3. Inserisci email e password dell'admin (es. `sonia@jamicandles.it`)
4. Click **Create user**

> ℹ️ Non serve login social. Solo email + password.

### Step D — Policy Storage

In **Storage → candele → Policies**, aggiungi:
- **SELECT** `true` (chiunque può visualizzare)
- **INSERT/UPDATE/DELETE** `auth.role() = 'authenticated'` (solo admin)

---

## 3. SORGENTE IMMAGINI (`imageSource`)

```typescript
imageSource: 'local' | 'supabase'
```

| Valore | Comportamento |
|---|---|
| `'local'` | Usa le immagini statiche in `public/` (sviluppo) |
| `'supabase'` | Carica le immagini da Supabase Storage (produzione) |

> In `environment.prod.ts` è già impostato `'supabase'`.

---

## 4. AREA AMMINISTRATORE

### Come accedere
- Sviluppo: `http://localhost:4200/admin/login`
- Produzione: `https://[tuo-dominio]/admin/login`

> La route `/admin` è sempre disponibile, anche con `comingSoon: true`.

### Credenziali
Gestite da Supabase Auth → **Authentication → Users**

---

## 5. FUNZIONALITÀ PANNELLO ADMIN

### Tab 1 — Prodotti 🕯️
Gestione completa del catalogo candele:

| Azione | Descrizione |
|---|---|
| **Nuovo prodotto** | Apre il form con tutti i campi |
| **Modifica** | Carica i dati esistenti nel form |
| **Elimina** | Chiede conferma, poi cancella dal DB |

**Campi del form:**
- Nome candela (es. "Pomeriggio d'Ambra")
- Note olfattive (es. "Fico · Cedro · Vaniglia")
- Descrizione breve
- Prezzo (es. "€ 35")
- Tag opzionale (es. "Bestseller", "Novità")
- Immagine: scegli dalla libreria **oppure** carica una nuova foto

### Tab 2 — Immagini 🖼️
Libreria di tutte le foto nel bucket `candele`:

| Azione | Descrizione |
|---|---|
| **Carica immagini** | Upload multiplo (JPG, PNG, WebP) |
| **Elimina** | Richiede conferma, poi cancella dal bucket |

> Le immagini caricate qui sono disponibili nel selettore del form prodotti.

---

## 6. FLUSSO: AGGIUNGERE UNA CANDELA

1. Vai su `/admin/login` e accedi
2. Tab **Prodotti** → click **+ Nuovo prodotto**
3. Compila nome, note, descrizione, prezzo
4. Scegli l'immagine dalla libreria (o caricane una nuova)
5. Click **Salva prodotto**
6. La candela è ora nel database e visibile sul sito

> ✅ Se `imageSource` è `'supabase'` il sito si aggiorna automaticamente,
> senza bisogno di fare un nuovo deploy.

---

## 7. SITO IN LAVORAZIONE

```typescript
// src/environments/environment.ts
comingSoon: false  // ← imposta true per mostrare la pagina di attesa
```

Quando `true`, il sito mostra una pagina elegante con la fiamma animata
e i link diretti a WhatsApp / email.
La route `/admin` rimane comunque accessibile.

---

## 8. RIEPILOGO FILE CHIAVE

| File | Scopo |
|---|---|
| `src/environments/environment.ts` | Config sviluppo (Supabase, imageSource, contatti) |
| `src/environments/environment.prod.ts` | Config produzione |
| `src/app/core/services/supabase.service.ts` | Tutta la logica Supabase (auth, storage, DB) |
| `src/app/core/guards/auth.guard.ts` | Protezione route admin |
| `src/app/pages/admin/admin-login/` | Pagina di login |
| `src/app/pages/admin/admin-dashboard/` | Pannello gestione prodotti + immagini |
| `src/app/app.routes.ts` | Route (incluse `/admin` e `/admin/login`) |

---

## 9. LINK UTILI

| Risorsa | URL |
|---|---|
| Dashboard Supabase | https://supabase.com/dashboard |
| Documentazione Supabase JS | https://supabase.com/docs/reference/javascript |
| Supabase Storage Docs | https://supabase.com/docs/guides/storage |
