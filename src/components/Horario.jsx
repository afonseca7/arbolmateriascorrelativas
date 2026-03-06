import { useMemo } from 'react';
import { ANIOS } from '../data/materias';
import './Horario.css';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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

  const { filas, diasVisibles, celdas } = useMemo(() => {
    let minMin = Infinity;
    let maxMin = -Infinity;
    let tieneSabado = false;

    // Paso 1: calcular rango de horas y días necesarios
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

    if (minMin === Infinity) {
      minMin = timeToMinutes('17:00');
      maxMin = timeToMinutes('23:15');
    }

    minMin = Math.floor(minMin / 15) * 15;
    maxMin = Math.ceil(maxMin / 15) * 15;

    // Generar filas de 15 en 15 minutos
    const filas = [];
    for (let t = minMin; t < maxMin; t += 15) {
      filas.push(minutesToTime(t));
    }

    const diasVisibles = tieneSabado ? DIAS : DIAS.filter(d => d !== 'Sáb');

    // Paso 2: construir mapa de celdas procesando CADA horario de CADA materia
    const celdas = {};

    cursando.forEach(m => {
      if (!m.horarios) return;
      const color = ANIOS[m.anio].color;

      m.horarios.forEach(h => {
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);
        const rowSpan = Math.round((fin - ini) / 15);

        // Celda de inicio
        const keyInicio = `${h.dia}-${h.inicio}`;
        celdas[keyInicio] = {
          materia: m,
          color,
          inicio: h.inicio,
          fin: h.fin,
          rowSpan,
          dia: h.dia,
        };

        // Marcar bloques intermedios como ocupados
        for (let t = ini + 15; t < fin; t += 15) {
          const k = `${h.dia}-${minutesToTime(t)}`;
          celdas[k] = { ocupado: true };
        }
      });
    });

    return { filas, diasVisibles, celdas };
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
              const mostrarLabel = filaIdx % 2 === 0;
              return (
                <tr key={hora} className={mostrarLabel ? 'tr-label' : 'tr-sub'}>
                  <td className="td-hora">{mostrarLabel ? hora : ''}</td>
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
