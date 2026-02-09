#!/bin/bash

# Script de verificación del sistema EmotiWeb
# Verifica que todos los servicios estén funcionando correctamente

echo "🐻 EmotiWeb - Script de Verificación del Sistema"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar servicio
check_service() {
    local service=$1
    local url=$2
    local expected=$3
    
    echo -n "Verificando $service... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ "$response" == "$expected" ]; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL (HTTP $response)${NC}"
        return 1
    fi
}

# Contador de errores
errors=0

echo "1. Verificando servicios Docker..."
echo "-----------------------------------"

# Verificar que Docker Compose esté corriendo
if docker compose ps | grep -q "running"; then
    echo -e "${GREEN}✓ Docker Compose está corriendo${NC}"
else
    echo -e "${RED}✗ Docker Compose NO está corriendo${NC}"
    echo "Ejecuta: docker compose up -d"
    exit 1
fi

echo ""
echo "2. Verificando servicios web..."
echo "-----------------------------------"

# Verificar Backend Health
check_service "Backend Health" "http://localhost:3001/health" "200"
((errors+=$?))

# Verificar Backend API Root
check_service "Backend API" "http://localhost:3001/api" "200"
((errors+=$?))

# Verificar Swagger
check_service "Swagger Docs" "http://localhost:3001/api-docs/" "200"
((errors+=$?))

# Verificar Frontend
check_service "Frontend" "http://localhost:3000" "200"
((errors+=$?))

echo ""
echo "3. Verificando Base de Datos..."
echo "-----------------------------------"

# Verificar MySQL
if docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -e "SELECT 1" emotiweb_db &> /dev/null; then
    echo -e "${GREEN}✓ MySQL está accesible${NC}"
else
    echo -e "${RED}✗ MySQL NO está accesible${NC}"
    ((errors++))
fi

# Verificar tablas principales
tables=("usuarios" "emociones" "juegos" "sesiones_juego" "progreso_usuario" "relaciones_padre_hijo" "respuestas_juego" "logros" "logros_usuario")

for table in "${tables[@]}"; do
    if docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -e "SHOW TABLES LIKE '$table'" emotiweb_db | grep -q "$table"; then
        echo -e "${GREEN}✓ Tabla '$table' existe${NC}"
    else
        echo -e "${RED}✗ Tabla '$table' NO existe${NC}"
        ((errors++))
    fi
done

echo ""
echo "4. Verificando datos de prueba..."
echo "-----------------------------------"

# Verificar usuarios de prueba
user_count=$(docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SELECT COUNT(*) FROM usuarios" emotiweb_db)

if [ "$user_count" -ge 3 ]; then
    echo -e "${GREEN}✓ Usuarios de prueba existen ($user_count usuarios)${NC}"
else
    echo -e "${RED}✗ Faltan usuarios de prueba ($user_count usuarios)${NC}"
    ((errors++))
fi

# Verificar emociones
emotion_count=$(docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SELECT COUNT(*) FROM emociones" emotiweb_db)

if [ "$emotion_count" -ge 5 ]; then
    echo -e "${GREEN}✓ Emociones cargadas ($emotion_count emociones)${NC}"
else
    echo -e "${RED}✗ Faltan emociones ($emotion_count emociones)${NC}"
    ((errors++))
fi

# Verificar juegos
game_count=$(docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SELECT COUNT(*) FROM juegos" emotiweb_db)

if [ "$game_count" -ge 4 ]; then
    echo -e "${GREEN}✓ Juegos cargados ($game_count juegos)${NC}"
else
    echo -e "${RED}✗ Faltan juegos ($game_count juegos)${NC}"
    ((errors++))
fi

# Verificar logros
achievement_count=$(docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SELECT COUNT(*) FROM logros" emotiweb_db)

if [ "$achievement_count" -ge 8 ]; then
    echo -e "${GREEN}✓ Logros cargados ($achievement_count logros)${NC}"
else
    echo -e "${RED}✗ Faltan logros ($achievement_count logros)${NC}"
    ((errors++))
fi

# Verificar relación padre-hijo de prueba
relationship_count=$(docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SELECT COUNT(*) FROM relaciones_padre_hijo" emotiweb_db)

if [ "$relationship_count" -ge 1 ]; then
    echo -e "${GREEN}✓ Relación padre-hijo de prueba existe${NC}"
else
    echo -e "${YELLOW}⚠ No hay relaciones padre-hijo (esto es normal si es primera vez)${NC}"
fi

echo ""
echo "5. Verificando triggers..."
echo "-----------------------------------"

# Verificar triggers
triggers=("tr_crear_progreso_usuario" "tr_actualizar_progreso_al_finalizar_sesion" "tr_actualizar_emocion_aprendida")

for trigger in "${triggers[@]}"; do
    if docker exec emotiweb-mysql mysql -u emotiweb_user -pemotiweb_pass_2026 -sN -e "SHOW TRIGGERS LIKE '%$trigger%'" emotiweb_db | grep -q "$trigger"; then
        echo -e "${GREEN}✓ Trigger '$trigger' existe${NC}"
    else
        echo -e "${RED}✗ Trigger '$trigger' NO existe${NC}"
        ((errors++))
    fi
done

echo ""
echo "6. Prueba de API..."
echo "-----------------------------------"

# Test de login
echo -n "Probando login... "
login_response=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"estudiante@test.com","password":"password123"}')

if echo "$login_response" | grep -q "token"; then
    echo -e "${GREEN}✓ Login funciona${NC}"
    
    # Extraer token
    token=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    # Test de endpoint protegido
    echo -n "Probando endpoint protegido... "
    profile_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:3001/api/auth/profile)
    
    if echo "$profile_response" | grep -q "email"; then
        echo -e "${GREEN}✓ Autenticación funciona${NC}"
    else
        echo -e "${RED}✗ Autenticación NO funciona${NC}"
        ((errors++))
    fi
else
    echo -e "${RED}✗ Login NO funciona${NC}"
    ((errors++))
fi

echo ""
echo "=================================================="
echo "Resumen de Verificación"
echo "=================================================="

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ TODOS LOS TESTS PASARON${NC}"
    echo ""
    echo "El sistema está funcionando correctamente!"
    echo ""
    echo "Accede a:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - API Docs: http://localhost:3001/api-docs"
    echo "  - Backend:  http://localhost:3001"
    echo ""
    echo "Usuarios de prueba:"
    echo "  - estudiante@test.com / password123"
    echo "  - padre@test.com / password123"
    echo "  - admin@test.com / password123"
    exit 0
else
    echo -e "${RED}✗ $errors TEST(S) FALLARON${NC}"
    echo ""
    echo "Revisa los errores arriba y ejecuta:"
    echo "  docker compose down -v"
    echo "  docker compose up --build -d"
    exit 1
fi
