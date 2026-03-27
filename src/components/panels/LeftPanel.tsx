import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { StatBlock } from '../ui/StatBlock';

interface Props {
  coverage: string;
  lostSince2000: string;
  lossBarWidth: number;
  coverageBarWidth: number;
}

export function LeftPanel({ coverage, lostSince2000, lossBarWidth, coverageBarWidth }: Props) {
  return (
    // Outer div owns the fixed centering — untouched by framer-motion
    <div
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
      }}
    >
      {/* Inner motion element owns only the slide-in animation */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <PanelShell style={{ width: '172px' }}>
          <div style={{ marginBottom: '18px' }}>
            <PanelLabel>Forest Coverage</PanelLabel>
            <div style={{ marginTop: '8px' }}>
              <SectionDivider gradient />
            </div>
          </div>

          <StatBlock
            value={coverage}
            unit="%"
            label="Global Coverage"
            color="#4ade80"
            barWidth={coverageBarWidth}
            barColor="linear-gradient(to right, #15803d, #4ade80)"
          />

          <div style={{ margin: '16px 0' }}>
            <SectionDivider />
          </div>

          <StatBlock
            value={lostSince2000}
            unit="M km²"
            label="Lost Since 2000"
            color="#f87171"
            barWidth={lossBarWidth}
            barColor="linear-gradient(to right, #dc2626, #f87171)"
          />

          <div style={{ margin: '16px 0' }}>
            <SectionDivider />
          </div>

          <StatBlock
            value="~200K"
            unit="km²"
            label="Avg Annual Loss"
            color="#fb923c"
          />
        </PanelShell>
      </motion.aside>
    </div>
  );
}
