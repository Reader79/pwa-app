# Application State Schema

Persistent data is stored in `localStorage` under the key `pwa-settings-v1` (load/save). Note: the import routine writes to `pwa-state`, which differs from the main key.

## Shape
```json
{
  "main": {
    "operatorName": "string",
    "shiftNumber": 1,
    "baseTime": 600
  },
  "machines": ["CNC-01", "CNC-02"],
  "parts": [
    {
      "id": "uuid",
      "name": "Part A",
      "operations": [
        { "name": "Op 10", "machineTime": 5, "extraTime": 1 }
      ]
    }
  ],
  "records": [
    {
      "id": "uuid",
      "date": "2025-10-12",
      "shiftType": "D",
      "entries": [
        {
          "machine": "CNC-01",
          "part": "Part A",
          "operation": "Op 10",
          "machineTime": 5,
          "extraTime": 1,
          "quantity": 10,
          "totalTime": 60
        }
      ]
    }
  ]
}
```

## Keys
- **STORAGE_KEY**: `pwa-settings-v1` (used by load/save)
- Import routine writes to `pwa-state` (be aware of the different key when debugging imported data)

## Invariants
- `shiftNumber` is an integer in [1..4].
- `baseTime` is minutes for expected per-shift baseline.
- Each `part.operations[*]` has non-negative integers for times.
- `records[*].date` uses `YYYY-MM-DD`.
- `totalTime` is `(machineTime + extraTime) * quantity` when present; otherwise computed on the fly.

## Example
```js
// Reading the current state (inside the app code):
const raw = localStorage.getItem('pwa-settings-v1');
const state = raw ? JSON.parse(raw) : null;
```
