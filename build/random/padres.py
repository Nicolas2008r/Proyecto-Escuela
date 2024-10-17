import json
import os
import random
import unicodedata

# Leer datos de alumnos desde alumnos.json
def leer_datos_alumnos(ruta_archivo):
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            return json.load(archivo)
    except FileNotFoundError:
        print(f"El archivo {ruta_archivo} no se encuentra.")
        return []
    except json.JSONDecodeError:
        print(f"Error al leer el archivo JSON {ruta_archivo}.")
        return []

# Función para eliminar tildes
def eliminar_tildes(texto):
    return ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')

# Generar un correo electrónico basado en nombre y apellido
def generar_email(nombre, apellido):
    dominios = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
    nombre_sin_tildes = eliminar_tildes(nombre.lower())
    apellido_sin_tildes = eliminar_tildes(apellido.lower())
    return f"{nombre_sin_tildes}.{apellido_sin_tildes}@{random.choice(dominios)}"

# Generar un DNI aleatorio menor a 36,000,000
def generar_dni():
    return str(random.randint(20000000, 35999999))

# Generar un número de teléfono con código de área 11
def generar_telefono():
    return f"11{random.randint(10000000, 99999999)}"

# Generar una lista de diccionarios con los datos aleatorios de padres
def generar_datos_padres(cantidad, datos_alumnos):
    datos = []
    apellidos_alumnos = set(alumno['apellido'] for alumno in datos_alumnos)
    
    for _ in range(cantidad):
        nombre = random.choice(nombres)
        apellido = random.choice(list(apellidos_alumnos))
        email = generar_email(nombre, apellido)
        dni = generar_dni()
        telefono = generar_telefono()
        
        # Seleccionar un hijo que tenga el mismo apellido que el padre
        hijos_posibles = [alumno for alumno in datos_alumnos if alumno['apellido'] == apellido]
        if hijos_posibles:
            hijo = random.choice(hijos_posibles)
        else:
            # Si no hay alumnos con el apellido elegido, continuar con el siguiente ciclo
            continue
        
        datos.append({
            "nombre": nombre,
            "apellido": apellido,
            "email": email,
            "dni": dni,
            "telefono": telefono,
            "hijo": {
                "nombre": hijo["nombre"],
                "apellido": hijo["apellido"]
            }
        })
    return datos

# Cargar datos de alumnos desde el archivo alumnos.json
directorio_actual = os.path.dirname(os.path.abspath(__file__))
archivo_alumnos = os.path.join(directorio_actual, 'alumnos.json')
datos_alumnos = leer_datos_alumnos(archivo_alumnos)

# Definir la lista de nombres para los padres
nombres = ["Juan", "María", "José", "Ana", "Carlos", "Laura", "Martín", "Sofía", "Lucas", "Camila", "Rodrigo", "Lionel", "Cristiano", "Tatiana", "Mia"]

# Generar y ordenar los datos
cantidad = 200
datos_aleatorios = generar_datos_padres(cantidad, datos_alumnos)

# Convertir los datos ordenados a JSON
datos_json = json.dumps(datos_aleatorios, indent=4, ensure_ascii=False)

# Crear el archivo padres.json en el directorio actual
archivo_json = os.path.join(directorio_actual, 'padres.json')

# Guardar el JSON en el archivo
try:
    with open(archivo_json, 'w', encoding='utf-8') as f:
        f.write(datos_json)
    print(f"El archivo 'padres.json' ha sido creado en el directorio: {directorio_actual}")
except IOError:
    print(f"Error al escribir el archivo {archivo_json}.")
