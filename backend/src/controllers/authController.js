const userRepository = require('../repositories/userRepository');
const JwtHelper = require('../utils/jwtHelper');
const ResponseHelper = require('../utils/responseHelper');

class AuthController {

    async register(req, res) {
        try {
            const { nombre, email, password, tipo, fechaNacimiento, avatar } = req.body;

            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return ResponseHelper.badRequest(res, 'El email ya está registrado');
            }

            const user = await userRepository.create(
                nombre,
                email,
                password,
                tipo,
                fechaNacimiento,
                avatar
            );

            const token = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                tipo: user.tipo
            });

            return ResponseHelper.success(res, {
                user: user.toJSON(),
                token
            }, 'Usuario registrado exitosamente', 201);

        } catch (error) {
            console.error('Error en register:', error);
            return ResponseHelper.error(res, 'Error al registrar usuario');
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userRepository.verifyCredentials(email, password);

            if (!user) {
                return ResponseHelper.unauthorized(res, 'Credenciales inválidas');
            }

            await userRepository.updateLastSession(user.id);

            const token = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                tipo: user.tipo
            });

            return ResponseHelper.success(res, {
                user: user.toJSON(),
                token
            }, 'Login exitoso');

        } catch (error) {
            console.error('Error en login:', error);
            return ResponseHelper.error(res, 'Error al iniciar sesión');
        }
    }

    async getProfile(req, res) {
        try {
            const user = await userRepository.findById(req.user.id);

            if (!user) {
                return ResponseHelper.notFound(res, 'Usuario');
            }

            return ResponseHelper.success(res, user.toJSON());

        } catch (error) {
            console.error('Error en getProfile:', error);
            return ResponseHelper.error(res, 'Error al obtener perfil');
        }
    }
}

module.exports = new AuthController();
