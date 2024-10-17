import json
import os
import random
import string

# Leer datos de un archivo JSON
def leer_datos_archivo(ruta_archivo):
    with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
        return json.load(archivo)

# Generar una contraseña aleatoria de 15 caracteres
def generar_password(longitud=15):
    if longitud != 15:
        raise ValueError("La longitud debe ser exactamente 15 caracteres para cumplir con el formato requerido.")

    # Definir los componentes de la contraseña
    letra_inicial = random.choice(string.ascii_uppercase)  # Letra mayúscula inicial
    letras = ''.join(random.choice(string.ascii_lowercase) for _ in range(longitud - 4 - 1))  # Letras minúsculas
    numeros = ''.join(random.choice(string.digits) for _ in range(4))  # 4 dígitos

    # Construir la contraseña
    password = f"{letra_inicial}{letras}{numeros}"

    if len(password) != longitud:
        raise ValueError("La contraseña generada no tiene la longitud correcta.")

    return password

# Generar una lista de usuarios
def generar_datos_usuarios(directorios):
    datos_usuarios = []
    
    for archivo in directorios:
        datos = leer_datos_archivo(archivo)
        
        for item in datos:
            if 'email' in item:
                if any(role in archivo for role in ['coordinadores', 'preceptores', 'profesores']):
                    # Generar email con formato especial para coordinadores, preceptores y profesores
                    email = f"{item['nombre'].lower()}.{item['apellido'].lower()}.et21@{random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'])}"
                else:
                    email = item['email']
                
                password = generar_password()  # La contraseña ahora tiene un máximo de 15 caracteres
                role = "coordinador" if 'coordinadores' in archivo else (
                    "preceptor" if 'preceptores' in archivo else (
                        "profesor" if 'profesores' in archivo else (
                            "padre" if 'padres' in archivo else "alumno"
                        )
                    )
                )
                
                datos_usuarios.append({
                    "email": email,
                    "password": password,  # Incluir la contraseña sin aplicar hash
                    "role": role
                })
    
    return datos_usuarios

# Definir rutas a los archivos JSON en la carpeta 'json'
directorio_actual = os.path.dirname(os.path.abspath(__file__))
carpeta_json = os.path.join(directorio_actual, 'json')
archivos_json = [
    os.path.join(carpeta_json, 'alumnos.json'),
    os.path.join(carpeta_json, 'padres.json'),
    os.path.join(carpeta_json, 'coordinadores.json'),
    os.path.join(carpeta_json, 'preceptores.json'),
    os.path.join(carpeta_json, 'profesores.json')
]

# Generar datos de usuarios
datos_usuarios = generar_datos_usuarios(archivos_json)

# Convertir los datos a JSON
datos_json = json.dumps(datos_usuarios, indent=4, ensure_ascii=False)

# Crear el archivo usuarios.json en el directorio actual
archivo_json = os.path.join(directorio_actual, 'usuarios.json')

# Guardar el JSON en el archivo
with open(archivo_json, 'w', encoding='utf-8') as f:
    f.write(datos_json)

print(f"El archivo 'usuarios.json' ha sido creado en el directorio: {directorio_actual}")
