import 'package:movil_pis/controls/servicio_back/RespuestaGenerica.dart';
import 'package:movil_pis/controls/utiles/utiles.dart';
import 'dart:developer';
import 'dart:convert';
import 'package:http/http.dart' as http;

class Conexion {
  //final String URL = "http://192.168.1.4:3000/use/";
  //final String URL_MEDIA = "http://192.168.1.4:3000/multimedia/";
  final String URL = "http://localhost:3000/api";
  //final String URL_MEDIA = "http://localhost:3000/multimedia/";

  static bool NO_TOKEN = false;

  Future<RespuestaGenerica> solicitudGet(String recurso, bool token) async {
    Map<String, String> _header = {'Content-Type': 'application/json'};
    if (token) {
      _header = {'Content-Type': 'application/json', 'news-token': 'bhgff'};
    }
    final String _url = URL + recurso;
    final uri = Uri.parse(_url);
    try {
      final response = await http.get(uri, headers: _header);
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          return _response(404, "datos no ecnontrada", []);
        }

        log("no hay page");
        return _response(404, "datos no ecnontrada", []);
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        //log(response.body);
        return _response(mapa['code'], mapa['msg'], mapa['datos']);
      }
    } catch (e) {
      return _response(500, "error inesperad", []);
    }
  }

  Future<RespuestaGenerica> solicitudPost(
      String recurso, bool token, Map<dynamic, dynamic> mapa) async {
    Map<String, String> _header = {'Content-Type': 'application/json'};
    if (token) {
      Utiles util = Utiles();
      String? tokenA = await util.getValue('token');
      _header = {
        'Content-Type': 'application/json',
        'news-token': tokenA.toString()
      };
    }
    final String _url = URL + recurso;
    final uri = Uri.parse(_url);
    try {
      final response =
          await http.post(uri, headers: _header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          return _response(404, "datos no ecnontrada", []);
        }

        log("no hay page");
        return _response(404, "datos no ecnontrada", []);
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        //log(response.body);
        return _response(mapa['code'], mapa['msg'], mapa['datos']);
      }
    } catch (e) {
      return _response(500, "error inesperad", []);
    }
  }

  RespuestaGenerica _response(int code, String msg, dynamic datos) {
    var respuesta = RespuestaGenerica();
    respuesta.code = code;
    respuesta.datos = datos;
    respuesta.msg = msg;
    return respuesta;
  }
}
