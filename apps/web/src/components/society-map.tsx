"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LngLatBounds,
  Map,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  AREA_FILL_COLORS,
  AREA_LINE_COLORS,
  DEFAULT_MAP_LAYER_TOGGLES,
  FEATURE_MARKER_COLORS,
} from "@communityos/maps";
import { DEMO_SOCIETY_ID, fetchMapGeoJson, type MapFeatureCollection } from "@/lib/api";

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

export function SocietyMap({
  societyId = DEMO_SOCIETY_ID,
  className,
  onSelect,
  compact = false,
}: SocietyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [layers, setLayers] = useState(
    () =>
      new Set(
        DEFAULT_MAP_LAYER_TOGGLES.filter((layer) => layer.defaultOn).map((layer) => layer.id),
      ),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const layerKey = useMemo(() => [...layers].sort().join(","), [layers]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [73.055, 33.715],
      zoom: compact ? 13.2 : 13.6,
      attributionControl: {},
    });

    map.addControl(new NavigationControl({ visualizePitch: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("communityos", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

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
            AREA_FILL_COLORS.phase ?? "#0f6b6b33",
            "sector",
            AREA_FILL_COLORS.sector ?? "#1d8a8a55",
            "block",
            AREA_FILL_COLORS.block ?? "#c45c2644",
            "#0f6b6b33",
          ],
          "fill-opacity": 0.55,
        },
      });

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
            AREA_LINE_COLORS.phase ?? "#0b4f4f",
            "sector",
            AREA_LINE_COLORS.sector ?? "#0f6b6b",
            "block",
            AREA_LINE_COLORS.block ?? "#c45c26",
            "#0f6b6b",
          ],
          "line-width": ["match", ["get", "levelKey"], "phase", 2.5, "sector", 2, 1.25],
        },
      });

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
            "#5b4b8a",
            ["==", ["get", "layer"], "businesses"],
            "#0f6b6b",
            ["==", ["get", "layer"], "properties"],
            "#c45c26",
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
          "circle-stroke-color": "#fffcf7",
        },
      });

      map.on("click", "areas-fill", (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (!feature?.properties) return;
        onSelect?.({
          id: String(feature.properties.id),
          name: String(feature.properties.name),
          kind: String(feature.properties.levelKey ?? "area"),
          details: feature.properties as Record<string, unknown>,
        });
      });

      map.on("click", "points", (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (!feature?.properties) return;
        onSelect?.({
          id: String(feature.properties.id),
          name: String(feature.properties.name),
          kind: String(feature.properties.layer ?? feature.properties.featureType ?? "point"),
          details: feature.properties as Record<string, unknown>,
        });
      });

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

      setReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [compact, onSelect]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    let cancelled = false;

    fetchMapGeoJson(societyId, [...layers])
      .then((collection: MapFeatureCollection) => {
        if (cancelled || !mapRef.current) return;
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
          mapRef.current.fitBounds(bounds, { padding: 48, duration: 600, maxZoom: 15 });
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
      <div className="mb-3 flex flex-wrap gap-2">
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
