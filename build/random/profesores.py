import json
import os
import random

# Listas de nombres y apellidos europeos pero hispanos
nombres = [
    "Antonio", "Isabel", "Francisco", "Carmen", "Javier", "Dolores", "Miguel", "María", 
    "José", "Ana", "Luis", "Laura", "Manuel", "Paola", "Alberto", "Rosa", "Héctor", "Lucía",
    "Ricardo", "Elena", "Carlos", "Adriana", "Juan", "María José", "Pedro", "Susana"
]
apellidos = [
    "Gómez", "Morales", "Sánchez", "Romero", "Herrera", "Vargas", "Castro", "Cruz", 
    "Moreno", "Navarro", "Paredes", "Ríos", "Mendoza", "Pérez", "González", "Bravo", 
    "López", "Torres", "Silva", "Alonso", "Cano", "Ramos", "Zapata", "Velázquez"
]

# Materias básicas
materias = ["Matemáticas", "Lengua", "Ciencias", "Historia", "Geografía", "Educación Física"]

# Años y divisiones
años = ["1ro", "2do", "3ro", "4to", "5to", "6to"]
divisiones = ["1ra", "2da", "3ra"]

# Función para generar un DNI aleatorio menor a 36,000,000
def generar_dni():
    return str(random.randint(20000000, 35999999))

# Generar un número de teléfono con código de área 11
def generar_telefono():
    return f"11{random.randint(10000000, 99999999)}"

# Generar una lista de diccionarios con los datos aleatorios de profesores
def generar_datos_profesores(cantidad):
    datos = []
    
    for _ in range(cantidad):
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        email = f"{nombre.lower()}.{apellido.lower()}@{random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'])}"
        dni = generar_dni()
        telefono = generar_telefono()
        materia = random.choice(materias)
        año = random.choice(años)
        division = random.choice(divisiones)
        
        datos.append({
            "nombre": nombre,
            "apellido": apellido,
            "dni": dni,
            "email": email,
            "telefono": telefono,
            "materia": materia,
            "anio": año,
            "division": division
        })
    
    return datos

# Obtener el directorio actual y crear el archivo profesores.json en ese directorio
directorio_actual = os.path.dirname(os.path.abspath(__file__))
archivo_json = os.path.join(directorio_actual, 'profesores.json')

# Generar los datos y convertirlos a JSON
cantidad = 50
datos_profesores = generar_datos_profesores(cantidad)
datos_json = json.dumps(datos_profesores, indent=4, ensure_ascii=False)

# Guardar el JSON en el archivo
with open(archivo_json, 'w', encoding='utf-8') as f:
    f.write(datos_json)

print(f"El archivo 'profesores.json' ha sido creado en el directorio: {directorio_actual}")
