import random
import json
import os

# Listas de nombres y apellidos comunes en Argentina (sin tildes)
nombres = ["Juan", "Maria", "Jose", "Ana", "Carlos", "Laura", "Martin", "Sofia", "Lucas", "Camila", "Rodrigo", "Lionel", "Cristiano", "Tatiana", "Mia", "Antonio", "Gabriela", "Alejandro", "Natalia", "Ricardo", "Isabella", "Hernan", "Veronica"]
apellidos = ["Gonzalez", "Rodriguez", "Perez", "Lopez", "Martinez", "Gomez", "Fernandez", "Ruiz", "Diaz", "Torres", "Soto", "Pettinato", "Gonzales", "Schuff", "Goulan", "Cabana", "Davo", "Castro", "Martin", "Silva", "Vargas", "Romero"]

años = ["1ro", "2do", "3ro", "4to", "5to", "6to"]
divisiones = ["1ra", "2da", "3ra"]

# Generar un correo electrónico basado en nombre y apellido
def generar_email(nombre, apellido):
    dominios = ["gmail.com"]
    return f"{nombre.lower()}.{apellido.lower()}@{random.choice(dominios)}"

# Generar un DNI aleatorio basado en el año del alumno
def generar_dni(año):
    base_dni = {
        "6to": (46000000, 46999999),
        "5to": (47000000, 47999999),
        "4to": (48000000, 48999999),
        "3ro": (49000000, 49999999),
        "2do": (50000000, 50999999),
        "1ro": (51000000, 51999999)
    }
    rango = base_dni[año]
    return str(random.randint(rango[0], rango[1]))

# Generar una lista de diccionarios con los datos aleatorios sin repetir nombres y apellidos
def generar_datos(cantidad):
    datos = []
    combinaciones_usadas = set()
    
    while len(datos) < cantidad:
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        if (nombre, apellido) not in combinaciones_usadas:
            email = generar_email(nombre, apellido)
            año = random.choice(años)
            dni = generar_dni(año)
            division = random.choice(divisiones)
            datos.append({
                "nombre": nombre,
                "apellido": apellido,
                "email": email,
                "dni": dni,
                "anio": año,
                "division": division
            })
            combinaciones_usadas.add((nombre, apellido))
    
    return datos

# Ordenar los datos por nombre y luego por apellido
def ordenar_datos(datos):
    return sorted(datos, key=lambda x: (x["nombre"], x["apellido"]))

# Generar y ordenar los datos
cantidad = 200
datos_aleatorios = generar_datos(cantidad)
datos_ordenados = ordenar_datos(datos_aleatorios)

# Convertir los datos ordenados a JSON
datos_json = json.dumps(datos_ordenados, indent=4, ensure_ascii=False)

# Obtener el directorio actual y crear el archivo alumnos.json en ese directorio
directorio_actual = os.path.dirname(os.path.abspath(__file__))
archivo_json = os.path.join(directorio_actual, 'alumnos.json')

# Guardar el JSON en el archivo
with open(archivo_json, 'w', encoding='utf-8') as f:
    f.write(datos_json)

print(f"El archivo 'alumnos.json' ha sido creado en el directorio: {directorio_actual}")
