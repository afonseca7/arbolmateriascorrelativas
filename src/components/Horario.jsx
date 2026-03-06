import { useMemo } from 'react';
import { ANIOS } from '../data/materias';
import './Horario.css';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Genera todos los bloques de 15 min entre 17:00 y 23:15
function generarBloques() {
  const bloques = [];
  for (let h = 17; h < 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      bloques.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    }
  }
  bloques.push('23:00', '23:15');
  // Agregar 09:00 a 12:45 para el sábado
  return bloques;
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

export default function Horario({ materias, onVolver }) {
  const cursando = materias.filter(m => m.estado === 'cursando');

  // Calcular rango de horas real según las materias
  const { filas, tieneSabado } = useMemo(() => {
    let minMin = Infinity;
    let maxMin = -Infinity;
    let tieneSabado = false;

    cursando.forEach(m => {
      if (!m.horarios) return;
      m.horarios.forEach(h => {
        if (h.dia === 'Sáb') { tieneSabado = true; return; }
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);
        if (ini < minMin) minMin = ini;
        if (fin > maxMin) maxMin = fin;
      });
    });

    if (minMin === Infinity) { minMin = timeToMinutes('17:00'); maxMin = timeToMinutes('23:15'); }

    // Redondear hacia abajo/arriba en bloques de 15
    minMin = Math.floor(minMin / 15) * 15;
    maxMin = Math.ceil(maxMin / 15) * 15;

    const filas = [];
    for (let t = minMin; t < maxMin; t += 15) {
      filas.push(minutesToTime(t));
    }

    return { filas, tieneSabado };
  }, [cursando]);

  const diasVisibles = tieneSabado ? DIAS : DIAS.filter(d => d !== 'Sáb');

  // Para cada celda (dia, fila) buscar qué materia ocupa ese bloque
  const celdas = useMemo(() => {
    // mapa: "dia-time" -> { materia, esInicio, rowSpan }
    const mapa = {};

    cursando.forEach(m => {
      if (!m.horarios) return;
      const anioColor = ANIOS[m.anio].color;

      m.horarios.forEach(h => {
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);
        const bloques = Math.round((fin - ini) / 15);

        const key = `${h.dia}-${h.inicio}`;
        if (!mapa[key]) {
          mapa[key] = { materia: m, color: anioColor, inicio: h.inicio, fin: h.fin, rowSpan: bloques, dia: h.dia };
        }

        // Marcar bloques intermedios como "ocupados"
        for (let t = ini + 15; t < fin; t += 15) {
          const k = `${h.dia}-${minutesToTime(t)}`;
          mapa[k] = { ocupado: true };
        }
      });
    });

    return mapa;
  }, [cursando]);

  if (cursando.length === 0) {
    return (
      <div className="horario-wrap">
        <div className="horario-header">
          <button className="btn-volver" onClick={onVolver}>← Volver al árbol</button>
          <div className="horario-title">Mi Horario</div>
        </div>
        <div className="horario-empty">
          No tenés materias en estado <span>Cursando</span> todavía.<br />
          Marcá una materia como cursando en el árbol para verla acá.
        </div>
      </div>
    );
  }

  return (
    <div className="horario-wrap">
      <div className="horario-header">
        <button className="btn-volver" onClick={onVolver}>← Volver al árbol</button>
        <div>
          <div className="horario-title">Mi Horario</div>
          <div className="horario-sub">{cursando.length} materia{cursando.length !== 1 ? 's' : ''} cursando</div>
        </div>
      </div>

      <div className="horario-scroll">
        <table className="horario-tabla">
          <thead>
            <tr>
              <th className="th-hora">Hora</th>
              {diasVisibles.map(d => (
                <th key={d} className="th-dia">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((hora, filaIdx) => {
              // Solo mostrar label cada 2 filas (30 min) para no saturar
              const mostrarLabel = filaIdx % 2 === 0;
              return (
                <tr key={hora} className={mostrarLabel ? 'tr-label' : 'tr-sub'}>
                  <td className="td-hora">
                    {mostrarLabel ? hora : ''}
                  </td>
                  {diasVisibles.map(dia => {
                    const key = `${dia}-${hora}`;
                    const celda = celdas[key];

                    if (celda?.ocupado) return null;

                    if (celda?.materia) {
                      return (
                        <td
                          key={dia}
                          rowSpan={celda.rowSpan}
                          className="td-materia"
                          style={{ '--mc': celda.color }}
                        >
                          <div className="celda-inner">
                            <div className="celda-nombre">{celda.materia.nombre}</div>
                            <div className="celda-hora">{celda.inicio} – {celda.fin}</div>
                          </div>
                        </td>
                      );
                    }

                    return <td key={dia} className="td-vacio" />;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
