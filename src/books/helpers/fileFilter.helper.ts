/**
 * Esta función se encarga de filtrar los archivos que se van a subir al servidor
 * @param req
 * @param file
 * @param callback
 */
export const fileFilter= (req: Request, file: Express.Multer.File, callback: Function) => {
    /**
     * Si el archivo no existe, se lanza un error.
     */
    if(!file) return callback(new Error('La imagen es obligatoria'), false);
    /**
     * Se obtiene la extensión del archivo.
     */
    const fileExtension = file.mimetype.split('/')[1];
    /**
     * Se obtienen las extensiones válidas.
     */
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    /**
     * Si la extensión del archivo es válida, se devuelve true.
     * True significa que el archivo es válido.
     */
    if (validExtensions.includes(fileExtension)) {
        return callback(null, true);
    }
    /**
     * Si la extensión del archivo no es válida, se devuelve false.
     */
    callback(null, false);
}