# 🚀 Guía de Despliegue en Dokploy - EmotiWeb

He adaptado el sistema para que funcione perfectamente en `emotiweb.mltprdj.com`. Sigue estos pasos en tu panel de Dokploy:

## 1. Crear el Proyecto
1. Ve a tu panel de Dokploy.
2. Crea un nuevo **Proyecto** llamado `EmotiWeb`.

## 2. Crear el Servicio (Docker Compose)
1. Dentro del proyecto, selecciona **Create Service** y elige **Docker Compose**.
2. Conecta tu repositorio de GitHub (este código).
3. Asegúrate de que el archivo de configuración sea `docker-compose.yml`.

## 3. Configurar Variables de Entorno (IMPORTANTE)
En la pestaña **Environment** de tu servicio en Dokploy, agrega estas variables:

| Key | Value |
| :--- | :--- |
| `FRONTEND_URL` | `https://emotiweb.mltprdj.com` |
| `DB_NAME` | `emotiweb_db` |
| `DB_USER` | `emotiweb_user` |
| `DB_PASSWORD` | `[TuContraseñaSegura]` |
| `DB_ROOT_PASSWORD` | `[TuContraseñaRoot]` |
| `JWT_SECRET` | `[GeneraUnaClaveAleatoriaLarga]` |
| `JWT_REFRESH_SECRET`| `[GeneraOtraClaveLarga]` |

## 4. Configuración del Dominio
1. Ve a la pestaña **Domains** del servicio.
2. Agrega el dominio: `emotiweb.mltprdj.com`.
3. Selecciona el servicio **frontend** (puerto 80) para este dominio.
4. Activa **HTTPS (Let's Encrypt)**.

## 5. Desplegar
Haz clic en **Deploy**. Dokploy hará lo siguiente automáticamente:
1. Construirá la imagen del **Frontend** inyectando la URL de la API correctamente.
2. Levantará el **Backend** y la base de datos **MySQL**.
3. Ejecutará el script `init.sql` para crear todas las tablas y datos iniciales.

---

## 🛠️ Notas Técnicas de los cambios realizados:
- **Proxy Inverso**: He configurado Nginx en el frontend para que todas las llamadas a `/api/*` se redirijan internamente al backend. Esto evita problemas de CORS y HTTPS mezclado.
- **Variables Dinámicas**: El `docker-compose.yml` ahora acepta variables de entorno para que no tengas que editar el código nunca más.
- **Seguridad**: Se han eliminado los puertos expuestos innecesarios (MySQL y Backend directo) para proteger el servidor. Solo el puerto 80/443 del Frontend es visible.

¡Tu sistema está listo para la acción! 🐻✨
