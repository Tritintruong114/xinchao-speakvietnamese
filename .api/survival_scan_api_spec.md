# API Specification: SurvivalScan

**Version:** 1.0.0 (MVP)  
**Base URL:** `https://api.xinchao.ai/v1` (Proxy to Supabase Edge Functions)

---

## 1. Process Scan
Process an image for OCR and contextual translation.

### Endpoint
`POST /scan`

### Request Headers
- `Authorization: Bearer <user_token>`
- `Content-Type: application/json`

### Request Body (JSON)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `image_base64` | String | Yes | Base64 encoded image string (or URL if stored) |
| `context` | Enum | Yes | `FOOD` or `SIGN` to guide the AI Persona |
| `lat` | Float | No | User's latitude for regional dialect adjustment |
| `lng` | Float | No | User's longitude |

### Response Body (Success 200)
```json
{
  "id": "scan_uuid_123",
  "result": {
    "raw_text": "Phở Bò Viên",
    "translated_text": "Beef Noodle Soup with Meatballs",
    "phonetic": "Fuh Baw Vee-en",
    "entities": [
      { "type": "dish", "value": "Phở Bò Viên" },
      { "type": "ingredient", "value": "Beef", "mod": "Meatballs" }
    ],
    "survival_phrase": "Cho tôi một bát phở bò viên",
    "survival_translation": "Give me one bowl of beef noodle soup with meatballs"
  },
  "usage": {
    "remaining": 4,
    "limit": 5,
    "reset_at": "2026-04-03T00:00:00Z"
  }
}
```

### Error Codes
| Status | Code | Message |
| :--- | :--- | :--- |
| 400 | `ERR_IMAGE_UNREADABLE` | The image is too blurry or dark. |
| 403 | `ERR_LIMIT_EXCEEDED` | You've used your 5 free scans for today. |
| 422 | `ERR_OFF_TOPIC` | This doesn't look like a menu or sign. |
| 500 | `ERR_AI_TIMEOUT` | Little Plastic Stool is taking too long. Try again! |

---

## 2. Usage Status
Check remaining scans for the day.

### Endpoint
`GET /scan/status`

### Response Body
```json
{
  "can_scan": true,
  "remaining": 2,
  "is_premium": false
}
```
