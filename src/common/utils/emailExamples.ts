export const emailExamples = {
  registrationEmail: (code: string) => {
    return `
            <h1>Thanks for your registration</h1>
               <p>To finish registration please follow the link below:
                    <a href='http://localhost:3000/api/auth/registration-confirmation?code=${code}'>complete registration</a>
                </p>
        `
  },
  recoveryPasswordByAccount: (code: string) => {
    return `
             <h1>Password recovery</h1>
                <p>To finish password recovery please follow the link below:
                    <a href='http://localhost:3000/api/auth/password-recovery?recoveryCode=${code}'>recovery password</a>
                 </p>
        `
  }
}