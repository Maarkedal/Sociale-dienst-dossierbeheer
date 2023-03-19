import React from "react";
import style from "./Printpreview.module.css";

//const Printpreview = forwardRef(({data}, ref) => {
export class ComponentToPrint extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { checked: false };
        this.data = props.data;
        this.startStop = props.startStop;
    }

    render() {

        const data = this.data
        const startStop = this.startStop

        return (
            <main className={style.background}>
                <h1>Dossier: {data.Client.naam} - Beheerder: {data.Beheerder}</h1>

                <section className={style.infoBlock}>
                    <h2 className={style.infoBlock__title}>Clientgegevens:</h2>
                    <p className={style.infoBlock__text}>{data.Client.naam}</p>
                    <p className={style.infoBlock__text}>{data.Client.adres}</p>
                    <p className={style.infoBlock__text}>{data.Client.postcode} {data.Client.stad}</p>
                    <p className={style.infoBlock__text}>{data.Client.land}</p>
                    <p className={style.infoBlock__text}>{data.Client.phone}</p>
                    <p className={style.infoBlock__text}>{data.Client.mail}</p>
                </section>

                <section className={style.infoBlock}>
                    <h2 className={style.infoBlock__title}>Dossierhouder:</h2>
                    <p className={style.infoBlock__text}>{data.Beheerder}</p>
                </section>

                <section className={`${style.infoBlock} ${style.infoBlock__exception}`}>
                    <h2 className={style.infoBlock__title}>Type dossier:</h2>
                    <p className={style.infoBlock__text}></p>
                    <div className={style.infoBlock__wrap}>

                    {Object.keys(data.Type).map(el => Object.keys(data.Type[el]).map((dosInfo) =>
                           (
                            <dl key={`${el}${dosInfo}`} className={style.dossierTypes__list}>
                                <dt className={style.dossierTypes__list__title}>Type</dt>
                                <dd className={style.dossierTypes__list__content}>{el}</dd>

                                <dt className={style.dossierTypes__list__title}>Start datum</dt>
                                <dd className={style.dossierTypes__list__content}>{new Date(parseInt(data.Type[el][dosInfo].startDatum)).toLocaleDateString('en-GB') ?? ''}</dd>

                                <dt className={style.dossierTypes__list__title}>Eind datum</dt>
                                <dd className={style.dossierTypes__list__content}>{new Date(parseInt(data.Type[el][dosInfo].eindDatum)).toLocaleDateString('en-GB') ?? ''}</dd>

                                <dt className={style.dossierTypes__list__title}>Opmerkingen</dt>
                                <dd className={style.dossierTypes__list__content}>{data.Type[el][dosInfo].opmerkingen ?? ''}</dd>
                            </dl>
                           )
                        )
                    )}
                        

                </div>
                </section>

                <section className={style.infoBlock}>
                    <h2 className={style.infoBlock__title}>Verloop:</h2>
                    {startStop.lowest ?
                    <p className={style.infoBlock__text}>{new Date(startStop.lowest).toLocaleDateString('en-GB')} <strong>tot</strong> {new Date(startStop.highest).toLocaleDateString('en-GB')}</p>
                    : ''}
                </section>

                <section className={style.infoBlock}>
                    <h2 className={style.infoBlock__title}>Meer info:</h2>
                    <p className={style.infoBlock__text}>{data["Meer info"]}</p>
                </section>

                {data.Tijdlijn !== "[]" ? data.Tijdlijn.length > 0 ? (
                    <section className={`${style.infoBlock} ${style.timelineWrapper}`}>
                        <h2 className={style.infoBlock__title}>Tijdlijn:</h2>

                        <div className={style.timeline}>


                            {data.Tijdlijn.map((timeItem, key) => (
                                <article key={`printPrev${timeItem.datum}${key}`} className={style.timeline__item}>
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
                    : '' : ''}

            </main>
        );
    }
};

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return <ComponentToPrint ref={ref} text={props.text} />;
});
