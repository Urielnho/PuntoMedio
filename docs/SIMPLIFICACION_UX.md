# Simplificación de formularios

## Criterio

La interfaz solo solicita información que una persona reconoce y puede responder sin conocimientos técnicos. Identificadores, revisiones y coordenadas permanecen en la capa de servicios.

## Flujos ajustados

- **Crear encuentro:** motivo y permiso puntual de ubicación.
- **Aceptar encuentro:** código de invitación y permiso puntual de ubicación.
- **Pedir una recogida:** nombre, descripción, categoría elegible, origen, destino, indicaciones opcionales y confirmación simple de pago.
- **Registro:** los consentimientos legales se presentan en una sola selección.

## Privacidad

- No se solicita ubicación en segundo plano.
- La ubicación se obtiene únicamente al confirmar una acción que la necesita.
- Las direcciones exactas continúan protegidas por las reglas de acceso del servicio.
- La aplicación no muestra latitud o longitud al usuario.

## Decisiones pendientes

- Sustituir la geocodificación del sistema por un selector visual de direcciones cuando se apruebe un proveedor de mapas.
- Evaluar si la ciudad puede inferirse después del registro sin perjudicar la disponibilidad local de servicios.
