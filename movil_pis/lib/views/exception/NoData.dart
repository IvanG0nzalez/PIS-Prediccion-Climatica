import 'package:flutter/material.dart';

class NoDatos extends StatelessWidget {
  const NoDatos({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Climatify'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.warning,
              size: 50.0,
              color: Colors.red,
            ),
            SizedBox(height: 16.0),
            Text(
              'No hay datos disponibles',
              style: TextStyle(fontSize: 18.0),
            ),
          ],
        ),
      ),
    );
  }
}
