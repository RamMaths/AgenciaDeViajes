SELECT id_viaje, id_destino, fecha_salida, CO.nombre, CDF.nombre
FROM Usuarios u
WHERE u.id_usuario=?
JOIN Viajes v ON v.id_usuario=u.id_usuario
JOIN Destinos d ON v.id_viaje=d.id_viaje
JOIN Ciudades CO ON d.id_origen=CO.id_ciudad
JOIN Ciudades CDF ON d.id_origen=CDF.id_ciudad
GROUP BY id_viaje
HAVING MAX(fecha_llegada) OR MIN(fehca_salida)
ORDER BY fecha_salida;
