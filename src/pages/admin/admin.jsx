import { createRef, useState } from "react";
import style from "./admin.module.css";
import { v4 } from 'uuid'
import { useRootContext } from "../../contexts/RootStoreProvider";
import { ROUTES } from "../../consts/routes";
import { Link, } from "react-router-dom";

const Admin = () => {

    const {createLogin, resetPassword} = useRootContext();

    const [response, setResponse] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        mail: '',
        salt: v4(),
        role: 'user'
    })

    const [resetData, setResetData] = useState({
        password: '',
        mail: '',
        salt: v4(),
    })

    const resetState = () => {
        setFormData({username:'',password:'',mail:'',salt:v4(),role:'user'})
        setResetData({password:'',mail:'',salt:v4(),})
        setResponse(false)
    }

    const refOne = createRef()
    const refTwo = createRef()

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.currentTarget.name]: e.currentTarget.value,
        })
    }

    const handleResetChange = async (e) => {
        setResetData({
            ...resetData,
            [e.currentTarget.name]: e.currentTarget.value,
        })
    }

    const submitLogin = async () => {
        if( formData.username !== '' && formData.password !== '' && formData.mail !== '' ){
            const res = await createLogin(structuredClone(formData))
            if(res.message)setResponse(res)
            else setResponse({state: false, message: "Er is een fout opgetreden"})
        }
    }

    const submitReset = async () => {
        if(resetData.password !== '' && resetData.mail !== '' ){
            const res = await resetPassword(structuredClone(resetData))
            if(res.message)setResponse(res)
            else setResponse({state: false, message: "Er is een fout opgetreden"})
        }
    }

    return (
        <main className={style.back}>

            {response.message ? 

                <div className={style.formResponse}>
                    <div className={style.formResponse__wrapper}>
                    <p className={style.formResponse__message}>{response.message}</p>
                    <div  className={style.formResponse__buttonWrapper}>
                        {!response.state ? <p  className={style.formResponse__button_wide} onClick={() => setResponse(false)}>Gegevens aanpassen</p> : ''}
                        <p  className={style.formResponse__button} onClick={resetState}>Sluiten</p>
                        <Link   className={style.formResponse__button} to={`${ROUTES.home}`}>Terug naar de homepagina</Link>
                    </div>
                    </div>
                </div>
                
            :''}
            
            <article className={style.content}>
                <div>
                    <h2 className={style.title}>Maak een nieuwe gebruiker</h2>
                    <form>
                        <label className={style.label} htmlFor="username">
                            Naam:
                            <input autoComplete="new-username" id="username" name="username" type={"text"} value={formData.username} onKeyDown={e => { if (e.code === "Enter") submitLogin() }} onChange={handleChange} />
                        </label>

                        <label className={style.label} htmlFor="mail">
                            E-Mail:
                            <input id="mail" name="mail" type={"mail"} value={formData.mail} onKeyDown={e => { if (e.code === "Enter") submitLogin() }} onChange={handleChange} />
                        </label>

                        <label className={style.label} htmlFor="password">
                            <p>Wachtwoord:</p>
                            <input autoComplete="new-password" ref={refOne} id="password" name="password" type={"password"} value={formData.password} onKeyDown={e => { if (e.code === "Enter") submitLogin() }} onChange={handleChange} />
                            <svg
                                onClick={() => { refOne.current.type === "password" ? refOne.current.type = "text" : refOne.current.type = "password" }}
                                className={style.eye} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </label>


                        <label className={style.label} htmlFor="password">
                            <p>Type gebruiker:</p>
                            <select name='role' onChange={handleChange}>
                                <option value={'user'}>Gebruiker</option>
                                <option value={'admin'}>Admin</option>
                            </select>
                        </label>

                    </form>
                    <p className={style.submitButton} onClick={submitLogin}>Gebruiker aanmaken</p>
                </div>


                <div className={style.form__reset}>
                    <h2 className={style.title}>Reset wachtwoord van gebruiker</h2>
                    <form>
                        <label className={style.label} htmlFor="mailReset">
                            E-Mail:
                            <input id="mailReset" name="mail" type={"mail"} value={resetData.mail} onChange={handleResetChange} />
                        </label>

                        <label className={style.label} htmlFor="passwordReset">
                            <p>Nieuw wachtwoord:</p>
                            <input autoComplete="new-password" ref={refTwo} id="passwordReset" name="password" type={"password"} value={resetData.password} onChange={handleResetChange} />
                            <svg
                                onClick={() => { refTwo.current.type === "password" ? refTwo.current.type = "text" : refTwo.current.type = "password" }}
                                className={style.eye} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </label>

                    </form>
                    <p className={style.submitButton} onClick={submitReset}>Reset wachtwoord</p>
                </div>
            </article>

            <article className={style.content}>

            </article>

        </main>
    );
};

export default Admin;