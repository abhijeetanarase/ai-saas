



const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.log(err.stack);
    const statusCode = res.statusCode ||  500;
    
    res.status(statusCode).json({
        message: err.message,
        success :false
    });
};



export {errorHandler};