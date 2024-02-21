import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:weather_icons/weather_icons.dart';

class PronosticoPorHorasWidget extends StatelessWidget {
  final Map<String, dynamic>? pronosticoPorHoras;

  PronosticoPorHorasWidget({required this.pronosticoPorHoras});

  @override
  Widget build(BuildContext context) {
    if (pronosticoPorHoras == null || pronosticoPorHoras!.isEmpty) {
      return const CircularProgressIndicator();
    } else {
      List<double> datosTemperatura =
          obtenerDatosTemperatura(pronosticoPorHoras!);
      return Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
          color: Colors.grey[200]?.withOpacity(0.8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
              'Pronósticos',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: pronosticoPorHoras!['temperatura']
                        ?.map<Widget>((pronostico) {
                      return _buildPronosticoHora(pronostico);
                    }).toList() ??
                    [],
              ),
            ),
            const SizedBox(height: 16.0),
            const Text(
              'Gráfica de Temperatura',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8.0),
            Container(
              height: 200.0,
              padding: const EdgeInsets.all(16.0),
              margin: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10.0),
                color: const Color.fromARGB(255, 35, 61, 167),
              ),
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: false),
                  titlesData: const FlTitlesData(show: false),
                  borderData: FlBorderData(
                    show: true,
                    border: Border.all(
                        color: const Color.fromARGB(255, 50, 50, 50)),
                  ),
                  minX: 0,
                  maxX: datosTemperatura.length.toDouble() - 1,
                  minY: datosTemperatura.reduce((a, b) => a < b ? a : b) - 5,
                  maxY: datosTemperatura.reduce((a, b) => a > b ? a : b) + 5,
                  lineBarsData: [
                    LineChartBarData(
                      spots: List.generate(
                        datosTemperatura.length,
                        (index) =>
                            FlSpot(index.toDouble(), datosTemperatura[index]),
                      ),
                      isCurved: true,
                      //color: [Colors.blue],
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(show: false),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }
  }

  List<double> obtenerDatosTemperatura(
      Map<String, dynamic> pronosticoPorHoras) {
    List<double> datosTemperatura = [];
    final List<dynamic>? listaTemperaturas = pronosticoPorHoras['temperatura'];
    if (listaTemperaturas != null) {
      for (var pronostico in listaTemperaturas) {
        // Asume que el dato de temperatura está en la clave 'temperatura'
        double temperatura = pronostico['valor_calculado'].toDouble();
        datosTemperatura.add(temperatura);
      }
    }
    return datosTemperatura;
  }

  Widget _buildPronosticoHora(dynamic pronostico) {
    log(pronostico.toString());
    String clima = '';
    double temperatura = pronostico['valor_calculado'];

    if (temperatura >= 30) {
      clima = 'Caluroso';
    } else if (temperatura >= 24 && temperatura < 30) {
      clima = 'Despejado';
    } else if (temperatura >= 20 && temperatura < 24) {
      clima = 'Templado';
    } else if (temperatura >= 16 && temperatura < 20) {
      clima = 'Nublado';
    } else if (temperatura >= 14 && temperatura < 16) {
      clima = 'Lluvioso';
    } else if (temperatura < 14) {
      clima = 'Frío';
    }
    
    return Container(
      margin: const EdgeInsets.all(8.0),
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10.0),
      ),
      child: Column(
        children: [
          Text(
            pronostico['hora'],
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8.0),
          Icon(
            obtenerIcono(clima),
            color: Colors.blue,
          ),
          const SizedBox(height: 8.0),
          Text(
            clima,
            style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8.0),
          Text(
            '${pronostico['valor_calculado']}°C',
            style: const TextStyle(fontSize: 16.0),
          ),
        ],
      ),
    );
  }

  IconData obtenerIcono(String clima) {
    switch (clima) {
      case 'Caluroso':
        return WeatherIcons.day_sunny;
      case 'Despejado':
        return WeatherIcons.day_light_wind;
      case 'Templado':
        return WeatherIcons.day_haze;
      case 'Nublado':
        return WeatherIcons.cloudy;
      case 'Lluvioso':
        return WeatherIcons.rain;
      case 'Frío':
        return WeatherIcons.strong_wind;
      default:
        return Icons.error;
    }
  }
}
