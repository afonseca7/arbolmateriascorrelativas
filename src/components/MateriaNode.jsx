import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ESTADOS, ANIOS } from '../data/materias';
import './MateriaNode.css';

const MateriaNode = memo(function MateriaNode({ data }) {
  const { materia, onCambiar, onHover, onHoverLeave, relacionados } = data;
  const estado = ESTADOS[materia.estado];
  const anio = ANIOS[materia.anio];

  return (
    <div
      className={`mnode ${materia.estado} ${materia.estado !== 'bloqueada' ? 'clickable' : ''}`}
      style={{ '--ec': estado.color, '--eb': estado.bg, '--ac': anio.color }}
      onClick={() => materia.estado !== 'bloqueada' && onCambiar(materia.id)}
      onMouseEnter={() => onHover(materia.id, relacionados)}
      onMouseLeave={() => onHoverLeave()}
      title={
        materia.estado === 'bloqueada'
          ? 'Cumplí las correlativas primero'
          : `Click → ${
              materia.estado === 'disponible' ? 'Cursando' :
              materia.estado === 'cursando'   ? 'Final pendiente' :
              materia.estado === 'previa'     ? 'Aprobada' : 'Disponible'
            }`
      }
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div className="mnode-header">
        <span className="mnode-anio">{anio.label}</span>
        {materia.esIntegradora && <span className="mnode-int">INT</span>}
      </div>

      <div className="mnode-nombre">{materia.nombre}</div>

      <div className="mnode-footer">
        <span className="mnode-icon">{estado.icon}</span>
        <span className="mnode-label">{estado.label}</span>
        <span className="mnode-id">#{materia.id}</span>
      </div>

      <div className="mnode-bar" />

      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  );
});

export default MateriaNode;
