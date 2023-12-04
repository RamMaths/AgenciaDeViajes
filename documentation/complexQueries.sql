SELECT i.id_itinerario, MIN(vi.fecha_salida) as fecha_salida, ori.nombre as origen, de.nombre as destino
FROM usuarios u
JOIN itinerarios i ON u.id_usuario = i.id_usuario
JOIN viajes vi ON vi.id_itinerario = i.id_itinerario
JOIN ciudades ori ON vi.id_origen = ori.id_ciudad
JOIN ciudades de ON vi.id_destino = de.id_ciudad
WHERE u.id_usuario = 3
GROUP BY (vi.id_viaje, i.id_itinerario, ori.nombre, de.nombre);
