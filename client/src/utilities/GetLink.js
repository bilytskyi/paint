const GetLink = (env) => {
    if(env === 'dev'){
        return 'localhost:5000'
    } else if(env === 'prod') {
        return '16.170.240.78'
    }
    return 'problem with env'
}

export default GetLink