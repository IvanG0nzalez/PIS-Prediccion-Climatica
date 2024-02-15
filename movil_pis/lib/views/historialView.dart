import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:movil_pis/controls/servicio_back/FacadeService.dart';

class HistorialView extends StatefulWidget {
  const HistorialView({Key? key}) : super(key: key);

  @override
  State<HistorialView> createState() => _HistorialViewState();
}

class _HistorialViewState extends State<HistorialView> {
  late PageController _pageController;
  List<dynamic> temperatura = [];
  List<dynamic> presion = [];
  List<dynamic> humedad = [];
  bool dataLoaded = false;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    ObtenerDatos();
  }

  void ObtenerDatos() {
    FacadeService facadeService = FacadeService();
    facadeService.historiales().then((value) {
      setState(() {
        for (var valores in value.datos) {
          if (valores['sensor']['tipo_medicion'] == "Humedad") {
            humedad.add(valores);
          } else if (valores['sensor']['tipo_medicion'] == "Temperatura") {
            temperatura.add(valores);
          } else {
            presion.add(valores);
          }
        }
        dataLoaded = true;
        print(temperatura);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Historial'),
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView(
              controller: _pageController,
              children: [
                _buildChart(temperatura, 'Temperatura'),
                _buildChart(humedad, 'Humedad'),
                _buildChart(presion, 'Presión'),
              ],
            ),
          ),
          if (dataLoaded)
            Container(
              constraints: BoxConstraints(
                  maxHeight: 200), // Ajusta el valor según sea necesario
              child: SingleChildScrollView(
                child: Container(
                  padding: EdgeInsets.all(16.0),
                  child: _buildTable(temperatura),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildChart(List<dynamic> data, String title) {
    return SingleChildScrollView(
      child: Column(
        children: [
          SfCartesianChart(
            title: ChartTitle(text: title),
            legend: Legend(isVisible: true),
            primaryXAxis: const CategoryAxis(
              majorGridLines: MajorGridLines(
                  width: 0), // Oculta las líneas de la cuadrícula principal
            ),
            series: _getDefaultData(data),
            zoomPanBehavior: ZoomPanBehavior(
              enablePanning: true,
              enablePinching: true,
            ),
          ),
          SizedBox(height: 10),
        ],
      ),
    );
  }

  Widget _buildTable(List<dynamic> data) {
    List<TableRow> rows = [];

    for (var val in data) {
      String dateString = val['fecha'] + ' ' + val['hora'];
      DateTime dateTime = DateTime.parse(dateString).toLocal();
      double value = val['valor_medido'].toDouble();

      rows.add(TableRow(
        children: [
          TableCell(
              child: Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text(dateTime.toString()))),
          TableCell(
              child: Padding(
                  padding: EdgeInsets.all(8.0), child: Text(value.toString()))),
        ],
      ));
    }

    return Table(
      border: TableBorder.all(),
      children: [
        TableRow(
          decoration: BoxDecoration(color: Colors.grey[200]),
          children: [
            Padding(padding: EdgeInsets.all(8.0), child: Text('Fecha y Hora')),
            Padding(padding: EdgeInsets.all(8.0), child: Text('Valor Medido')),
          ],
        ),
        ...rows,
      ],
    );
  }

  List<LineSeries<SalesData, DateTime>> _getDefaultData(
    List<dynamic> chartData,
  ) {
    Map<DateTime, List<SalesData>> groupedData = {};

    for (var val in chartData) {
      String dateString = val['fecha'] + ' ' + val['hora'];
      DateTime dateTime = DateTime.parse(dateString).toLocal();
      double value = val['valor_medido'].toDouble();
      if (!groupedData.containsKey(dateTime)) {
        groupedData[dateTime] = [];
      }
      groupedData[dateTime]!.add(SalesData(dateTime, value));
    }

    return [
      LineSeries<SalesData, DateTime>(
        dataSource: groupedData.entries.expand((entry) => entry.value).toList(),
        xValueMapper: (SalesData sales, _) => sales.x,
        yValueMapper: (SalesData sales, _) => sales.y,
      ),
    ];
  }
}

class SalesData {
  final DateTime x;
  final double y;

  SalesData(this.x, this.y);
}
