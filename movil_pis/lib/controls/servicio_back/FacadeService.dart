import 'package:movil_pis/controls/Conexion.dart';
import 'package:movil_pis/controls/servicio_back/RespuestaGenerica.dart';

class FacadeService {
  Conexion c = Conexion();

  Future<RespuestaGenerica> informacionActual() async {
    return await c.solicitudGet('/admin/historiales/obtener_actuales', false);
  }

  Future<RespuestaGenerica> historiales() async {
    return await c.solicitudGet('/admin/historiales', false);
  }
}
