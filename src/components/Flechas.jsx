import { useEffect, useState } from 'react';

// Dibuja las flechas SVG entre cards usando sus posiciones reales en el DOM
export default function Flechas({ materias, resaltadaId, contenedorRef }) {
  const [lineas, setLineas] = useState([]);

  useEffect(() => {
    const calcular = () => {
      if (!contenedorRef.current) return;
      const contenedor = contenedorRef.current;
      const rect = contenedor.getBoundingClientRect();
      const scrollLeft = contenedor.scrollLeft;
      const scrollTop = contenedor.scrollTop;

      const nuevasLineas = [];

      materias.forEach((materia) => {
        const todasCorrelativas = [
          ...materia.correlativasCursar.map((id) => ({ id, tipo: 'cursar' })),
          ...materia.correlativasAprobar.map((id) => ({ id, tipo: 'aprobar' })),
        ];

        todasCorrelativas.forEach(({ id, tipo }) => {
          const origen = document.getElementById(`materia-${id}`);
          const destino = document.getElementById(`materia-${materia.id}`);
          if (!origen || !destino) return;

          const ro = origen.getBoundingClientRect();
          const rd = destino.getBoundingClientRect();

          const x1 = ro.right - rect.left + scrollLeft;
          const y1 = ro.top + ro.height / 2 - rect.top + scrollTop;
          const x2 = rd.left - rect.left + scrollLeft;
          const y2 = rd.top + rd.height / 2 - rect.top + scrollTop;

          const dx = (x2 - x1) * 0.5;

          nuevasLineas.push({
            key: `${id}-${materia.id}-${tipo}`,
            x1, y1, x2, y2,
            cx1: x1 + dx, cy1: y1,
            cx2: x2 - dx, cy2: y2,
            tipo,
            origenId: id,
            destinoId: materia.id,
          });
        });
      });

      setLineas(nuevasLineas);
    };

    calcular();
    window.addEventListener('resize', calcular);
    const observer = new MutationObserver(calcular);
    if (contenedorRef.current) {
      observer.observe(contenedorRef.current, { childList: true, subtree: true, attributes: true });
    }
    return () => {
      window.removeEventListener('resize', calcular);
      observer.disconnect();
    };
  }, [materias, contenedorRef]);

  const esResaltada = (linea) =>
    resaltadaId &&
    (linea.origenId === resaltadaId || linea.destinoId === resaltadaId);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
    >
      <defs>
        <marker id="arrow-cursar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(79,124,255,0.6)" />
        </marker>
        <marker id="arrow-aprobar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,159,79,0.6)" />
        </marker>
        <marker id="arrow-cursar-hi" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(79,124,255,1)" />
        </marker>
        <marker id="arrow-aprobar-hi" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,159,79,1)" />
        </marker>
      </defs>

      {lineas.map((l) => {
        const hi = esResaltada(l);
        const color =
          l.tipo === 'cursar'
            ? hi ? 'rgba(79,124,255,0.9)' : 'rgba(79,124,255,0.18)'
            : hi ? 'rgba(255,159,79,0.9)' : 'rgba(255,159,79,0.18)';
        const markerId =
          l.tipo === 'cursar'
            ? hi ? 'url(#arrow-cursar-hi)' : 'url(#arrow-cursar)'
            : hi ? 'url(#arrow-aprobar-hi)' : 'url(#arrow-aprobar)';

        return (
          <path
            key={l.key}
            d={`M${l.x1},${l.y1} C${l.cx1},${l.cy1} ${l.cx2},${l.cy2} ${l.x2},${l.y2}`}
            stroke={color}
            strokeWidth={hi ? 2 : 1}
            fill="none"
            markerEnd={markerId}
            style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
          />
        );
      })}
    </svg>
  );
}
