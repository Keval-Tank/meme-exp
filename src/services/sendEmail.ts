import { resend } from "../lib/resend";

type SendEmailResponse = {
    success : boolean,
    id? : string,
    error? : string
}

export const sendSignInEmail = async(to:string, otp:string) : Promise<SendEmailResponse> => {
    const {data, error} = await resend.emails.send({
        from : 'Team MemeGPT',
        to,
        subject : "Sign In using OTP",
        html : `<h1>${otp}</h1>`
    })

    if(error){
        return {
            success : false,
            error : "Failed to send email : "+error.message
        }
    }

    return {
        success : true,
        id : data.id
    }
}