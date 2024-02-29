export function obtenerFechaHoraActual(): { fecha: string; hora: string } {
    const fechaHoraActual = new Date();

    const año = fechaHoraActual.getFullYear();
    const mes = ('0' + (fechaHoraActual.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaHoraActual.getDate()).slice(-2);

    const horas = ('0' + fechaHoraActual.getHours()).slice(-2);
    const minutos = ('0' + fechaHoraActual.getMinutes()).slice(-2);
    const segundos = ('0' + fechaHoraActual.getSeconds()).slice(-2);

    const fechaEnFormato = `${año}-${mes}-${dia}`;
    const horaEnFormato = `${horas}:${minutos}:${segundos}`;

    return { fecha: fechaEnFormato, hora: horaEnFormato };
  }