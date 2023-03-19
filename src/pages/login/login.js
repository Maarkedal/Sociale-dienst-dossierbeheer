import { createRef, useState, useEffect } from "react";
import style from "./login.module.css";
import { useRootContext } from "../../contexts/RootStoreProvider";
import { ROUTES } from "../../consts/routes";
import { redirect } from "react-router-dom";


const Login = () => {
    const { login, user } = useRootContext();
    const [formData, setFormData] = useState({
        mail: user.mail ?? '',
        password: ''
    })

    const [result, setResult] = useState(undefined)
    const refOne = createRef();

    const submitLogin = async () => {
        const res = await login(structuredClone(formData))
        setResult(res)
    }

    const handleChange = async(e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        })
     }

    useEffect(() => {
        let isActive = true

        if(isActive)
        setFormData({
            mail: user.mail ?? '',
            password: ''
        })

        return () => isActive = false
    }, [user])

    return (
        <main className={style.back}>
            
            { result ? redirect(ROUTES.home) : '' }

            <form>

                <label className={style.label} htmlFor="mail">
                    Mail:
                    <input id="mail" name="mail" type={"mail"} value={formData.mail} onKeyDown={e => {if(e.code === "Enter")submitLogin()}} onChange={handleChange} />
                </label>

                <label className={style.label} htmlFor="password">
                    <p>Wachtwoord:</p>
                    <input ref={refOne} id="password" name="password" type={"password"} value={formData.password} onKeyDown={e => {if(e.code === "Enter")submitLogin()}} onChange={handleChange} />
                    <svg 
                        onClick={() => {refOne.current.type === "password" ? refOne.current.type = "text" : refOne.current.type = "password"}}
                        className={style.eye} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </label>
                {!result && result !== undefined ? <p className={style.error}>De door u opgegeven login gegevens zijn niet correct</p>:''}

            </form>
            <p className={style.submitButton} onClick={submitLogin}>Aanmelden</p>
        </main>
    );
};

export default Login;