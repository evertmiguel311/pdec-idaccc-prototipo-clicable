# PDEC · Prototipo clicable — Proyecto Hijo

Prototipo de pantallas **sin conexión a datos reales** (mock en el navegador, persistido solo en `localStorage` para que la demo se sienta viva entre clics). Construido para que el jefe apruebe el planteamiento antes de pasarlo a diseño final y a desarrollo.

**Objetivo de este prototipo:** mostrar visualmente cómo quedaría el acceso simplificado ("Proyecto Hijo") descrito en la propuesta — sin login propio, entrando desde un botón dentro de la plataforma actual de IDACCC — y cómo se ve la misma plataforma desde los dos roles: **JAC** (quien carga evidencia) e **IDACCC** (quien valida).

No busca ser el punto de partida técnico para el desarrollador ni el archivo de trabajo de la diseñadora — es HTML/CSS/JS plano justamente para que sea fácil de inspeccionar y para que, **una vez el jefe lo apruebe**, la diseñadora tenga una referencia clara de qué pantallas, flujos y textos ajustar en el diseño definitivo.

## Qué se puede recorrer

- **Pantalla de entrada** — simula el botón embebido en `idaccc.gov.co`, con dos accesos: uno para la JAC y otro para el equipo interno de IDACCC (sin login propio, tal como se propuso).
- **Inicio / avance general** — la pantalla vitrina: anillo de avance general del proceso, y las dos tarjetas de **Momento 1** (Fases 1 y 2) y **Momento 2** (Fases 3 a 6), cada una con su propio avance.
- **Portafolio IDACCC** — vista exclusiva del rol IDACCC: KPIs agregados y el listado de las JAC activas con su avance, tal como lo vería el equipo institucional dando seguimiento a varias juntas a la vez.
- **Pantalla de fase** (plantilla única reutilizada por las 6 fases) — Presentación y Caja de herramientas como modales, y el listado de componentes con su estado.
- **Detalle de componente** — completamente construido para **1.1 Socialización Inicial del Proceso** (Fase 1) y **2.1 Cartografía de la Vida Cotidiana** (Fase 2), con los formatos oficiales reales de `FORMATOS PDEC/`. El resto de los 25 componentes navega con una versión genérica del mismo patrón.
- **Diagnóstico de 3 estados**: Por cargar → En revisión → Validado. Sube evidencia como JAC y valida como IDACCC para ver el flujo completo de punta a punta.

## Cómo probarlo

Es un sitio 100% estático — no requiere instalación ni build. Ábrelo con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8080
```

y entra a `http://localhost:8080`. También puede abrirse directamente en GitHub Pages (ver más abajo) o abriendo `index.html` en el navegador.

En la esquina superior derecha hay controles de demo (**Cambiar de vista**, **Reiniciar demo**) — no son parte del producto, son solo para facilitar la presentación.

## Alcance y límites deliberados

- Sin backend, sin autenticación real, sin base de datos — todo es mock.
- Solo hay datos de ejemplo para una JAC ("JAC Villa Hermosa") y un portafolio simulado de 6 JAC para el panel IDACCC.
- El estado se guarda en `localStorage` del navegador — se pierde si se limpia el sitio o se abre en otro dispositivo. Usa "Reiniciar demo" para volver al punto de partida.
- La estructura de fases/componentes corresponde 1:1 a `FORMATOS PDEC/` (25 componentes en 6 fases).

---
EIA Softworks · Prototipo de revisión — PDEC-IDACCC
