const pool = require('../utils/dbConnection');
const Model = require('../utils/Model');

class ItineraryModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }

  async getItineraries(id) {
    let query = {
      text: `
        SELECT i.id_itinerario, MIN(vi.fecha_salida) as fecha_salida, ori.nombre as origen, de.nombre as destino
        FROM usuarios u
        JOIN itinerarios i ON u.id_usuario = i.id_usuario
        JOIN viajes vi ON vi.id_itinerario = i.id_itinerario
        JOIN ciudades ori ON vi.id_origen = ori.id_ciudad
        JOIN ciudades de ON vi.id_destino = de.id_ciudad
        WHERE u.id_usuario = ${id}
        GROUP BY (vi.id_viaje, i.id_itinerario, ori.nombre, de.nombre);
        
      `
    }
    return await this._execute(query);
  }
}

const hotelModel = new ItineraryModel('itinerarios', 'id_itinerario', pool);
module.exports = hotelModel;
