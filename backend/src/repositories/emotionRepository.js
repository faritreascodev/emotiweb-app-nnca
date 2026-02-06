const { query } = require('../config/database');

class EmotionRepository {

    async findAll() {
        const sql = 'SELECT * FROM emociones ORDER BY orden ASC';
        const result = await query(sql);
        return result.rows;
    }

    async findById(id) {
        const sql = 'SELECT * FROM emociones WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }
}

module.exports = new EmotionRepository();
