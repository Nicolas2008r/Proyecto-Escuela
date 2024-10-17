import sqlite3
import json

# Ruta al archivo JSON y a la base de datos
archivo_json = 'C:\\Users\\nicol\\Desktop\\escuela\\public\\random\\usuarios.json'
base_de_datos = 'C:\\Users\\nicol\\Desktop\\escuela\\public\\random\\base_de_datos.db'

# Leer datos del archivo JSON
with open(archivo_json, 'r', encoding='utf-8') as f:
    datos_usuarios = json.load(f)

# Crear una conexión a la base de datos SQLite
conn = sqlite3.connect(base_de_datos)
cursor = conn.cursor()

# Insertar datos en la tabla usuarios
for usuario in datos_usuarios:
    cursor.execute('''
        INSERT OR REPLACE INTO usuarios (email, password, role)
        VALUES (?, ?, ?)
    ''', (usuario['email'], usuario['password'], usuario['role']))

# Confirmar los cambios y cerrar la conexión
conn.commit()
conn.close()

print(f"Datos cargados en la base de datos: {base_de_datos}")