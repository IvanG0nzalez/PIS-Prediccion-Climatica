import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import sys
from datetime import datetime, timedelta
import json

def ajustar_y_predecir(mediciones, fechas_horas, future_steps):   
    
    date_rng = pd.to_datetime(fechas_horas)
    ts = pd.Series(mediciones, index=date_rng)

    hw_model = ExponentialSmoothing(ts, trend='additive', seasonal='additive', seasonal_periods=4)
    hw_result = hw_model.fit()

    forecast_hw = hw_result.forecast(steps=future_steps)
    
    fechas_dt = [datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S") for fecha in fechas_horas    ]
    fechas_ultimo = fechas_dt[-1]
    fechas_forecast = [fechas_ultimo + timedelta(minutes=2*i) for i in range(1, future_steps+1)]

    fecha_pronostico = list(zip(fechas_forecast, forecast_hw))

    return fecha_pronostico

#lee los valores enviados desde node
mediciones = sys.argv[1].split(",")
mediciones_float = [float(valor) for valor in mediciones]
fechas_horas = sys.argv[2].split(",")
future_steps = int(sys.argv[3])

#llamada al método
fecha_pronostico = ajustar_y_predecir(mediciones_float, fechas_horas, future_steps)
fecha_pronostico_horas = [registro for i, registro in enumerate(fecha_pronostico) if (i + 1) % 30 == 0]

print(json.dumps(fecha_pronostico_horas, default=str))
