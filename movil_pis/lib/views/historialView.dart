import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:Climatify/controls/servicio_back/FacadeService.dart';

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
        title: const Text('Historial de Registros'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: PageView(
                controller: _pageController,
                children: [
                  if (dataLoaded)
                    _buildChart(temperatura, 'Temperatura')
                  else
                    _buildLoadingIndicator(),
                  if (dataLoaded)
                    _buildChart(humedad, 'Humedad')
                  else
                    _buildLoadingIndicator(),
                  if (dataLoaded)
                    _buildChart(presion, 'Presión')
                  else
                    _buildLoadingIndicator(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChart(List<dynamic> data, String title) {
    return SingleChildScrollView(
      child: Column(
        children: [
          SfCartesianChart(
            title: ChartTitle(text: title),
            primaryXAxis: const CategoryAxis(
              majorGridLines: MajorGridLines(
                  width: 0),
            ),
            series: _getDefaultData(data),
            zoomPanBehavior: ZoomPanBehavior(
              enablePanning: true,
              enablePinching: true,
            ),
          ),
          const SizedBox(height: 10),
          if (dataLoaded)
        Container(
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.5),
          child: SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: Container(
              padding: const EdgeInsets.all(16.0),
              child: _buildTable(data),
            ),
          ),
        ),
        ],
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _buildTable(List<dynamic> data) {
    List<TableRow> rows = [];

    rows.add(
      TableRow(
        decoration: BoxDecoration(color: Colors.grey[200]),
        children: [
          TableCell(
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Text('Fecha', textAlign: TextAlign.center),
            ),
          ),
          TableCell(
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Text('Hora', textAlign: TextAlign.center),
            ),
          ),
          TableCell(
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Text('Valor Medido', textAlign: TextAlign.center),
            ),
          ),
        ],
      ),
    );

    for (var val in data) {
      String fecha = val['fecha'];
      String hora = val['hora'];
      double value = val['valor_medido'].toDouble();

      rows.add(
        TableRow(
          children: [
            TableCell(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(fecha, textAlign: TextAlign.center),
              ),
            ),
            TableCell(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(hora, textAlign: TextAlign.center),
              ),
            ),
            TableCell(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(value.toString(), textAlign: TextAlign.center),
              ),
            ),
          ],
        ),
      );
    }

    return Table(
      border: TableBorder.all(),
      children: rows,
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
