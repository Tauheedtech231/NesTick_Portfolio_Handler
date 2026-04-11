// components/Charts.tsx
'use client';

export function SimpleLineChart({ data, height = 140, color = '#6C63FF' }: { data: number[]; height?: number; color?: string }) {
  const max = Math.max(...data);
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${height - (val / max) * height}`).join(' ');
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="rounded-lg">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      <polygon points={`0,${height} ${points} 100,${height}`} fill={`${color}20`} />
    </svg>
  );
}

export function SimpleBarChart({ data, height = 120, color = '#6C63FF' }: { data: number[]; height?: number; color?: string }) {
  const max = Math.max(...data);
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-[#1E2235] rounded-t-md overflow-hidden" style={{ height: `${(val / max) * height}px` }}>
            <div className="w-full h-full rounded-t-md transition-all" style={{ height: `${(val / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="text-[10px] text-[#5A6180]">{months[i % months.length]}</span>
        </div>
      ))}
    </div>
  );
}

export function SimpleDonutChart({ data, size = 120 }: { data: number[]; size?: number }) {
  const total = data.reduce((a, b) => a + b, 0);
  const colors = ['#2DD4A0', '#FF9F43', '#FF5B6B'];
  let currentAngle = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={size/2} cy={size/2} r={size/2.5} fill="#1E2235" />
      {data.map((val, i) => {
        const angle = (val / total) * 360;
        const start = currentAngle;
        const end = start + angle;
        currentAngle = end;
        
        const startRad = (start - 90) * Math.PI / 180;
        const endRad = (end - 90) * Math.PI / 180;
        const r = size/2.5;
        const cx = size/2;
        const cy = size/2;
        
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        
        const largeArc = angle > 180 ? 1 : 0;
        
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={colors[i]}
            stroke="#131625"
            strokeWidth="2"
          />
        );
      })}
      <circle cx={size/2} cy={size/2} r={size/3.5} fill="#131625" />
    </svg>
  );
}