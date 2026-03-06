// Calcula el estado real de cada materia según las aprobadas/cursando
export function calcularEstados(materias) {
  return materias.map((materia) => {
    // Si ya tiene un estado manual "fuerte", lo respetamos
    if (
      materia.estado === 'aprobada' ||
      materia.estado === 'cursando' ||
      materia.estado === 'previa'
    ) {
      return materia;
    }

    const aprobadas = new Set(
      materias
        .filter((m) => m.estado === 'aprobada')
        .map((m) => m.id)
    );
    const cursandoOAprobadas = new Set(
      materias
        .filter((m) => m.estado === 'aprobada' || m.estado === 'cursando' || m.estado === 'previa')
        .map((m) => m.id)
    );

    const cumpleCursar = materia.correlativasCursar.every((id) =>
      cursandoOAprobadas.has(id)
    );
    const cumpleAprobar = materia.correlativasAprobar.every((id) =>
      aprobadas.has(id)
    );

    const disponible = cumpleCursar && cumpleAprobar;

    return {
      ...materia,
      estado: disponible ? 'disponible' : 'bloqueada',
    };
  });
}

// Dado un ID de materia, devuelve todos los IDs que dependen de ella (hijos directos e indirectos)
export function obtenerDependientes(id, materias) {
  const directos = materias
    .filter(
      (m) =>
        m.correlativasCursar.includes(id) ||
        m.correlativasAprobar.includes(id)
    )
    .map((m) => m.id);

  return directos;
}

// Ciclo de estado al hacer click
export function siguienteEstado(estadoActual) {
  const ciclo = {
    bloqueada: 'bloqueada', // no se puede cambiar manualmente
    disponible: 'cursando',
    cursando: 'previa',
    previa: 'aprobada',
    aprobada: 'disponible', // reset
  };
  return ciclo[estadoActual] ?? estadoActual;
}

export function estadoManual(estadoActual) {
  // Solo se puede cambiar si no está bloqueada
  return estadoActual !== 'bloqueada';
}
