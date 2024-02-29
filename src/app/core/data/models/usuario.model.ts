
export interface LoginUsuarioModel {
    email: string,
    password: string
}

export interface RegisterUsuarioModel {
    nombres: string,
    apellidos: string,
    identificacion: number,
    email: string,
    password: string,
    roles: string,
    // estacionAsignada: string
}