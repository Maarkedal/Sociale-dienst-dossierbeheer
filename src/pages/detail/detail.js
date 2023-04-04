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
                <Link className={style.return} to={ROUTES.home}>← Terug</Link>

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

                                <dt className={style.dossierTypes__list__title}>Eind datum</dt>
                                <dd className={style.dossierTypes__list__content}>{new Date(parseInt(item.Type[el][dosInfo].eindDatum)).toLocaleDateString('en-GB') ?? ''}</dd>

                                <dt className={style.dossierTypes__list__title}>Opmerkingen</dt>
                                <dd className={style.dossierTypes__list__content}>{item.Type[el][dosInfo].opmerkingen ?? ''}</dd>
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