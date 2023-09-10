CREATE TABLE Paises (
  --primary key
  id_pais SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  latitud INTEGER NOT NULL,
  longitud INTEGER NOT NULL,
  --Constraints
  CONSTRAINT pk_id_pais PRIMARY KEY (id_pais)
);

CREATE TABLE Estados (
  --primary key
  id_estado SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  latitud INTEGER NOT NULL,
  longitud INTEGER NOT NULL,
  --Foreign keys
  id_pais INTEGER,
  --Constraints
  CONSTRAINT pk_id_estado PRIMARY KEY (id_estado),
  CONSTRAINT fk_id_pais FOREIGN KEY (id_pais) REFERENCES (Paises.id_pais) ON DELETE CASCADE
);

CREATE TABLE Ciudades (
  --primary key
  id_ciudad SERIAL,
  --other attributes
  nombre VARCHAR(50) NOT NULL,
  latitud INTEGER NOT NULL,
  longitud INTEGER NOT NULL,
  --Foreign keys
  id_estado INTEGER,
  --Constraints
  CONSTRAINT pk_id_ciudad PRIMARY KEY (id_ciudad),
  CONSTRAINT fk_id_estado FOREIGN KEY (id_estado) REFERENCES (Estados.id_estado) ON DELETE CASCADE
);

CREATE TABLE Clientes (
  --primary key
  id_cliente SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  paterno VARCHAR(50) NOT NULL,
  materno VARCHAR(50),
  fecha_nac DATE NOT NULL,
  email VARCHAR(50) NOT NULL,
  contrasena VARCHAR(50) NOT NULL,
  telefono INTEGER,
  --Constraints
  CONSTRAINT pk_id_cliente PRIMARY KEY (id_cliente)
);

CREATE TABLE Empresas (
  --primary key
  id_empresa SERIAL,
  --Other attributes
  nombre VARCHAR(50) NOT NULL,
  logo VARCHAR(200),
  --Constraints
  CONSTRAINT pk_id_empresa PRIMARY KEY (id_empresa)
);

CREATE TABLE MediosTransporte (
  --primary key
  id_medio_transporte SERIAL,
  --Other attributes
  nombre VARCHAR(50),
  --Constraints
  CONSTRAINT pk_id_medio_transporte PRIMARY KEY (id_medio_transporte)
);

CREATE TABLE Transportes (
  --primary key
  id_transporte SERIAL,
  --Foreign keys
  id_empresa INTEGER,
  id_medio_transporte INTEGER,
  --Constraints
  CONSTRAINT pk_id_transporte PRIMARY KEY (id_transporte),
  CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES (Empresas.id_empresa) ON DELETE CASCADE,
  CONSTRAINT fk_id_medio_transporte FOREIGN KEY (id_medio_transporte) REFERENCES (MediosTransporte.id_medio_transporte) ON DELETE CASCADE
);

CREATE TABLE Viajes (
  --primary key
  id_viaje SERIAL,
  --Foreign keys
  id_cliente INTEGER,
  --Constraints
  CONSTRAINT pk_id_viaje PRIMARY KEY (id_viaje),
  CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES (Clientes.id_cliente) ON DELETE CASCADE
);

CREATE TABLE Destinos (
  --primary key
  id_destino SERIAL,
  --Other attributes
  fehca_salida DATE,
  fecha_llegada DATE,
  --Foreign keys
  id_origen INTEGER,
  id_destino INTEGER,
  id_transporte INTEGER,
  id_viaje INTEGER,
  --Constraints
  CONSTRAINT pk_id_destino PRIMARY KEY (id_destino),
  CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES (Ciudades.id_ciudad) ON DELETE CASCADE,
  CONSTRAINT fk_id_destino FOREIGN KEY (id_destino) REFERENCES (Ciudades.id_ciudad) ON DELETE CASCADE,
  CONSTRAINT fk_id_transporte FOREIGN KEY (id_transporte) REFERENCES (Transportes.id_transporte) ON DELETE CASCADE
);

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
  CONSTRAINT fk_id_ciudad FOREIGN KEY (id_ciudad) REFERENCES (Ciudades.id_ciudad) ON DELETE CASCADE,
  CONSTRAINT fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES (Empresas.id_empresa) ON DELETE CASCADE
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
  CONSTRAINT fk_id_hotel FOREIGN KEY (id) REFERENCES (Hoteles.id_hotel) ON DELETE CASCADE
);

CREATE TABLE Reservaciones (
  --primary key
  id_reservacion SERIAL,
  --Other attributes
  dias INTEGER,
  fecha_inicio DATE,
  --Foreign keys
  id_cliente INTEGER,
  id_habitacion INTEGER,
  id_destino INTEGER,
  --Constraints
  CONSTRAINT pk_id_reservacion PRIMARY KEY (id_reservacion),
  CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES (Clientes.id_cliente) ON DELETE CASCADE,
  CONSTRAINT fk_id_habitacion FOREIGN KEY (id_habitacion) REFERENCES (Habitaciones.id_habitacion) ON DELETE CASCADE,
  CONSTRAINT fk_id_destino FOREIGN KEY (id_destino) REFERENCES (Destinos.id_destino) ON DELETE CASCADE
);

CREATE TABLE Acompanantes (
  --primary key
  id_acompanante SERIAL,
  --Other attributes
  nombre VARCHAR(50),
  paterno VARCHAR(50),
  materno VARCHAR(50),
  fecha_nac DATE,
  --Foreign keys
  id_viaje INTEGER,
  --Constraints
  CONSTRAINT pk_id_acompanante PRIMARY KEY (id_acompanante),
  CONSTRAINT fk_id_viaje FOREIGN KEY (id_viaje) REFERENCES (Viajes.id_viaje) ON DELETE CASCADE
);
