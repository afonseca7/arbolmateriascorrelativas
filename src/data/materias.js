// Datos del Plan 2023 - ISI UTN FRD
export const ESTADOS = {
  aprobada:  { label: 'Aprobada',        color: '#00e5a0', bg: 'rgba(0,229,160,0.12)',  icon: '✓' },
  cursando:  { label: 'Cursando',        color: '#ffd84f', bg: 'rgba(255,216,79,0.12)', icon: '◎' },
  previa:    { label: 'Final Pendiente', color: '#ff9f4f', bg: 'rgba(255,159,79,0.12)', icon: '◑' },
  disponible:{ label: 'Puedo anotarme', color: '#4f7cff', bg: 'rgba(79,124,255,0.14)', icon: '→' },
  bloqueada: { label: 'Sin cursar',      color: '#2e3a55', bg: 'rgba(46,58,85,0.3)',    icon: '○' },
};

export const ANIOS = {
  1: { label: '1° Año', color: '#7c6fff' },
  2: { label: '2° Año', color: '#4f7cff' },
  3: { label: '3° Año', color: '#4fb8ff' },
  4: { label: '4° Año', color: '#4fffd4' },
  5: { label: '5° Año', color: '#00e5a0' },
};

export const MATERIAS_INIT = [
  // ── 1° AÑO ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    nombre: 'Análisis Matemático 1',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '19:15', fin: '20:45' },
      { dia: 'Jue', inicio: '19:15', fin: '20:45' },
      { dia: 'Vie', inicio: '18:30', fin: '20:45' },
    ],
  },
  {
    id: 2,
    nombre: 'Álgebra y Geometría Analítica',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Lun', inicio: '19:15', fin: '20:45' },
      { dia: 'Mar', inicio: '18:30', fin: '20:45' },
      { dia: 'Jue', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 3,
    nombre: 'Física 1',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '17:00', fin: '20:45' },
    ],
  },
  {
    id: 4,
    nombre: 'Inglés 1',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '17:00', fin: '18:30' },
    ],
  },
  {
    id: 5,
    nombre: 'Lógica y Estructuras Discretas',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 6,
    nombre: 'Algoritmos y Estructuras de Datos',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '21:00', fin: '23:15' },
      { dia: 'Vie', inicio: '17:00', fin: '18:30' },
    ],
  },
  {
    id: 7,
    nombre: 'Arquitectura de Computadoras',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '17:45', fin: '20:45' },
    ],
  },
  {
    id: 8,
    nombre: 'Sistemas y Procesos de Negocio',
    anio: 1,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '18:30', fin: '20:45' },
    ],
  },

  // ── 2° AÑO ──────────────────────────────────────────────────────────────────
  {
    id: 9,
    nombre: 'Análisis Matemático 2',
    anio: 2,
    correlativasCursar: [1, 2],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '21:00', fin: '23:15' },
      { dia: 'Jue', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 10,
    nombre: 'Física 2',
    anio: 2,
    correlativasCursar: [1, 3],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '19:15', fin: '22:30' },
    ],
  },
  {
    id: 11,
    nombre: 'Ingeniería y Sociedad',
    anio: 2,
    correlativasCursar: [],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '17:00', fin: '20:45' },
    ],
  },
  {
    id: 12,
    nombre: 'Inglés 2',
    anio: 2,
    correlativasCursar: [4],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '17:00', fin: '18:30' },
    ],
  },
  {
    id: 13,
    nombre: 'Sintaxis y Semántica de los Lenguajes',
    anio: 2,
    correlativasCursar: [5, 6],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Lun', inicio: '18:30', fin: '21:45' },
    ],
  },
  {
    id: 14,
    nombre: 'Paradigmas de Programación',
    anio: 2,
    correlativasCursar: [5, 6],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '17:45', fin: '20:45' },
    ],
  },
  {
    id: 15,
    nombre: 'Sistemas Operativos',
    anio: 2,
    correlativasCursar: [7],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Lun', inicio: '17:45', fin: '20:45' },
    ],
  },
  {
    id: 16,
    nombre: 'Análisis de Sistemas de Información',
    anio: 2,
    esIntegradora: true,
    correlativasCursar: [6, 8],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Lun', inicio: '21:45', fin: '23:15' },
      { dia: 'Vie', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 17,
    nombre: 'Probabilidades y Estadísticas',
    anio: 2,
    correlativasCursar: [1, 2],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Vie', inicio: '17:45', fin: '20:45' },
    ],
  },

  // ── 3° AÑO ──────────────────────────────────────────────────────────────────
  {
    id: 18,
    nombre: 'Economía',
    anio: 3,
    correlativasCursar: [],
    correlativasAprobar: [1, 2],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Vie', inicio: '20:00', fin: '23:15' },
    ],
  },
  {
    id: 19,
    nombre: 'Bases de Datos',
    anio: 3,
    correlativasCursar: [13, 16],
    correlativasAprobar: [5, 6],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '17:45', fin: '22:30' },
    ],
  },
  {
    id: 20,
    nombre: 'Desarrollo de Software',
    anio: 3,
    correlativasCursar: [14, 16],
    correlativasAprobar: [5, 6],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '19:15', fin: '20:45' },
      { dia: 'Jue', inicio: '19:15', fin: '20:45' },
    ],
  },
  {
    id: 21,
    nombre: 'Comunicación de Datos',
    anio: 3,
    correlativasCursar: [],
    correlativasAprobar: [3, 7],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '17:45', fin: '19:15' },
      { dia: 'Vie', inicio: '18:30', fin: '19:15' },
    ],
  },
  {
    id: 22,
    nombre: 'Análisis Numérico',
    anio: 3,
    correlativasCursar: [9],
    correlativasAprobar: [1, 2],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '18:30', fin: '20:45' },
    ],
  },
  {
    id: 23,
    nombre: 'Diseño de Sistemas de Información',
    anio: 3,
    esIntegradora: true,
    correlativasCursar: [14, 16],
    correlativasAprobar: [4, 6, 8],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '21:00', fin: '23:15' },
      { dia: 'Jue', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 24,
    nombre: 'Legislación',
    anio: 3,
    correlativasCursar: [11],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '18:30', fin: '19:15' },
    ],
  },

  // ── 4° AÑO ──────────────────────────────────────────────────────────────────
  {
    id: 25,
    nombre: 'Ingeniería y Calidad de Software',
    anio: 4,
    correlativasCursar: [19, 20, 23],
    correlativasAprobar: [13, 14],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '21:00', fin: '23:15' },
      { dia: 'Vie', inicio: '20:00', fin: '22:30' },
    ],
  },
  {
    id: 26,
    nombre: 'Redes de Datos',
    anio: 4,
    correlativasCursar: [15, 21],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Vie', inicio: '20:00', fin: '23:15' },
    ],
  },
  {
    id: 27,
    nombre: 'Investigación Operativa',
    anio: 4,
    correlativasCursar: [17, 22],
    correlativasAprobar: [],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '19:15', fin: '22:30' },
    ],
  },
  {
    id: 28,
    nombre: 'Simulación',
    anio: 4,
    correlativasCursar: [17],
    correlativasAprobar: [9],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '17:45', fin: '19:15' },
      { dia: 'Vie', inicio: '18:30', fin: '19:15' },
    ],
  },
  {
    id: 29,
    nombre: 'Tecnologías para la Automatización',
    anio: 4,
    correlativasCursar: [10, 22],
    correlativasAprobar: [9],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '19:15', fin: '21:45' },
    ],
  },
  {
    id: 30,
    nombre: 'Administración de Sistemas de Información',
    anio: 4,
    esIntegradora: true,
    correlativasCursar: [18, 23],
    correlativasAprobar: [16],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Sáb', inicio: '09:00', fin: '12:45' },
    ],
  },

  // ── 5° AÑO ──────────────────────────────────────────────────────────────────
  {
    id: 31,
    nombre: 'Inteligencia Artificial',
    anio: 5,
    correlativasCursar: [28],
    correlativasAprobar: [17, 22],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mar', inicio: '18:30', fin: '20:45' },
    ],
  },
  {
    id: 32,
    nombre: 'Ciencia de Datos',
    anio: 5,
    correlativasCursar: [28],
    correlativasAprobar: [17, 19],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 33,
    nombre: 'Sistemas de Gestión',
    anio: 5,
    correlativasCursar: [18, 27],
    correlativasAprobar: [23],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '19:15', fin: '21:45' },
      { dia: 'Vie', inicio: '21:00', fin: '23:15' },
    ],
  },
  {
    id: 34,
    nombre: 'Gestión Gerencial',
    anio: 5,
    correlativasCursar: [24, 30],
    correlativasAprobar: [18],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Mié', inicio: '18:30', fin: '20:45' },
    ],
  },
  {
    id: 35,
    nombre: 'Seguridad en los Sistemas de Información',
    anio: 5,
    correlativasCursar: [26, 30],
    correlativasAprobar: [20, 21],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Jue', inicio: '17:00', fin: '19:15' },
    ],
  },
  {
    id: 36,
    nombre: 'Proyecto Final',
    anio: 5,
    esIntegradora: true,
    correlativasCursar: [25, 26, 30],
    correlativasAprobar: [12, 20, 23],
    estado: 'bloqueada',
    horarios: [
      { dia: 'Vie', inicio: '18:30', fin: '19:15' },
      { dia: 'Vie', inicio: '21:00', fin: '23:15' },
    ],
  },
];
