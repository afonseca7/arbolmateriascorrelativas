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

    // Paso 1: calcular rango real de horas
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

    // Redondear a múltiplos de 15
    minMin = Math.floor(minMin / 15) * 15;
    maxMin = Math.ceil(maxMin / 15) * 15;

    // Generar lista de tiempos (cada 15 min)
    const tiempos = [];
    for (let t = minMin; t < maxMin; t += 15) {
      tiempos.push(t); // guardamos en minutos para operar fácil
    }

    const diasVisibles = tieneSabado ? DIAS : DIAS.filter(d => d !== 'Sáb');

    // Paso 2: construir mapa de celdas
    // clave: "dia-minutos" -> datos o { ocupado: true }
    const celdas = {};

    cursando.forEach(m => {
      if (!m.horarios) return;
      const color = ANIOS[m.anio].color;

      m.horarios.forEach(h => {
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);

        // rowSpan = cuántos bloques de 15min ocupa exactamente
        const rowSpan = Math.round((fin - ini) / 15);

        // Solo crear celda si ese bloque de inicio existe en nuestras filas
        if (ini >= minMin && ini < maxMin) {
          const key = `${h.dia}-${ini}`;
          if (!celdas[key]) {
            celdas[key] = { materia: m, color, inicio: h.inicio, fin: h.fin, rowSpan };
          }

          // Marcar bloques intermedios como ocupados
          for (let t = ini + 15; t < fin; t += 15) {
            const k = `${h.dia}-${t}`;
            if (!celdas[k]) celdas[k] = { ocupado: true };
          }
        }
      });
    });

    return { filas: tiempos, diasVisibles, celdas };
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
            {filas.map((mins, filaIdx) => {
              const hora = minutesToTime(mins);
              const mostrarLabel = filaIdx % 2 === 0;

              return (
                <tr key={mins} className={mostrarLabel ? 'tr-label' : 'tr-sub'}>
                  <td className="td-hora">{mostrarLabel ? hora : ''}</td>

                  {diasVisibles.map(dia => {
                    const key = `${dia}-${mins}`;
                    const celda = celdas[key];

                    // Bloque intermedio: no renderizar celda (rowSpan lo cubre)
                    if (celda?.ocupado) return null;

                    // Bloque con materia
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

                    // Celda vacía
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
