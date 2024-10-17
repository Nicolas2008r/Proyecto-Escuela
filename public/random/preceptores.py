import json
import os
import random

# Listas de nombres y apellidos italianos
nombres = [
    "Alessandro", "Bianca", "Carlo", "Daniela", "Enzo", "Federica", "Giacomo", 
    "Isabella", "Leonardo", "Martina"
]
apellidos = [
    "Bianchi", "Colombo", "Ferrari", "Galli", "Greco", "Lombardi", "Moretti", 
    "Ricci", "Rossi", "Russo"
]

# Años y divisiones
años = ["1ro", "2do", "3ro", "4to", "5to", "6to"]
divisiones = ["1ra", "2da", "3ra"]

# Función para generar un DNI aleatorio menor a 36,000,000
def generar_dni():
    return str(random.randint(20000000, 35999999))

# Generar un número de teléfono con código de área 11
def generar_telefono():
    return f"11{random.randint(10000000, 99999999)}"

# Generar una lista de diccionarios con los datos aleatorios de preceptores
def generar_datos_preceptores(cantidad):
    datos = []
    
    for _ in range(cantidad):
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        email = f"{nombre.lower()}.{apellido.lower()}@{random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'])}"
        dni = generar_dni()
        año = random.choice(años)
        # Seleccionar hasta 3 divisiones, sin repetir
        divisiones_seleccionadas = random.sample(divisiones, k=min(3, len(divisiones)))
        
        datos.append({
            "nombre": nombre,
            "apellido": apellido,
            "dni": dni,
            "email": email,
            "anio": año,
            "divisiones": divisiones_seleccionadas
        })
    
    return datos

# Obtener el directorio actual y crear el archivo preceptores.json en ese directorio
directorio_actual = os.path.dirname(os.path.abspath(__file__))
archivo_json = os.path.join(directorio_actual, 'preceptores.json')

# Generar los datos y convertirlos a JSON
cantidad = 10
datos_preceptores = generar_datos_preceptores(cantidad)
datos_json = json.dumps(datos_preceptores, indent=4, ensure_ascii=False)

# Guardar el JSON en el archivo
with open(archivo_json, 'w', encoding='utf-8') as f:
    f.write(datos_json)

print(f"El archivo 'preceptores.json' ha sido creado en el directorio: {directorio_actual}")
