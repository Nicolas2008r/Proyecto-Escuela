import json
import os
import random

# Listas de nombres y apellidos italianos
nombres = [
    "Adolf", "Katrina"
]
apellidos = [
    "Müller", "Schneider"
]

# Áreas posibles
areas = ["informática", "construcciones"]

# Generar un DNI aleatorio menor a 36,000,000
def generar_dni():
    return str(random.randint(20000000, 35999999))

# Generar una lista de diccionarios con los datos aleatorios de coordinadores
def generar_datos_coordinadores(cantidad):
    datos = []
    
    for _ in range(cantidad):
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        email = f"{nombre.lower()}.{apellido.lower()}@{random.choice(['gmail.com'])}"
        dni = generar_dni()
        area = random.choice(areas)
        
        datos.append({
            "nombre": nombre,
            "apellido": apellido,
            "dni": dni,
            "email": email,
            "area": area
        })
    
    return datos

# Obtener el directorio actual y crear el archivo coordinadores.json en ese directorio
directorio_actual = os.path.dirname(os.path.abspath(__file__))
archivo_json = os.path.join(directorio_actual, 'coordinadores.json')

# Generar los datos y convertirlos a JSON
cantidad = 2
datos_coordinadores = generar_datos_coordinadores(cantidad)
datos_json = json.dumps(datos_coordinadores, indent=4, ensure_ascii=False)

# Guardar el JSON en el archivo
with open(archivo_json, 'w', encoding='utf-8') as f:
    f.write(datos_json)

print(f"El archivo 'coordinadores.json' ha sido creado en el directorio: {directorio_actual}")
