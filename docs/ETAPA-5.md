# Etapa 5 — Van por mí

> Actualización — 7 de noviembre de 2026: el esquema, las políticas y los RPC
> de encargos ya están desplegados. Falta ejecutar pruebas multiusuario de
> publicación, oferta, asignación, recogida y entrega en dispositivos.

Fecha: 7 de noviembre de 2026. Esta etapa prepara el flujo de encargos de recogida y entrega. El código móvil supera la comprobación de TypeScript, pero el esquema no se ha aplicado ni probado contra una base Supabase porque aún no se proporcionan credenciales del proyecto independiente.

## Flujo preparado

1. Una cuenta con perfil completo publica título, descripción, categoría y valor declarado opcional.
2. Indica el estado del pago del producto: pagado, pendiente de confirmación o fuera de PuntoMedio.
3. Las etiquetas de zona son visibles; coordenadas e indicaciones exactas quedan en `private.job_locations`.
4. Una cuenta con modo repartidor habilitado puede revisar encargos abiertos y enviar una tarifa.
5. La persona solicitante compara tarifa, perfil público y reputación, y selecciona exactamente una oferta.
6. Si el producto estaba pendiente, la persona solicitante debe declararlo pagado antes de iniciar la recogida.
7. El repartidor inicia recogida y entrega mediante transiciones controladas.
8. La persona solicitante genera códigos privados de seis dígitos, con hash SHA-256, vencimiento de 10 minutos, uso único y límite de intentos.
9. El repartidor confirma recogida y entrega con esos códigos.
10. La persona solicitante confirma el cierre y se actualizan los servicios completados.

## Seguridad y concurrencia

- Se revocan las escrituras directas sobre `jobs` y `bids`.
- Las RPC verifican `auth.uid()`, perfil completo, modo repartidor, propiedad, estado y revisión optimista.
- La asignación bloquea el encargo y la oferta, crea una sola asignación y rechaza el resto atómicamente.
- Un solicitante no puede ofertar en su propio encargo y los bloqueos entre usuarios impiden interacción.
- Las ubicaciones privadas solo se consultan mediante una RPC para solicitante o repartidor asignado.
- El repartidor nunca adelanta dinero del producto.
- Esta etapa no confirma ni cobra el pago del servicio; los pagos simulados pertenecen a una etapa posterior.

## Interfaz móvil

- Publicar encargo.
- Explorar solicitudes abiertas reales.
- Enviar oferta con tarifa y nota.
- Comparar ofertas y elegir repartidor.
- Confirmar pago declarado del producto.
- Iniciar recogida y entrega.
- Emitir y consumir códigos de entrega.
- Consultar encargos en Actividad.

Las vistas son adaptaciones Midnight Violet porque la referencia Stitch no contiene estos flujos completos.

## Validación y pendientes

- `npm run mobile:typecheck`: aprobado.
- La migración fue creada con Supabase CLI v2.115.0 y revisada estáticamente.
- No se ejecutó SQL, RLS, asesores ni pruebas multiusuario.
- Falta configurar un proyecto Supabase independiente, aplicar migraciones y probar con dos cuentas reales.
- Faltan proveedor de mapas/geocodificación, chat, notificaciones y pagos simulados, cada uno reservado para su etapa.
