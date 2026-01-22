
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/lib/data";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
    properties: Property[];
    className?: string;
    center?: [number, number];
    zoom?: number;
}

export const PropertyMap = ({ properties, className, center, zoom = 13 }: PropertyMapProps) => {
    // Default center to first property or a fallback (San Francisco)
    const mapCenter: [number, number] = center ||
        (properties.length > 0 && properties[0].coordinates ? [properties[0].coordinates.lat, properties[0].coordinates.lng] : [37.7749, -122.4194]);

    return (
        <div className={`h-[400px] w-full rounded-xl overflow-hidden ${className}`}>
            <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {properties.map((property) => (
                    property.coordinates && (
                        <Marker
                            key={property.id}
                            position={[property.coordinates.lat, property.coordinates.lng]}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-semibold text-sm">{property.title}</h3>
                                    <p className="text-xs text-muted-foreground">${property.price}/mo</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};
