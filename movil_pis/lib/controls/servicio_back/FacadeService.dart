import 'package:Climatify/controls/Conexion.dart';
import 'package:Climatify/controls/servicio_back/RespuestaGenerica.dart';

class FacadeService {
  Conexion c = Conexion();

  Future<RespuestaGenerica> informacionActual() async {
    return await c.solicitudGet('/historiales/obtener_actuales', false);
  }

  Future<RespuestaGenerica> historiales() async {
    return await c.solicitudGet('/historiales_hoy', false);
  }

  Future<RespuestaGenerica> predicciones() async {
    return await c.solicitudGet('/predicciones', false);
  }
}
