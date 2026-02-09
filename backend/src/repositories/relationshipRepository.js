const { query } = require('../config/database');

class RelationshipRepository {

    async createRelationship(padreId, hijoId) {
        const sql = `
      INSERT INTO relaciones_padre_hijo (padre_id, hijo_id)
      VALUES (?, ?)
    `;
        const result = await query(sql, [padreId, hijoId]);
        return result.rows.insertId;
    }

    async getChildrenByParentId(padreId) {
        const sql = `
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.avatar,
        u.fecha_nacimiento,
        u.fecha_creacion,
        u.ultima_sesion,
        rph.fecha_vinculacion
      FROM relaciones_padre_hijo rph
      INNER JOIN usuarios u ON rph.hijo_id = u.id
      WHERE rph.padre_id = ? AND rph.activa = true AND u.activo = true
      ORDER BY u.nombre ASC
    `;
        const result = await query(sql, [padreId]);
        return result.rows;
    }

    async getParentsByChildId(hijoId) {
        const sql = `
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.avatar,
        rph.fecha_vinculacion
      FROM relaciones_padre_hijo rph
      INNER JOIN usuarios u ON rph.padre_id = u.id
      WHERE rph.hijo_id = ? AND rph.activa = true AND u.activo = true
    `;
        const result = await query(sql, [hijoId]);
        return result.rows;
    }

    async hasRelationship(padreId, hijoId) {
        const sql = `
      SELECT COUNT(*) as count
      FROM relaciones_padre_hijo
      WHERE padre_id = ? AND hijo_id = ? AND activa = true
    `;
        const result = await query(sql, [padreId, hijoId]);
        return result.rows[0].count > 0;
    }

    async removeRelationship(padreId, hijoId) {
        const sql = `
      UPDATE relaciones_padre_hijo
      SET activa = false
      WHERE padre_id = ? AND hijo_id = ?
    `;
        await query(sql, [padreId, hijoId]);
    }

    async canAccessChild(padreId, hijoId) {
        // Admin puede acceder a todos
        const adminCheck = await query(
            'SELECT tipo FROM usuarios WHERE id = ?',
            [padreId]
        );

        if (adminCheck.rows[0]?.tipo === 'admin') {
            return true;
        }

        // Verificar relación padre-hijo
        return await this.hasRelationship(padreId, hijoId);
    }
}

module.exports = new RelationshipRepository();
