// creating a custom error for better self-experience

class customError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code
    }
}

export default customError;