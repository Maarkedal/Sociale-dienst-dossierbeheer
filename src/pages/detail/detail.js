import { useEffect, useRef, useState } from "react";
import { ROUTES } from "../../consts/routes";
import style from "./detail.module.css";
import{Link, Navigate, useParams} from "react-router-dom";
import { useRootContext } from "../../contexts/RootStoreProvider";
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from "./printPreview/Printpreview";

const Detail = () => {
    const {globalData, dateMinMax, deleteDossier} = useRootContext();
    const {id} = useParams();
    const [item, setItem] = useState(globalData.filter(el => el.id === parseInt(id))[0]);
    const [startStop, setStartStop] = useState(false)
    const [remove, setRemove] = useState(false)
    let componentRef = useRef();



    useEffect(() => {
        if(item) {
            setStartStop(dateMinMax(item.Type))
        }
    }, [item])

    const handlePrint = useReactToPrint({
        content: () => componentRef,
    });

    const handleRemove = async () => {
        const res = await deleteDossier(id)
        if(res)setItem(undefined)
    }

    return (
        item === undefined ?
        <Navigate replace to={ROUTES.home} />
        :
        <main className={style.background}>
            <h1 className="hidden">Dossier: {item.Client.naam} - Beheerder: {item.Beheerder}</h1>
            <div className={style.buttonWrapper}>
                <Link className={style.return} to={ROUTES.home}>
                <svg height="20px" width="20px" version="1.1" id="Capa_1"
                    viewBox="0 0 32.002 32.002">
                <g>
                    <g id="undo">
                        <g>
                            <path style={{fill:'#030104'}}  d="M28.157,3.719c-4.957-4.957-13.605-4.961-18.559,0L4.001,9.32V4h-4v12.007h12v-3.92H6.978
                                l5.453-5.537c3.445-3.449,9.453-3.449,12.898,0.004c1.723,1.723,2.672,4.012,2.672,6.534c0,2.357-0.949,4.646-2.672,6.373
                                l-3.016,3.014l2.828,2.828l3.016-3.008c2.477-2.486,3.844-5.783,3.844-9.207C32.001,9.496,30.634,6.199,28.157,3.719z"/>
                            <polygon style={{fill:'#030104'}} points="18.45,32.002 15.622,29.166 18.45,26.338 21.278,29.166 			"/>
                        </g>
                    </g>
                </g>
                </svg>
                Terug</Link>

                <div className={style.buttonWrapper__detail}>
                    <Link to={`${ROUTES.addEdit.to}edit/${id}`}><p className={style.print}>Aanpassen</p></Link>
                    <p onClick={handlePrint} className={style.print}>Dossier afdrukken</p>
                    <p className={style.delete} onClick={() => setRemove(true)}>Verwijder</p>
                </div>
            </div>

            {remove ?
            <div className={style.formResponse}>
                <div className={style.formResponse__wrapper}>
                <p className={style.formResponse__message}>Bent u zeker dat u dit dossier wilt verwijderen? Eenmaal verwijderd is het niet mogelijk om het dossier terug te krijgen</p>
                <div  className={style.formResponse__buttonWrapper}>
                    <p  className={style.formResponse__button} onClick={handleRemove} to={`${ROUTES.addEdit.to}add/NA`}>Ja, verwijder het dossier</p>
                    <p   className={style.formResponse__button} onClick={() => setRemove(false)}>Neen</p>
                </div>
                </div>
            </div>
            :''
            }

            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Clientgegevens:</h2>
                <p className={style.infoBlock__text}>{item.Client.naam}</p>
                <p className={style.infoBlock__text}>{item.Client.adres}</p>
                    <p className={style.infoBlock__text}>{item.Client.postcode} {item.Client.stad}</p>
                <p className={style.infoBlock__text}>{item.Client.land}</p>
                <p className={style.infoBlock__text}>{item.Client.phone}</p>
                <p className={style.infoBlock__text}><a href={`mailto:${item.Client.mail}`}>{item.Client.mail}</a></p>
            </section>

            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Dossierhouder:</h2>
                <p className={style.infoBlock__text}>{item.Beheerder}</p>
            </section>

            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Type dossier:</h2>
                <p className={style.infoBlock__text}></p>
                <div className={style.infoBlock__wrap}>

                    {Object.keys(item.Type).map(el => Object.keys(item.Type[el]).map((dosInfo) =>
                           (
                            <dl key={`${el}${dosInfo}`} className={style.dossierTypes__list}>
                                <dt className={style.dossierTypes__list__title}>Type</dt>
                                <dd className={style.dossierTypes__list__content}>{el}</dd>

                                <dt className={style.dossierTypes__list__title}>Start datum</dt>
                                <dd className={style.dossierTypes__list__content}>{new Date(parseInt(item.Type[el][dosInfo].startDatum)).toLocaleDateString('en-GB') ?? ''}</dd>

                                {item.Type[el][dosInfo].eindDatum ? <>
                                <dt className={style.dossierTypes__list__title}>Eind datum</dt>
                                <dd className={style.dossierTypes__list__content}>{new Date(parseInt(item.Type[el][dosInfo].eindDatum)).toLocaleDateString('en-GB') ?? ''}</dd>
                                </>:''}

                                
                                <dt className={style.dossierTypes__list__title}>Opmerkingen</dt>
                                <dd className={style.dossierTypes__list__content}>{item.Type[el][dosInfo].opmerkingen ?? ''}</dd>

                                {item.Type[el][dosInfo]?.lopende ? <p className={style.dossierTypes__list__ongoing}>lopende</p> : ''}
                            </dl>
                           )

                        )
                    )}
                        
                </div>
            </section>

            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Verloop:</h2>
                {startStop.lowest ?
                    <p className={style.infoBlock__text}>
                    {new Date(startStop.lowest).toLocaleDateString('en-GB') !== "Invalid Date" && new Date(startStop.lowest).toLocaleDateString('en-GB') !== "01/01/1970" ? new Date(startStop.lowest).toLocaleDateString('en-GB') : ""}
                    {new Date(startStop.lowest).toLocaleDateString('en-GB') !== "Invalid Date" && new Date(startStop.lowest).toLocaleDateString('en-GB') !== "01/01/1970" ?  <strong> tot </strong> : ""}
                    {new Date(startStop.highest).toLocaleDateString('en-GB') !== "Invalid Date" && new Date(startStop.highest).toLocaleDateString('en-GB') !== "01/01/1970" ? (`${new Date(startStop.highest).toLocaleDateString('en-GB')}`) : ""}
                    </p>
                : ''}
            </section>

            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Meer info:</h2>
                <p className={style.infoBlock__text}>{item["Meer info"]}</p>
            </section>

            {
            item.Tijdlijn !== "[]" ? 
                item.Tijdlijn.length > 0 ? (
            <section className={style.infoBlock}>
                <h2 className={style.infoBlock__title}>Tijdlijn:</h2>

                <div className={style.timeline}>


                {item.Tijdlijn.map((timeItem, key) => (
                    <article key={`${timeItem.datum}${key}`} className={style.timeline__item}>
                            <div className={style.timeline__item__content}>
                                <h3 className={style.timeline__item__title}>{new Date(parseInt(timeItem.datum)).toLocaleDateString('en-GB') ?? ''}</h3>
                                <p className={style.timeline__item__text}>{timeItem.beschrijving}</p>
                            </div>
                            

                            <div className={style.timeline__item__styleWrap}>
                                <span className={style.timeline__item__line}></span>
                                <span className={style.timeline_line__ball}></span>
                            </div>
                    </article>
                ))}
                    



                    <span className={style.timeline_line}></span>
                </div>
            </section>
            )
            :'' : ''}


        
        <div style={{ display: "none", visibility: "hidden" }}><ComponentToPrint key={Date.now()} startStop={startStop} data={item} ref={el => (componentRef = el)}/></div>
        </main>
    );
};

export default Detail;