const CHART_COLORS = [
  "#0d9488",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#0ea5e9",
  "#14b8a6",
  "#fb7185",
];

export type ChartDatum = {
  label: string;
  value: number;
  color?: string;
};

export function VerticalBarChart({
  data,
  height = 200,
}: {
  data: ChartDatum[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = Math.max(data.length * 56, 260);
  const topPad = 22;
  const bottomPad = 28;
  const chartHeight = height - topPad - bottomPad;
  const barWidth = 28;
  const gap = (width - data.length * barWidth) / (data.length + 1);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Bar chart"
    >
      {data.map((item, index) => {
        const h = (item.value / max) * chartHeight;
        const x = gap + index * (barWidth + gap);
        const y = topPad + (chartHeight - h);
        const color = item.color ?? CHART_COLORS[index % CHART_COLORS.length];
        return (
          <g key={item.label}>
            <rect
              className="cos-chart-bar"
              style={{ animationDelay: `${index * 60}ms` }}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 2)}
              rx={8}
              fill={color}
              opacity={0.92}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill="var(--cos-ink)"
              fontSize="11"
              fontWeight="700"
            >
              {item.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fill="color-mix(in oklab, var(--cos-ink) 55%, transparent)"
              fontSize="10"
              fontWeight="600"
            >
              {item.label.length > 8 ? `${item.label.slice(0, 7)}…` : item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({
  data,
  size = 180,
  centerLabel,
  centerValue,
}: {
  data: ChartDatum[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 64;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg width={size} height={size} viewBox="0 0 180 180" role="img" aria-label="Donut chart">
        <defs>
          {data.map((item, index) => (
            <linearGradient key={item.label} id={`donut-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop
                offset="0%"
                stopColor={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS[(index + 1) % CHART_COLORS.length]}
                stopOpacity="0.85"
              />
            </linearGradient>
          ))}
        </defs>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2ebe7" strokeWidth={stroke} />
        {data.map((item, index) => {
          const length = (item.value / total) * circumference;
          const circle = (
            <circle
              key={item.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={`url(#donut-${index})`}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
              className="cos-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            />
          );
          offset += length;
          return circle;
        })}
        <text
          x="90"
          y={centerLabel ? "84" : "94"}
          textAnchor="middle"
          className="fill-[var(--cos-ink)]"
          fontSize="22"
          fontWeight="700"
          fontFamily="var(--cos-font-display)"
        >
          {centerValue ?? total}
        </text>
        {centerLabel ? (
          <text
            x="90"
            y="104"
            textAnchor="middle"
            className="fill-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]"
            fontSize="11"
            fontWeight="600"
          >
            {centerLabel}
          </text>
        ) : null}
      </svg>
      <ul className="w-full space-y-2">
        {data.map((item, index) => (
          <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <span className="font-medium text-ink">{item.label}</span>
            </span>
            <span className="font-semibold text-[var(--cos-ink)]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HorizontalBars({ data }: { data: ChartDatum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((item, index) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-ink">{item.label}</span>
            <span className="font-semibold text-ink">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--cos-sand-deep)]">
            <div
              className="cos-chart-bar h-full rounded-full"
              style={{
                width: `${Math.max(4, (item.value / max) * 100)}%`,
                animationDelay: `${index * 70}ms`,
                background:
                  item.color ??
                  `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, ${CHART_COLORS[(index + 2) % CHART_COLORS.length]})`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
