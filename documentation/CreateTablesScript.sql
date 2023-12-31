CREATE TABLE Paises (
  --primary key
  id_pais SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL UNIQUE,
  latitud NUMERIC NOT NULL,
  longitud NUMERIC NOT NULL,
  zoom INTEGER,
  --Constraints
  CONSTRAINT pk_id_pais PRIMARY KEY (id_pais)
);

CREATE TABLE Estados (
  --primary key
  id_estado SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL UNIQUE,
  --Foreign keys
  id_pais INTEGER,
  --Constraints
  CONSTRAINT pk_id_estado PRIMARY KEY (id_estado),
  CONSTRAINT fk_id_pais FOREIGN KEY (id_pais) REFERENCES Paises(id_pais) ON DELETE RESTRICT
);

CREATE TABLE Ciudades (
  --primary key
  id_ciudad SERIAL,
  --other attributes
  nombre VARCHAR(50) NOT NULL UNIQUE,
  latitud NUMERIC NOT NULL,
  longitud NUMERIC NOT NULL,
  --Foreign keys
  id_estado INTEGER,
  --Constraints
  CONSTRAINT pk_id_ciudad PRIMARY KEY (id_ciudad),
  CONSTRAINT fk_id_estado FOREIGN KEY (id_estado) REFERENCES Estados(id_estado) ON DELETE RESTRICT
);

CREATE TABLE Roles (
  --primary key
  id_rol SERIAL,
  --Other attributes
  nombre VARCHAR(50),
  --Constraints
  CONSTRAINT pk_id_rol PRIMARY KEY (id_rol)
);

CREATE TABLE Sexos (
  id_sexo SERIAL,
  nombre VARCHAR(50),
  CONSTRAINT pk_id_sexo PRIMARY KEY(id_sexo)
);

CREATE TABLE Usuarios (
  --primary key
  id_usuario SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  paterno VARCHAR(50) NOT NULL,
  materno VARCHAR(50),
  fecha_nac DATE NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  fecha_cambio_contra DATE,
  telefono VARCHAR(10),
  --foreign keys
  id_rol INTEGER DEFAULT 1,
  id_sexo INTEGER,
  --Constraints
  CONSTRAINT pk_id_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT fk_id_rol FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
  CONSTRAINT fk_id_sexo FOREIGN KEY (id_sexo) REFERENCES Sexos(id_sexo)
);

CREATE TABLE Empresas (
  --primary key
  id_empresa SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  rfc VARCHAR(13),
  --Constraints
  CONSTRAINT pk_id_empresa PRIMARY KEY (id_empresa)
);

CREATE TABLE MediosTransporte (
  --primary key
  id_medio_transporte SERIAL,
  --Other attributes
  nombre VARCHAR(50),
  asientos INTEGER,
  --Constraints
  CONSTRAINT pk_id_medio_transporte PRIMARY KEY (id_medio_transporte)
);

--CREATE TABLE Transportes (
--  --primary key
--  id_transporte SERIAL,
--  --Foreign keys
--  id_empresa INTEGER,
--  id_medio_transporte INTEGER,
--  --Constraints
--  CONSTRAINT pk_id_transporte PRIMARY KEY (id_transporte),
--  CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE RESTRICT,
--  CONSTRAINT fk_id_medio_transporte FOREIGN KEY (id_medio_transporte) REFERENCES MediosTransporte(id_medio_transporte) ON DELETE RESTRICT
--);

CREATE TABLE Hoteles (
  --primary key
  id_hotel SERIAL,
  --Other attributes
  direccion VARCHAR(50),
  --Foreign keys
  id_ciudad INTEGER,
  id_empresa INTEGER,
  --Constraints
  CONSTRAINT pk_id_hotel PRIMARY KEY (id_hotel),
  CONSTRAINT fk_id_ciudad FOREIGN KEY (id_ciudad) REFERENCES Ciudades(id_ciudad) ON DELETE RESTRICT,
  CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE RESTRICT
);

CREATE TABLE Habitaciones (
  --primary key
  id_habitacion SERIAL,
  --Other attributes
  capacidad INTEGER,
  --Foreign keys
  id_hotel INTEGER,
  --Constraints
  CONSTRAINT pk_id_habitacion PRIMARY KEY (id_habitacion),
  CONSTRAINT fk_id_hotel FOREIGN KEY (id_hotel) REFERENCES Hoteles(id_hotel) ON DELETE RESTRICT
);

CREATE TABLE Itinerarios (
  id_itinerario SERIAL,
  id_usuario INTEGER,
  CONSTRAINT pk_id_itinerario PRIMARY KEY (id_itinerario),
  CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE RESTRICT
);

CREATE TABLE Viajes (
  --primary key
  id_viaje SERIAL,
  --Other attributes
  fehca_salida DATE,
  --Foreign keys
  id_origen INTEGER,
  id_destino INTEGER,
  id_medio_transporte INTEGER,
  id_itinerario INTEGER,
  --Constraints
  CONSTRAINT pk_id_viaje PRIMARY KEY (id_viaje),
  CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES Ciudades(id_ciudad) ON DELETE RESTRICT,
  CONSTRAINT fk_id_destino FOREIGN KEY (id_destino) REFERENCES Ciudades(id_ciudad) ON DELETE RESTRICT,
  CONSTRAINT fk_id_medio_transporte FOREIGN KEY (id_medio_transporte) REFERENCES MediosTransporte(id_medio_transporte) ON DELETE RESTRICT,
  CONSTRAINT fk_id_itinerario FOREIGN KEY (id_itinerario) REFERENCES Itinerarios(id_itinerario) ON DELETE RESTRICT
);

CREATE TABLE Reservaciones (
  --primary key
  id_reservacion SERIAL,
  --Other attributes
  dias INTEGER,
  fecha_inicio DATE,
  fecha_fin DATE,
  --Foreign keys
  id_usuario INTEGER,
  id_habitacion INTEGER,
  id_itinerario INTEGER,
  --Constraints
  CONSTRAINT pk_id_reservacion PRIMARY KEY (id_reservacion),
  CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE RESTRICT,
  CONSTRAINT fk_id_habitacion FOREIGN KEY (id_habitacion) REFERENCES Habitaciones(id_habitacion) ON DELETE RESTRICT,
  CONSTRAINT fk_id_itinerario FOREIGN KEY (id_itinerario) REFERENCES Itinerarios(id_itinerario) ON DELETE RESTRICT
);

CREATE TABLE Personas (
  --primary key
  id_persona SERIAL,
  --Other attributes
  nombre VARCHAR(50),
  paterno VARCHAR(50),
  materno VARCHAR(50),
  fecha_nac DATE,
  --Foreign keys
  id_sexo INTEGER,
  id_itinerario INTEGER,
  --Constraints
  CONSTRAINT pk_id_persona PRIMARY KEY (id_persona),
  CONSTRAINT fk_id_sexo FOREIGN KEY (id_sexo) REFERENCES Sexos(id_sexo) ON DELETE RESTRICT,
  CONSTRAINT fk_id_itinerario FOREIGN KEY (id_itinerario) REFERENCES Itinerarios(id_itinerario) ON DELETE RESTRICT
);
