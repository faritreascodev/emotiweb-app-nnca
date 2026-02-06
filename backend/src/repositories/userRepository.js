const { query } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserRepository {

    async create(nombre, email, password, tipo, fechaNacimiento = null, avatar = '🐻') {
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
      INSERT INTO usuarios (nombre, email, password_hash, tipo, fecha_nacimiento, avatar)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nombre, email, tipo, fecha_nacimiento, avatar, fecha_creacion, activo
    `;

        const result = await query(sql, [nombre, email, passwordHash, tipo, fechaNacimiento, avatar]);
        return new User(result.rows[0]);
    }

    async findById(id) {
        const sql = 'SELECT * FROM usuarios WHERE id = $1 AND activo = true';
        const result = await query(sql, [id]);

        if (result.rows.length === 0) return null;
        return new User(result.rows[0]);
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = $1 AND activo = true';
        const result = await query(sql, [email]);

        if (result.rows.length === 0) return null;
        return result.rows[0];
    }

    async verifyCredentials(email, password) {
        const userRow = await this.findByEmail(email);
        if (!userRow) return null;

        const isValid = await bcrypt.compare(password, userRow.password_hash);
        if (!isValid) return null;

        return new User(userRow);
    }

    async updateLastSession(userId) {
        const sql = 'UPDATE usuarios SET ultima_sesion = CURRENT_TIMESTAMP WHERE id = $1';
        await query(sql, [userId]);
    }

    async findAll() {
        const sql = 'SELECT * FROM usuarios WHERE activo = true ORDER BY fecha_creacion DESC';
        const result = await query(sql);
        return result.rows.map(row => new User(row));
    }
}

module.exports = new UserRepository();
