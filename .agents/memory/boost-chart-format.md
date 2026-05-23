---
name: BoostChart data format mismatch
description: The BoostChart component and the backend /boost-history endpoint use different key names for the same data.
---

## Rule
Always normalize `/api/boost-history` response data before passing it to `<BoostChart>`.

**BoostChart expects:** `{ day: string, value: number }`
**Backend returns:** `{ date: string, score: number, label: string }`

## Fix applied
In `frontend/src/pages/Inicio.jsx`, the `.then()` handler for `/boost-history` now maps the response:
```js
setHistory(raw.map(h => ({
  day: h.day ?? h.date ?? "—",
  value: h.value ?? h.score ?? 0,
  label: h.label ?? "",
})));
```

**Why:** When the backend is reachable (proxy now working), it returns `score`/`date` keys. BoostChart uses `dataKey="value"` and `XAxis dataKey="day"` — receiving `undefined` for these causes Recharts to render NaN, which triggers a React warning and blank chart.

**How to apply:** If the backend schema for boost-history ever changes, update the normalization mapping in Inicio.jsx. Never change BoostChart's `dataKey` props without also updating the normalization.
