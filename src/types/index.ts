export interface HealthCheckResponse {
    status : 'OK' | 'ERROR',
    timeStamp : string,
    services? : {
        database : string,
        redis : string
    },
    error? : Error | unknown
}