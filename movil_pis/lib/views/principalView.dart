import 'package:flutter/material.dart';
import 'package:movil_pis/controls/servicio_back/FacadeService.dart';
import 'package:movil_pis/views/exception/NoData.dart';
import 'package:movil_pis/views/pronosticoWidget.dart';
import 'package:weather_icons/weather_icons.dart';
import 'package:fl_chart/fl_chart.dart';

class PrincipalView extends StatefulWidget {
  const PrincipalView({Key? key}) : super(key: key);

  @override
  _PrincipalViewState createState() => _PrincipalViewState();
}

class _PrincipalViewState extends State<PrincipalView> {
  List<dynamic> datos = [];
  final tuListaDePronosticoPorHoras = [
    {'hora': '12:00 PM', 'temperatura': 25},
    {'hora': '1:00 PM', 'temperatura': 26},
    {'hora': '2:00 PM', 'temperatura': 27},
    // Agrega más datos según sea necesario
  ];

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
      return NoDatos();
    }

    final temperatura = datos[0];
    final temperatura_valor = temperatura['historial_climatico'][0];

    final humedad = datos[1];
    final presion = datos[2];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Climafy',
              style: TextStyle(color: const Color.fromARGB(255, 90, 90, 90)),
            ),
            GestureDetector(
              onTap: () {
                // Navegar al historial
                Navigator.pushNamed(context, 'historial');
              },
              child: Row(
                children: [
                  Icon(Icons.history, color: Colors.lightBlue[900], size: 24.0),
                  SizedBox(width: 8.0),
                  Text(
                    'Historial',
                    style:
                        TextStyle(color: Colors.lightBlue[900], fontSize: 18.0),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(16.0),
          margin: EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10.0),
            color: Color.fromARGB(255, 35, 61, 167),
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
              SizedBox(height: 16.0),
              PronosticoPorHorasWidget(
                pronosticoPorHoras: tuListaDePronosticoPorHoras,
              ),
            ],
          ),
        ),
      ),
      //...

// En algún lugar de tu código principal:

// ...
    );
  }

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
}
