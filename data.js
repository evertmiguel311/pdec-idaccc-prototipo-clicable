/**
 * Datos de demostración — Prototipo clicable PDEC (Proyecto Hijo)
 * Todo aquí es MOCK. No hay backend, no hay datos reales de ninguna JAC.
 * Estructura de fases/componentes tomada 1:1 de FORMATOS PDEC/ (25 componentes, 6 fases).
 */

const FASES = [
  {
    n: 1,
    momento: 1,
    nombre: 'Preparación y Organización del Proceso',
    resumen: 'Alistamiento institucional y comunitario antes de iniciar el diagnóstico: socializar el proceso, conformar el equipo de apoyo y dejar listo el plan de trabajo.',
    componentes: [
      { cod: '1.1', nombre: 'Socialización Inicial del Proceso', estado: 'por_cargar',
        formatos: [
          { cod: 'F1.1', nombre: 'Acta de Socialización Inicial del PDEC', tipo: 'Acta' },
          { cod: 'F1.1A', nombre: 'Registro de Asistencia', tipo: 'Registro' },
          { cod: 'F1.1B', nombre: 'Presentación Comunitaria del PDEC (Plantilla)', tipo: 'Plantilla' },
        ] },
      { cod: '1.2', nombre: 'Conformación del Comité de Apoyo PDEC', estado: 'validado' },
      { cod: '1.3', nombre: 'Actores Territoriales y Saberes Comunitarios', estado: 'validado' },
      { cod: '1.4', nombre: 'Plan de Trabajo Comunitario (PTC)', estado: 'en_revision' },
      { cod: '1.5', nombre: 'Organización Logística y Metodológica', estado: 'validado' },
    ],
  },
  {
    n: 2,
    momento: 1,
    nombre: 'Diagnóstico Participativo del Territorio',
    resumen: 'Construcción colectiva del diagnóstico: cartografía social, priorización de problemas, potencialidades locales y análisis DOFA comunitario.',
    componentes: [
      { cod: '2.1', nombre: 'Cartografía de la Vida Cotidiana', estado: 'por_cargar',
        formatos: [
          { cod: 'F2.1', nombre: 'Guía para cartografía de la vida cotidiana', tipo: 'Guía' },
          { cod: 'F2.1A', nombre: 'Formato de relatoría de cartografía social', tipo: 'Formato' },
        ] },
      { cod: '2.2', nombre: 'Problemas y Necesidades Prioritarias', estado: 'validado' },
      { cod: '2.3', nombre: 'Potencialidades, Saberes y Capacidades Locales', estado: 'en_revision' },
      { cod: '2.4', nombre: 'Análisis Situacional (DOFA Comunitaria)', estado: 'por_cargar' },
      { cod: '2.5', nombre: 'Consolidación y Validación del Diagnóstico', estado: 'por_cargar' },
    ],
  },
  {
    n: 3,
    momento: 2,
    nombre: 'Formulación del PDEC',
    resumen: 'A partir del diagnóstico validado, se construye la visión estratégica del territorio y se priorizan los proyectos comunitarios.',
    componentes: [
      { cod: '3.1', nombre: 'Visión Estratégica del Territorio', estado: 'validado' },
      { cod: '3.2', nombre: 'Objetivos Estratégicos del PDEC', estado: 'por_cargar' },
      { cod: '3.3', nombre: 'Objetivos por Categorías del Territorio', estado: 'por_cargar' },
      { cod: '3.4', nombre: 'Priorización de Proyectos Comunitarios', estado: 'por_cargar' },
      { cod: '3.5', nombre: 'Formulación Básica de Proyectos', estado: 'por_cargar' },
    ],
  },
  {
    n: 4,
    momento: 2,
    nombre: 'Validación del PDEC',
    resumen: 'El PDEC formulado se socializa de nuevo con la comunidad, se ajusta y se aprueba formalmente en asamblea.',
    componentes: [
      { cod: '4.1', nombre: 'Socialización Comunitaria del PDEC', estado: 'por_cargar' },
      { cod: '4.2', nombre: 'Revisión y Ajustes del PDEC', estado: 'por_cargar' },
      { cod: '4.3', nombre: 'Aprobación del PDEC en Asamblea', estado: 'por_cargar' },
    ],
  },
  {
    n: 5,
    momento: 2,
    nombre: 'Implementación del PDEC',
    resumen: 'Puesta en marcha del plan: planificación anual, ejecución de proyectos y articulación con actores del territorio.',
    componentes: [
      { cod: '5.1', nombre: 'Planificación Anual de Implementación', estado: 'por_cargar' },
      { cod: '5.2', nombre: 'Ejecución de Proyectos Comunitarios', estado: 'por_cargar' },
      { cod: '5.3', nombre: 'Gestión y Articulación Territorial', estado: 'por_cargar' },
      { cod: '5.4', nombre: 'Organización y Seguimiento Operativo', estado: 'por_cargar' },
    ],
  },
  {
    n: 6,
    momento: 2,
    nombre: 'Seguimiento y Evaluación del PDEC',
    resumen: 'Cierre del ciclo: seguimiento a la implementación, evaluación participativa de resultados y ajustes al plan.',
    componentes: [
      { cod: '6.1', nombre: 'Seguimiento a la Implementación del PDEC', estado: 'por_cargar' },
      { cod: '6.2', nombre: 'Evaluación Participativa de Resultados', estado: 'por_cargar' },
      { cod: '6.3', nombre: 'Ajustes y Actualización del PDEC', estado: 'por_cargar' },
    ],
  },
];

// JAC "propia" — la que se usa para el recorrido completo (login como JAC, y drill-down desde IDACCC)
const JAC_ACTUAL = { id: 'villa-hermosa', nombre: 'JAC Villa Hermosa', comuna: 'Comuna 2', municipio: 'Cartagena de Indias' };

// Portafolio de JAC que ve IDACCC (mock, solo agregados — no se navega al detalle real salvo Villa Hermosa)
const JAC_PORTAFOLIO = [
  { id: 'villa-hermosa', nombre: 'JAC Villa Hermosa', comuna: 'Comuna 2', validados: 5, enRevision: 2, total: 25, drillable: true },
  { id: 'el-pozon', nombre: 'JAC El Pozón', comuna: 'Comuna 4', validados: 14, enRevision: 1, total: 25, drillable: false },
  { id: 'nuevo-bosque', nombre: 'JAC Nuevo Bosque', comuna: 'Comuna 6', validados: 22, enRevision: 0, total: 25, drillable: false },
  { id: 'san-fernando', nombre: 'JAC San Fernando', comuna: 'Comuna 3', validados: 6, enRevision: 3, total: 25, drillable: false },
  { id: 'la-candelaria', nombre: 'JAC La Candelaria', comuna: 'Comuna 1', validados: 2, enRevision: 0, total: 25, drillable: false },
  { id: 'ceballos', nombre: 'JAC Ceballos', comuna: 'Comuna 5', validados: 11, enRevision: 2, total: 25, drillable: false },
];

const ESTADO_META = {
  por_cargar:  { etiqueta: 'Por cargar',  clase: 'estado--porcargar' },
  en_revision: { etiqueta: 'En revisión', clase: 'estado--revision' },
  validado:    { etiqueta: 'Validado',    clase: 'estado--validado' },
};
