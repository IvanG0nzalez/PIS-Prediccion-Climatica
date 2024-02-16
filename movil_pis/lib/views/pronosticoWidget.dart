import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class PronosticoPorHorasWidget extends StatelessWidget {
  final List<Map<String, dynamic>> pronosticoPorHoras;

  PronosticoPorHorasWidget({required this.pronosticoPorHoras});

  List<double> obtenerDatosTemperatura(List<dynamic> pronosticoPorHoras) {
    List<double> datosTemperatura = [];

    for (var pronostico in pronosticoPorHoras) {
      // Asume que el dato de temperatura está en la clave 'temperatura'
      double temperatura = pronostico['temperatura'].toDouble();
      datosTemperatura.add(temperatura);
    }

    return datosTemperatura;
  }

  @override
  Widget build(BuildContext context) {
    List<double> datosTemperatura = obtenerDatosTemperatura(pronosticoPorHoras);

    return Container(
      padding: EdgeInsets.all(16.0),
      color: Colors.grey[200],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Pronóstico por Horas',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: pronosticoPorHoras.map((pronostico) {
                return _buildPronosticoHora(pronostico);
              }).toList(),
            ),
          ),
          SizedBox(height: 16.0),
          Text(
            'Gráfica de Temperatura',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.0),
          Container(
            height: 200.0,
            padding: EdgeInsets.all(16.0),
            margin: EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10.0),
              color: Color.fromARGB(255, 35, 61, 167),
            ),
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: false),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(
                  show: true,
                  border:
                      Border.all(color: const Color.fromARGB(255, 50, 50, 50)),
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
                    dotData: FlDotData(show: false),
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

  Widget _buildPronosticoHora(Map<String, dynamic> pronostico) {
    return Container(
      margin: EdgeInsets.all(8.0),
      padding: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10.0),
      ),
      child: Column(
        children: [
          Text(
            pronostico['hora'],
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.0),
          Icon(
            Icons.cloud,
            color: Colors.blue,
          ), // Cambia el icono según tu lógica
          SizedBox(height: 8.0),
          Text(
            '${pronostico['temperatura']}°C',
            style: TextStyle(fontSize: 16.0),
          ),
        ],
      ),
    );
  }
}
