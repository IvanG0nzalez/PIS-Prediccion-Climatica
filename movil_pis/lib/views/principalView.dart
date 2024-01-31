import 'dart:math';

import 'package:flutter/material.dart';
import 'package:movil_pis/controls/servicio_back/FacadeService.dart';
import 'package:weather_icons/weather_icons.dart';

class PrincipalView extends StatefulWidget {
  const PrincipalView({Key? key}) : super(key: key);

  @override
  _PrincipalViewState createState() => _PrincipalViewState();
}

class _PrincipalViewState extends State<PrincipalView> {
  List<dynamic> datos = [];

  @override
  void initState() {
    super.initState();
    ObtenerDatos();
  }

  void ObtenerDatos() {
    FacadeService facadeService = FacadeService();
    facadeService.informacionActual().then((value) {
      setState(() {
        datos = value.datos;
      });
      print(value.datos);
    });
  }

  IconData obtenerIcono(String tipoMedicion) {
    switch (tipoMedicion) {
      case 'Temperatura':
        return WeatherIcons.thermometer;
      case 'Humedad':
        return WeatherIcons.humidity;
      case 'Atmosferica':
        return WeatherIcons.barometer;
      default:
        return WeatherIcons.refresh;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (datos.isEmpty) {
      // Puedes manejar el caso en que no haya datos
      return Center(
        child: Text('No hay datos disponibles'),
      );
    }

    final temperatura = datos[0];
    final temperatura_valor = temperatura['historial_climatico'][0];

    final humedad = datos[1];
    final humedad_valor = humedad['historial_climatico'][0];

    final presion = datos[2];
    final presion_valor = presion['historial_climatico'][0];

    return Scaffold(
      appBar: AppBar(
        title: Text('Noticias'),
      ),
      body: Container(
        padding: EdgeInsets.all(16.0),
        margin: EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
          color: Colors.blueAccent,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Elemento central (Temperatura)
            Container(
              alignment: Alignment.center,
              child: Column(
                children: [
                  Icon(obtenerIcono(temperatura['tipo_medicion']),
                      color: Colors.white, size: 40.0),
                  SizedBox(height: 8.0),
                  Text(
                    temperatura['tipo_medicion'],
                    style: TextStyle(color: Colors.white, fontSize: 24.0),
                  ),
                  SizedBox(height: 8.0),
                  Text(
                    '${temperatura_valor['valor_medido']} ${obtenerUnidadMedicion(temperatura['tipo_medicion'])}',
                    style: TextStyle(color: Colors.white, fontSize: 36.0),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16.0),
            // Elementos adicionales (Humedad y Presión Atmosférica)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildAdditionalInfoCard(
                  dato: humedad,
                  iconSize: 24.0,
                  fontSize: 16.0,
                ),
                _buildAdditionalInfoCard(
                  dato: presion,
                  iconSize: 24.0,
                  fontSize: 16.0,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Construir un card para la información adicional (Humedad o Presión Atmosférica)
  Widget _buildAdditionalInfoCard(
      {required dynamic dato,
      required double iconSize,
      required double fontSize}) {
    final historialClimatico = dato['historial_climatico'][0];

    return Card(
      color: Colors.white,
      elevation: 4.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      child: Container(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(obtenerIcono(dato['tipo_medicion']),
                color: Colors.blueAccent, size: iconSize),
            SizedBox(height: 8.0),
            Text(
              dato['tipo_medicion'],
              style: TextStyle(color: Colors.blueAccent, fontSize: fontSize),
            ),
            SizedBox(height: 8.0),
            Text(
              '${historialClimatico['valor_medido']} ${obtenerUnidadMedicion(dato['tipo_medicion'])}',
              style: TextStyle(color: Colors.blueAccent, fontSize: fontSize),
            ),
          ],
        ),
      ),
    );
  }

  String obtenerUnidadMedicion(String tipoMedicion) {
    switch (tipoMedicion) {
      case 'Temperatura':
        return '°C';
      case 'Humedad':
        return '%';
      case 'Atmosferica':
        return 'hPa';
      default:
        return '';
    }
  }
}
