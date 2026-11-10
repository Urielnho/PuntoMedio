# Límite de servicios

Esta carpeta reserva los adaptadores de aplicación de las siguientes etapas. Actualmente no hay cliente HTTP, consultas, mutaciones, autenticación ni conexión con Supabase.

Las pantallas no deben importar SDK externos de backend. Los adaptadores deberán implementar contratos tipados y devolver errores controlados. La autorización de perfiles, asignación única de repartidor, códigos temporales, importes y transiciones de estado pertenece al backend.

La configuración pública está descrita en integrations/supabase/publicConfig.ts. Examinar variables no activa una conexión. Las credenciales administrativas nunca pueden utilizarse en la aplicación.
