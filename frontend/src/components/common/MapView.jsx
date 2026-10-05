import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom SVG pin to avoid bundler issues with default marker images
const pinIcon = (color = '#4f46e5') =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:34px;height:34px;display:flex;align-items:center;justify-content:center;
      background:${color};border:3px solid white;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.25)">
      <span style="transform:rotate(45deg);font-size:14px;color:white">📍</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  })

function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    // Invalidate size when the map mounts inside lazy-loaded pages
    const t = setTimeout(() => map?.invalidateSize?.(), 400)
    return () => clearTimeout(t)
  }, [map])
  return null
}

export default function MapView({ markers = [], center, zoom = 12, className = 'h-[380px]', height = null }) {
  const defaultCenter = markers[0]?.position || center || [40.7128, -74.006]
  return (
    <div className={`${className} overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 z-0`} style={height ? { height } : undefined}>
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeFix />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} icon={pinIcon(m.color || '#4f46e5')}>
            {m.title && (
              <Popup>
                <div className="min-w-[140px]">
                  <p className="mb-1 text-sm font-bold">{m.title}</p>
                  {m.subtitle && <p className="text-xs text-slate-500">{m.subtitle}</p>}
                  {m.price && <p className="mt-1 text-xs font-bold text-emerald-600">{m.price}</p>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
