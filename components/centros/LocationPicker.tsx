"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
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
	/**
	 * Lista de países permitidos para el autocomplete.
	 * Código ISO 3166-1 Alpha-2 (es, pt, fr, etc.)
	 */
	countries?: string[];
};

export function LocationPicker({
	direccion,
	latitud,
	longitud,
	onLocationChange,
	disabled,
	countries = ["es"] // por defecto España
}: LocationPickerProps) {
	const [showMap, setShowMap] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
	const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const dummyDivRef = useRef<HTMLDivElement | null>(null); // por si no hay mapa

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries
	});

	// posición inicial
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

	// cuando se carga Google, creamos los servicios
	useEffect(() => {
		if (!isLoaded || typeof window === "undefined" || !window.google) return;

		if (!autocompleteServiceRef.current) {
			autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
		}

		// PlacesService necesita un elemento DOM o un mapa
		if (!placesServiceRef.current) {
			if (mapRef.current) {
				placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current);
			} else if (dummyDivRef.current) {
				placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
			}
		}
	}, [isLoaded]);

	// buscar sugerencias cuando el usuario escribe
	const fetchSuggestions = useCallback(
		(input: string) => {
			if (!autocompleteServiceRef.current || !input.trim()) {
				setSuggestions([]);
				return;
			}

			setIsSearching(true);

			autocompleteServiceRef.current.getPlacePredictions(
				{
					input,
					// aquí filtramos por país
					componentRestrictions: countries.length ? { country: countries } : undefined
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
		},
		[countries]
	);

	// debounce sencillo
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchInput && !disabled) {
				fetchSuggestions(searchInput);
			} else {
				setSuggestions([]);
			}
		}, 300);

		return () => clearTimeout(id);
	}, [searchInput, fetchSuggestions, disabled]);

	// cuando el usuario elige una sugerencia
	const handleSelectSuggestion = (prediction: google.maps.places.AutocompletePrediction) => {
		if (!placesServiceRef.current) return;

		// pedimos los detalles reales del sitio
		placesServiceRef.current.getDetails(
			{
				placeId: prediction.place_id,
				fields: ["formatted_address", "geometry"]
			},
			(place, status) => {
				if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
					const lat = place.geometry.location.lat();
					const lng = place.geometry.location.lng();
					const address = place.formatted_address || prediction.description;

					onLocationChange({
						direccion: address,
						latitud: lat.toString(),
						longitud: lng.toString()
					});

					// limpiamos
					setSearchInput("");
					setSuggestions([]);
				}
			}
		);
	};

	// click en el mapa
	const onMapClick = useCallback(
		(e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				const lat = e.latLng.lat();
				const lng = e.latLng.lng();

				const geocoder = new window.google.maps.Geocoder();
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
		<div className="space-y-4 relative">
			{/* buscador */}
			<div className="grid gap-2">
				<Label htmlFor="location-search">
					<Search className="inline h-4 w-4 mr-1" />
					Buscar ubicación
				</Label>
				<div className="relative">
					<Input id="location-search" placeholder="Busca un lugar (se filtra por país)" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={disabled} autoComplete="off" />

					{/* lista de sugerencias dentro del dialog */}
					{searchInput.length > 0 && suggestions.length > 0 && (
						<ul className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-sm max-h-56 overflow-y-auto">
							{suggestions.map((sug) => (
								<li key={sug.place_id} className="flex gap-2 items-start px-3 py-2 cursor-pointer hover:bg-muted" onClick={() => handleSelectSuggestion(sug)}>
									<MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
									<div className="flex-1">
										<p className="text-sm">{sug.structured_formatting.main_text}</p>
										{sug.structured_formatting.secondary_text && <p className="text-xs text-muted-foreground">{sug.structured_formatting.secondary_text}</p>}
									</div>
								</li>
							))}
						</ul>
					)}

					{/* estado de búsqueda */}
					{isSearching && (
						<div className="absolute right-2 top-2">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</div>
					)}
				</div>
				<p className="text-xs text-muted-foreground">Se está limitando la búsqueda a: {countries.join(", ").toUpperCase()}</p>
			</div>

			{/* dirección actual */}
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

			{/* botón mapa */}
			<Button type="button" variant="outline" onClick={() => setShowMap((prev) => !prev)} disabled={disabled} className="w-full">
				{showMap ? "Ocultar mapa" : "¿No encuentras la ubicación? Usa el mapa interactivo"}
			</Button>

			{/* mapa */}
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
							onLoad={(map) => {
								mapRef.current = map;
								// si aún no habíamos creado el places service, lo creamos aquí
								if (!placesServiceRef.current) {
									placesServiceRef.current = new window.google.maps.places.PlacesService(map);
								}
							}}
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

			{/* dummy div para PlacesService si no hay mapa */}
			{!showMap && <div ref={dummyDivRef} className="hidden" />}
		</div>
	);
}
