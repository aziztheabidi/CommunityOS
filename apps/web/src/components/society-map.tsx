"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LngLatBounds,
  Map,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  AREA_FILL_COLORS,
  AREA_LINE_COLORS,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_LAYER_TOGGLES,
  DEFAULT_MAP_ZOOM,
  FEATURE_MARKER_COLORS,
  buildBasemapStyle,
  type BasemapId,
} from "@communityos/maps";
import { DEFAULT_SOCIETY_ID, fetchMapGeoJson, type MapFeatureCollection } from "@/lib/api";

export type MapSelection = {
  id: string;
  name: string;
  kind: string;
  details: Record<string, unknown>;
} | null;

type SocietyMapProps = {
  societyId?: string;
  className?: string;
  onSelect?: (selection: MapSelection) => void;
  compact?: boolean;
};

function addOverlayLayers(
  map: Map,
  getOnSelect: () => ((selection: MapSelection) => void) | undefined,
) {
  if (!map.getSource("communityos")) {
    map.addSource("communityos", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }

  if (!map.getLayer("areas-fill")) {
    map.addLayer({
      id: "areas-fill",
      type: "fill",
      source: "communityos",
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: {
        "fill-color": [
          "match",
          ["get", "levelKey"],
          "phase",
          AREA_FILL_COLORS.phase ?? "#ffffff33",
          "sector",
          AREA_FILL_COLORS.sector ?? "#5eead455",
          "block",
          AREA_FILL_COLORS.block ?? "#f5f3ef66",
          "#ffffff33",
        ],
        "fill-opacity": 0.45,
      },
    });
  }

  if (!map.getLayer("areas-line")) {
    map.addLayer({
      id: "areas-line",
      type: "line",
      source: "communityos",
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: {
        "line-color": [
          "match",
          ["get", "levelKey"],
          "phase",
          AREA_LINE_COLORS.phase ?? "#ffffff",
          "sector",
          AREA_LINE_COLORS.sector ?? "#99f6e4",
          "block",
          AREA_LINE_COLORS.block ?? "#f5f3ef",
          "#ffffff",
        ],
        "line-width": ["match", ["get", "levelKey"], "phase", 2.5, "sector", 2, 1.25],
      },
    });
  }

  if (!map.getLayer("points")) {
    map.addLayer({
      id: "points",
      type: "circle",
      source: "communityos",
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-radius": [
          "case",
          ["==", ["get", "layer"], "events"],
          9,
          ["==", ["get", "layer"], "businesses"],
          8,
          ["==", ["get", "layer"], "properties"],
          5,
          7,
        ],
        "circle-color": [
          "case",
          ["==", ["get", "layer"], "events"],
          "#0b1f24",
          ["==", ["get", "layer"], "businesses"],
          "#0f6b6b",
          ["==", ["get", "layer"], "properties"],
          "#f5f3ef",
          [
            "match",
            ["get", "featureType"],
            "gate",
            FEATURE_MARKER_COLORS.gate ?? "#0b1f24",
            "park",
            FEATURE_MARKER_COLORS.park ?? "#1f7a4d",
            "school",
            FEATURE_MARKER_COLORS.school ?? "#0f6b6b",
            "place_of_worship",
            FEATURE_MARKER_COLORS.place_of_worship ?? "#5b4b8a",
            "medical",
            FEATURE_MARKER_COLORS.medical ?? "#b42318",
            "commercial",
            FEATURE_MARKER_COLORS.commercial ?? "#c45c26",
            "office",
            FEATURE_MARKER_COLORS.office ?? "#355c7d",
            "community_center",
            FEATURE_MARKER_COLORS.community_center ?? "#0f6b6b",
            FEATURE_MARKER_COLORS.other ?? "#6b7280",
          ],
        ],
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "#ffffff",
      },
    });
  }

  const clickArea = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature?.properties) return;
    getOnSelect()?.({
      id: String(feature.properties.id),
      name: String(feature.properties.name),
      kind: String(feature.properties.levelKey ?? "area"),
      details: feature.properties as Record<string, unknown>,
    });
  };

  const clickPoint = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature?.properties) return;
    getOnSelect()?.({
      id: String(feature.properties.id),
      name: String(feature.properties.name),
      kind: String(feature.properties.layer ?? feature.properties.featureType ?? "point"),
      details: feature.properties as Record<string, unknown>,
    });
  };

  map.off("click", "areas-fill", clickArea);
  map.off("click", "points", clickPoint);
  map.on("click", "areas-fill", clickArea);
  map.on("click", "points", clickPoint);

  map.on("mouseenter", "areas-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "areas-fill", () => {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "points", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "points", () => {
    map.getCanvas().style.cursor = "";
  });
}

export function SocietyMap({
  societyId = DEFAULT_SOCIETY_ID,
  className,
  onSelect,
  compact = false,
}: SocietyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const dataRef = useRef<MapFeatureCollection | null>(null);
  const onSelectRef = useRef(onSelect);
  const [basemap, setBasemap] = useState<BasemapId>("satellite");
  const [layers, setLayers] = useState(
    () =>
      new Set(
        DEFAULT_MAP_LAYER_TOGGLES.filter((layer) => layer.defaultOn).map((layer) => layer.id),
      ),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appliedBasemapRef = useRef<BasemapId>("satellite");
  const layerKey = useMemo(() => [...layers].sort().join(","), [layers]);

  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    const map = new Map({
      container: containerRef.current,
      style: buildBasemapStyle("satellite") as StyleSpecification,
      center: DEFAULT_MAP_CENTER,
      zoom: compact ? DEFAULT_MAP_ZOOM - 0.4 : DEFAULT_MAP_ZOOM,
      attributionControl: {},
    });

    map.addControl(new NavigationControl({ visualizePitch: false }), "top-right");
    mapRef.current = map;
    appliedBasemapRef.current = "satellite";

    map.on("load", () => {
      if (cancelled) return;
      addOverlayLayers(map, () => onSelectRef.current);
      setReady(true);
    });

    map.on("error", (event) => {
      const message = event.error?.message ?? "Map failed to load";
      if (!cancelled) setError(message);
    });

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [compact]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (basemap === appliedBasemapRef.current) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    appliedBasemapRef.current = basemap;
    map.setStyle(buildBasemapStyle(basemap) as StyleSpecification);
    map.once("style.load", () => {
      addOverlayLayers(map, () => onSelectRef.current);
      map.jumpTo({ center, zoom });
      if (dataRef.current) {
        const source = map.getSource("communityos") as GeoJSONSource | undefined;
        source?.setData(dataRef.current as unknown as GeoJSON.FeatureCollection);
      }
    });
  }, [basemap, ready]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;

    fetchMapGeoJson(societyId, [...layers])
      .then((collection: MapFeatureCollection) => {
        if (cancelled || !mapRef.current) return;
        dataRef.current = collection;
        const source = mapRef.current.getSource("communityos") as GeoJSONSource | undefined;
        source?.setData(collection as unknown as GeoJSON.FeatureCollection);

        const bounds = new LngLatBounds();
        let hasBounds = false;
        for (const feature of collection.features) {
          if (feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            bounds.extend([lng, lat]);
            hasBounds = true;
          }
          if (feature.geometry.type === "Polygon") {
            const rings = feature.geometry.coordinates as number[][][];
            for (const ring of rings[0] ?? []) {
              bounds.extend([ring[0]!, ring[1]!]);
              hasBounds = true;
            }
          }
        }
        if (hasBounds && !compact) {
          mapRef.current.fitBounds(bounds, { padding: 48, duration: 600, maxZoom: 16.5 });
        } else if (!hasBounds) {
          mapRef.current.jumpTo({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, societyId, layerKey, layers, compact]);

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="mr-1 flex overflow-hidden rounded-lg border border-[var(--cos-border)] bg-white text-xs font-semibold">
          {(
            [
              ["satellite", "Satellite"],
              ["streets", "Streets"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setBasemap(id)}
              className={`px-3 py-1.5 transition ${
                basemap === id
                  ? "bg-[var(--cos-ink)] text-white"
                  : "text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)] hover:bg-[var(--cos-sand)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {DEFAULT_MAP_LAYER_TOGGLES.map((layer) => {
          const active = layers.has(layer.id);
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => {
                setLayers((current) => {
                  const next = new Set(current);
                  if (next.has(layer.id)) next.delete(layer.id);
                  else next.add(layer.id);
                  return next;
                });
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-[var(--cos-teal)] text-white shadow-sm"
                  : "bg-white/80 text-[var(--cos-ink)] ring-1 ring-[var(--cos-border)]"
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-2xl ring-1 ring-[var(--cos-border)] ${
          compact ? "h-[280px]" : "h-[min(70vh,640px)]"
        }`}
      />
      {error ? (
        <p className="mt-2 text-sm text-[var(--cos-danger)]">Map data unavailable: {error}</p>
      ) : null}
    </div>
  );
}
