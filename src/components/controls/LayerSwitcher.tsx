import { LAYER_CONFIGS } from '../../config/layers';
import type { LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
  onChange: (layer: LayerId) => void;
}

export function LayerSwitcher({ activeLayer, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '4px',
      }}
    >
      {LAYER_CONFIGS.map((layer) => {
        const active = layer.id === activeLayer;
        return (
          <button
            key={layer.id}
            onClick={() => onChange(layer.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: active
                ? '1px solid rgba(34,197,94,0.55)'
                : '1px solid rgba(255,255,255,0.09)',
              background: active
                ? 'rgba(34,197,94,0.13)'
                : 'rgba(255,255,255,0.04)',
              color: active ? '#4ade80' : 'rgba(226,232,240,0.5)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(226,232,240,0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'rgba(226,232,240,0.5)';
              }
            }}
          >
            <layer.Icon size={14} />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}