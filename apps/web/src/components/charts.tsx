const CHART_COLORS = ["#0f6b6b", "#3d8a8a", "#6aa3a3", "#97bcbc", "#c4d6d6"];

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
  const barWidth = 26;
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
              style={{ animationDelay: `${index * 40}ms` }}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 2)}
              rx={6}
              fill={color}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill="var(--cos-ink)"
              fontSize="11"
              fontWeight="600"
            >
              {item.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fill="color-mix(in oklab, var(--cos-ink) 50%, transparent)"
              fontSize="10"
              fontWeight="500"
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
  size = 168,
  centerLabel,
  centerValue,
}: {
  data: ChartDatum[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 58;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg width={size} height={size} viewBox="0 0 180 180" role="img" aria-label="Donut chart">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#ebe7e0" strokeWidth={stroke} />
        {data.map((item, index) => {
          const length = (item.value / total) * circumference;
          const circle = (
            <circle
              key={item.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 90 90)"
            />
          );
          offset += length;
          return circle;
        })}
        <text
          x="90"
          y={centerLabel ? "86" : "94"}
          textAnchor="middle"
          fill="var(--cos-ink)"
          fontSize="20"
          fontWeight="650"
          fontFamily="var(--cos-font-display)"
        >
          {centerValue ?? total}
        </text>
        {centerLabel ? (
          <text
            x="90"
            y="106"
            textAnchor="middle"
            fill="color-mix(in oklab, var(--cos-ink) 50%, transparent)"
            fontSize="11"
            fontWeight="500"
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
                className="h-2 w-2 rounded-full"
                style={{
                  background: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <span className="text-ink">{item.label}</span>
            </span>
            <span className="font-semibold text-ink">{item.value}</span>
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
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="text-ink">{item.label}</span>
            <span className="font-semibold text-ink">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--cos-sand-deep)]">
            <div
              className="cos-chart-bar h-full rounded-full bg-[var(--cos-teal)]"
              style={{
                width: `${Math.max(4, (item.value / max) * 100)}%`,
                animationDelay: `${index * 40}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
