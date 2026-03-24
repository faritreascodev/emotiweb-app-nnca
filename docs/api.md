# Estándares de Integración API REST

## Criterios Generales
- Content-Type soportado: `application/json`
- Autorización: Vía Header HTTP de esquema `Bearer`. Estándar de JWT firmado remotamente.

## Patrones de Respuesta y Error Handling
La API emplea una capa *Middleware* uniforme (Enveloping) que previene variabilidad de contratos al front.

**Respuesta Exitosa Padrón (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación satisfactoria."
}
```

**Respuesta Errónea Estándar (`400`, `401`, `403`, `404`, `500`):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "details": "El campo emotion_id es mandatorio."
  }
}
```

## Convenciones de Código (HTTP Status Codes)
- **200/201:** Funciones read y write resueltas bajo autorización.
- **401 Unauthorized:** Falla de autenticación por JWT o expiración temporal.
- **403 Forbidden:** Credencial procesada con jerarquía insuficiente para ejecutar la ruta solicitada.
- **404 Not Found:** Recurso explícito apuntado está desaparecido o fue borrado.
- **500 Internal Error:** Excepciones en el core nunca expuestas para mitigar leaking.
