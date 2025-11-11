"use client";

import { useState, useCallback, useRef } from "react";
import { useLoadScript, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search } from "lucide-react";

const libraries: ("places" | "geometry")[] = ["places"];

const mapContainerStyle = {
	width: "100%",
	height: "400px"
};

const defaultCenter = {
	lat: 40.4168,
	lng: -3.7038
};

type LocationPickerProps = {
	direccion: string;
	latitud: string;
	longitud: string;
	onLocationChange: (data: { direccion: string; latitud: string; longitud: string }) => void;
	disabled?: boolean;
};

export function LocationPicker({ direccion, latitud, longitud, onLocationChange, disabled }: LocationPickerProps) {
	const [showMap, setShowMap] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries
	});

	// Calculate marker position and map center from props
	const getInitialPosition = () => {
		if (latitud && longitud) {
			const lat = parseFloat(latitud);
			const lng = parseFloat(longitud);
			if (!isNaN(lat) && !isNaN(lng)) {
				return { lat, lng };
			}
		}
		return null;
	};

	const markerPosition = getInitialPosition();
	const mapCenter = markerPosition || defaultCenter;

	const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
		autocompleteRef.current = autocomplete;
	}, []);

	const onPlaceChanged = useCallback(() => {
		if (autocompleteRef.current) {
			const place = autocompleteRef.current.getPlace();

			if (place.geometry?.location) {
				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();
				const address = place.formatted_address || "";

				onLocationChange({
					direccion: address,
					latitud: lat.toString(),
					longitud: lng.toString()
				});

				setSearchInput("");
			}
		}
	}, [onLocationChange]);

	const onMapClick = useCallback(
		(e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				const lat = e.latLng.lat();
				const lng = e.latLng.lng();

				// Reverse geocode to get address
				const geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: { lat, lng } }, (results, status) => {
					if (status === "OK" && results && results[0]) {
						onLocationChange({
							direccion: results[0].formatted_address,
							latitud: lat.toString(),
							longitud: lng.toString()
						});
					} else {
						onLocationChange({
							direccion: direccion || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
							latitud: lat.toString(),
							longitud: lng.toString()
						});
					}
				});
			}
		},
		[direccion, onLocationChange]
	);

	if (loadError) {
		return <div className="text-destructive text-sm">Error al cargar Google Maps</div>;
	}

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Search Input with Autocomplete */}
			<div className="grid gap-2">
				<Label htmlFor="location-search">
					<Search className="inline h-4 w-4 mr-1" />
					Buscar ubicación
				</Label>
				<Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
					<Input id="location-search" placeholder="Busca un lugar (ej: Centro de Reciclaje Madrid)" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={disabled} />
				</Autocomplete>
				<p className="text-xs text-muted-foreground">Escribe el nombre del centro para buscar su ubicación automáticamente</p>
			</div>

			{/* Current Address Display */}
			{direccion && (
				<div className="rounded-md bg-muted p-3">
					<div className="flex items-start gap-2">
						<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
						<div className="flex-1">
							<p className="text-sm font-medium">Ubicación seleccionada:</p>
							<p className="text-sm text-muted-foreground">{direccion}</p>
							{latitud && longitud && (
								<p className="text-xs text-muted-foreground mt-1">
									Coordenadas: {parseFloat(latitud).toFixed(6)}, {parseFloat(longitud).toFixed(6)}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Toggle Map Button */}
			<Button type="button" variant="outline" onClick={() => setShowMap(!showMap)} disabled={disabled} className="w-full">
				{showMap ? "Ocultar mapa" : "¿No encuentras la ubicación? Usa el mapa interactivo"}
			</Button>

			{/* Interactive Map */}
			{showMap && (
				<div className="space-y-2">
					<Label>
						<MapPin className="inline h-4 w-4 mr-1" />
						Mapa interactivo
					</Label>
					<div className="rounded-md overflow-hidden border">
						<GoogleMap
							mapContainerStyle={mapContainerStyle}
							center={mapCenter}
							zoom={15}
							onClick={onMapClick}
							options={{
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false
							}}
						>
							{markerPosition && <Marker position={markerPosition} />}
						</GoogleMap>
					</div>
					<p className="text-xs text-muted-foreground">Haz clic en el mapa para seleccionar una ubicación precisa</p>
				</div>
			)}
		</div>
	);
}
