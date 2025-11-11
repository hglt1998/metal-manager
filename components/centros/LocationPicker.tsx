"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search } from "lucide-react";

const libraries: ("places" | "geometry")[] = ["places"];
const COUNTRIES = ["es"]; // Restricción por defecto a España

const mapContainerStyle = {
	width: "100%",
	height: "400px"
};

const defaultCenter = {
	lat: 40.4168, // Madrid
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
	const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
	const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const geocoderRef = useRef<google.maps.Geocoder | null>(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries
	});

	// Calcular posición del marcador directamente de los props
	const markerPosition = useCallback(() => {
		if (latitud && longitud) {
			const lat = parseFloat(latitud);
			const lng = parseFloat(longitud);
			if (!isNaN(lat) && !isNaN(lng)) {
				return { lat, lng };
			}
		}
		return null;
	}, [latitud, longitud])();

	const mapCenter = markerPosition || defaultCenter;

	// Inicializar servicios de Google Maps
	useEffect(() => {
		if (!isLoaded || typeof window === "undefined" || !window.google) return;

		if (!autocompleteServiceRef.current) {
			autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
		}

		if (!geocoderRef.current) {
			geocoderRef.current = new window.google.maps.Geocoder();
		}

		// PlacesService necesita un elemento DOM, lo creamos cuando se carga el mapa
		if (mapRef.current && !placesServiceRef.current) {
			placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current);
		}
	}, [isLoaded]);

	// Buscar sugerencias con debounce
	useEffect(() => {
		if (disabled || !searchInput.trim()) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSuggestions([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			if (!autocompleteServiceRef.current) return;

			setIsSearching(true);
			autocompleteServiceRef.current.getPlacePredictions(
				{
					input: searchInput,
					componentRestrictions: { country: COUNTRIES }
				},
				(predictions, status) => {
					setIsSearching(false);
					if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
						setSuggestions(predictions);
					} else {
						setSuggestions([]);
					}
				}
			);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchInput, disabled]);

	// Seleccionar una sugerencia del autocomplete
	const handleSelectSuggestion = useCallback(
		(prediction: google.maps.places.AutocompletePrediction) => {
			// Crear PlacesService si no existe (puede pasar si el mapa no se ha mostrado)
			if (!placesServiceRef.current) {
				const dummyDiv = document.createElement("div");
				placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv);
			}

			placesServiceRef.current.getDetails(
				{
					placeId: prediction.place_id,
					fields: ["formatted_address", "geometry"]
				},
				(place, status) => {
					if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
						const lat = place.geometry.location.lat();
						const lng = place.geometry.location.lng();
						const address = place.formatted_address || prediction.description;

						onLocationChange({
							direccion: address,
							latitud: lat.toString(),
							longitud: lng.toString()
						});

						setSearchInput("");
						setSuggestions([]);
					}
				}
			);
		},
		[onLocationChange]
	);

	// Click en el mapa para seleccionar ubicación
	const handleMapClick = useCallback(
		(e: google.maps.MapMouseEvent) => {
			if (!e.latLng || !geocoderRef.current) return;

			const lat = e.latLng.lat();
			const lng = e.latLng.lng();

			// Geocodificación inversa para obtener la dirección
			geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
				const address = status === "OK" && results?.[0] ? results[0].formatted_address : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

				onLocationChange({
					direccion: address,
					latitud: lat.toString(),
					longitud: lng.toString()
				});
			});
		},
		[onLocationChange]
	);

	// Manejadores de renderizado
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
			{/* Buscador de ubicaciones */}
			<div className="grid gap-2">
				<Label htmlFor="location-search">
					<Search className="inline h-4 w-4 mr-1" />
					Buscar ubicación
				</Label>
				<div className="relative">
					<Input id="location-search" placeholder="Busca un lugar en España" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={disabled} autoComplete="off" />

					{/* Indicador de búsqueda */}
					{isSearching && (
						<div className="absolute right-2 top-2">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</div>
					)}

					{/* Lista de sugerencias */}
					{suggestions.length > 0 && (
						<ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg max-h-60 overflow-y-auto">
							{suggestions.map((suggestion) => (
								<li key={suggestion.place_id} className="flex gap-2 items-start px-3 py-2 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSelectSuggestion(suggestion)}>
									<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{suggestion.structured_formatting.main_text}</p>
										{suggestion.structured_formatting.secondary_text && <p className="text-xs text-muted-foreground truncate">{suggestion.structured_formatting.secondary_text}</p>}
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Ubicación seleccionada */}
			{direccion && (
				<div className="rounded-md bg-muted p-3">
					<div className="flex items-start gap-2">
						<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium">Ubicación seleccionada:</p>
							<p className="text-sm text-muted-foreground wrap-break-word">{direccion}</p>
							{markerPosition && (
								<p className="text-xs text-muted-foreground mt-1">
									Coordenadas: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Botón para mostrar/ocultar mapa */}
			<Button type="button" variant="outline" onClick={() => setShowMap((prev) => !prev)} disabled={disabled} className="w-full">
				{showMap ? "Ocultar mapa" : "¿No encuentras la ubicación? Usa el mapa interactivo"}
			</Button>

			{/* Mapa interactivo */}
			{showMap && (
				<div className="space-y-2">
					<Label>
						<MapPin className="inline h-4 w-4 mr-1" />
						Haz clic en el mapa para seleccionar una ubicación
					</Label>
					<div className="rounded-md overflow-hidden border">
						<GoogleMap
							mapContainerStyle={mapContainerStyle}
							center={mapCenter}
							zoom={markerPosition ? 15 : 6}
							onClick={handleMapClick}
							onLoad={(map) => {
								mapRef.current = map;
								// Inicializar PlacesService cuando se carga el mapa
								if (!placesServiceRef.current) {
									placesServiceRef.current = new window.google.maps.places.PlacesService(map);
								}
							}}
							options={{
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false,
								zoomControl: true
							}}
						>
							{markerPosition && <Marker position={markerPosition} />}
						</GoogleMap>
					</div>
				</div>
			)}
		</div>
	);
}
