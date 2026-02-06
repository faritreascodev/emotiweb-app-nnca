class User {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.email = data.email;
        this.tipo = data.tipo;
        this.fechaNacimiento = data.fecha_nacimiento;
        this.avatar = data.avatar || '🐻';
        this.fechaCreacion = data.fecha_creacion;
        this.ultimaSesion = data.ultima_sesion;
        this.activo = data.activo !== false;
    }

    esEstudiante() {
        return this.tipo === 'estudiante';
    }

    esPadre() {
        return this.tipo === 'padre';
    }

    esEducador() {
        return this.tipo === 'educador';
    }

    calcularEdad() {
        if (!this.fechaNacimiento) return null;
        const hoy = new Date();
        const nacimiento = new Date(this.fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            tipo: this.tipo,
            fechaNacimiento: this.fechaNacimiento,
            edad: this.calcularEdad(),
            avatar: this.avatar,
            fechaCreacion: this.fechaCreacion,
            ultimaSesion: this.ultimaSesion,
            activo: this.activo
        };
    }
}

module.exports = User;
