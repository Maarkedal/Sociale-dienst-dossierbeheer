import { createRef, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useRootContext } from "../../contexts/RootStoreProvider";
import style from "./manage.module.css";

const Manage = () => {

    const { globalData, dossierTypes, getData, postDostypeData, deleteDossierTypes, user, resetPassword} = useRootContext();
    const [dosTypes, setDosTypes] = useState(dossierTypes);
    const [attempts, setAttempts] = useState(0)
    const [formData,setFormData] = useState({})
    const [passwordForm,setPasswordForm] = useState({
        password: "",
        passwordConfirm: ""
    })
    const refOne = createRef();
    const refTwo = createRef();

    const fetchData = () => {
        if (dossierTypes.length === 0 && attempts <= 10) {
            setTimeout(() => {
                getData();
                setAttempts(attempts + 1);
                setDosTypes(dossierTypes);
            }, attempts >= 7 ? 2000 : 50)
        }
    }

    const handleChange = async(e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        })
    };

    
    const handlePasswordChange = async(e) => {
        setPasswordForm({
          ...passwordForm,
          [e.target.name]: e.target.value,
        })
    };

    const removeDostype = async id => {
        await deleteDossierTypes(id)
    }

    const submitDostypes = async e => {
        e.preventDefault();
        if(formData.dossierType) {
            const res = await postDostypeData({dossierType: formData.dossierType})
            if(res) {
                setDosTypes([...dossierTypes]);

            }
        }
    }

    useEffect(
        () => {
            setDosTypes([...dossierTypes]);
        }, [dossierTypes]
    )

    const changePassword = async (e) => {
        
        e.preventDefault();

        if(passwordForm.password === passwordForm.passwordConfirm) {
            const res = await resetPassword({
                password: passwordForm.password,
                mail: user.mail,
                salt: v4()
            })
            
            if(!res.message)alert('Er is een fout opgetreden')
            else alert('Uw wachtwoord is veranderd')
        }else alert('De wachtwoorden komen niet overeen')
        

    }

    return (
        globalData.length === 0 ?
            attempts <= 10 ?
                <main className={style.errorConnecting}>
                    <p>We proberen met de database te verbinden</p>
                    {fetchData()}
                    <div className={style.lds_ripple}><div></div><div></div></div>
                </main>
                :
                <main className={style.errorConnecting}>
                    <p>Er kon geen verbinding gemaakt worden met de database</p>
                    <div onClick={() => setAttempts(0)} className={`${style.retry}`}>
                        <p>Probeer opnieuw <span>⟳</span></p>
                    </div>
                </main>
            :
                <main className={style.back}>

                    <article className={`${style.dosTypes} ${style.manage__article}`}>
                        <h2 className={style.manage__article__title}>Dossier types</h2>
                        <form className={`${style.dosTypes__form} ${style.manage__article__form}`}>
                            <input type={"text"} name="dossierType" value={formData.dossierType ?? ''} onChange={handleChange}/>
                            <input className={style.dosTypes__form__submit} type={"submit"} value="Toevoegen" onClick={submitDostypes} />
                        </form>
                        <ul className={style.dosTypes__list}>
                            {dosTypes ?

                                dosTypes.map((dosType, key) => {
                                    return <li key={key} className={style.dosTypes__list__item}>{dosType.naam}<span onClick={() => removeDostype(dosType.id)} className={style.dosTypes__list__delete}>x</span></li>
                                })
                                
                                : ''
                            
                            }
                        </ul>
                    </article>

                    <article className={`${style.personal} ${style.manage__article}`}>
                        <h2 className={style.manage__article__title}>Persoonlijke gegevens</h2>

                        <form className={`${style.personal__form} ${style.manage__article__form}`}>

                            <label  className={style.personal__form__label}>
                                <p>Nieuw wachtwoord</p>
                                <span>
                                    <input autoComplete="on" ref={refOne} type={"password"} name="password" value={passwordForm.password} onChange={handlePasswordChange}/>
                                    <svg 
                                        onClick={() => {refOne.current.type === "password" ? refOne.current.type = "text" : refOne.current.type = "password"}}
                                        className={style.eye} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </label>


                            <label  className={style.personal__form__label}>
                                <p>Bevestig nieuw wachtwoord</p>
                                <span>
                                    <input autoComplete="on" ref={refTwo} type={"password"} name="passwordConfirm" value={passwordForm.passwordConfirm} onChange={handlePasswordChange}/>
                                    <svg 
                                        onClick={() => {refTwo.current.type === "password" ? refTwo.current.type = "text" : refTwo.current.type = "password"}}
                                        className={style.eye} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </label>

                            <button className={style.personal__form__submit} onClick={changePassword} type={"submit"} value="Wachtwoord veranderen">Wachtwoord veranderen</button>
                        </form>

                    </article>
                </main>
    );
};

export default Manage;