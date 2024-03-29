import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { useRootContext } from "../../contexts/RootStoreProvider";
import style from "./home.module.css";
//import { utils, writeFile } from "xlsx";

const Home = () => {

    const { globalData, dossierTypes, getData, setActivePage } = useRootContext();
    const [collection, setCollection] = useState(globalData);
    const [dosTypes, setDosTypes] = useState(dossierTypes);
    const [attempts, setAttempts] = useState(0)
    const [filterData, setFilterData] = useState({
        Client: "",
        Beheerder: "",
        Type: "",
        startDatum: "",
        Beschrijving: "",
        eindDatum: "",
        dosTypes: [],
        lopende: false,
    });

    const handleChange = async(e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFilterData({
          ...filterData,
          [e.target.name]: value,
        })
    };

    const handleSelectChange = async e => {
        if(e.currentTarget.value === "")filter()
        else setFilterData({
            ...filterData,
            dosTypes: {
                ...filterData.dosTypes,
                [e.target.value]: {
                    start: 0,
                    end: new Date().getTime()
                }
            }
        })
    }

    const filter = () => {
        let tempArray = globalData.filter((el) => {
            const dStart = new Date(el.lowestDate);
            const dEnd = new Date(el.highestDate);
    

            console.log(dStart)
            console.log(dEnd)

            // Check if dosTypesFiltered and lopende meet criteria
            let meetsCriteria = true;
    
            if (filterData.lopende) {
                meetsCriteria = Object.keys(el.Type).some(typ => el.Type[typ].some(item => item.lopende));
            }
    
            if (meetsCriteria && Object.keys(filterData.dosTypes).length > 0) {
                meetsCriteria = Object.keys(filterData.dosTypes).some(dosType => {
                    if (el.Type[dosType]) {
                        return Object.keys(el.Type[dosType]).some(key =>
                            el.Type[dosType][key].startDatum >= filterData.dosTypes[dosType].start &&
                            el.Type[dosType][key].eindDatum <= filterData.dosTypes[dosType].end
                        );
                    } else {
                        return false;
                    }
                });
            }
    
            // Apply filters
            return el['Beheerder'].toLowerCase().includes(filterData.Beheerder.toLowerCase()) &&
                el['Meer info'].toLowerCase().includes(filterData.Beschrijving.toLowerCase()) &&
                el.Client.naam.toLowerCase().includes(filterData.Client.toLowerCase()) &&
                (!filterData.startDatum || dStart >= new Date(filterData.startDatum)) &&
                (!filterData.eindDatum || dEnd <= new Date(filterData.eindDatum)) &&
                meetsCriteria;
        });
    
        setCollection(tempArray);
    };
    

    useEffect(() => {
        setActivePage("Home");
    }, [])

    const handleDostypeChange = (key, e) => {
        filterData.dosTypes[key][e.currentTarget.name] = new Date(e.currentTarget.value).getTime();
        setFilterData({...filterData})
    }

    const fetchData = () => {
        if (collection.length === 0 && attempts <= 10) {
            setTimeout(() => {
                getData();
                setAttempts(attempts + 1);
                setCollection(globalData);
            }, attempts >= 7 ? 2000 : 50)
        }
    }

    useEffect(
        () => {
            let isActive = true

            if(isActive) {
                setCollection(globalData);
                setDosTypes(dossierTypes);
            }

            return () => isActive = false;
        }, [globalData, dossierTypes]
    )

    useEffect(() => {
        let isActive = true
            if(isActive) filter();
        return () => isActive = false;
    }, [filterData])

    useEffect(() => {
        let isActive = false;

        if(isActive) {
            setCollection(globalData)
            setDosTypes(dossierTypes)
        }

        return () => isActive = false;
    
    }, [globalData])


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
                <div className={style.filterWrap}>
                    
                    <div className={style.filter}>
                    <h2> Sorteren op: </h2>
                        <label>Clientnaam:
                            <input name="Client" type={"text"} onChange={handleChange} value={filterData.Client} />
                        </label>
                        <label>Beheerder:
                            <input name="Beheerder" type={"text"} onChange={handleChange} value={filterData.Beheerder} />
                        </label>

                        <label>Type dossier:
                            <select onChange={handleSelectChange} name="Type">
                                <option value={""}>Alle</option>
                                {dosTypes.map(dosType => (
                                    <option key={dosType.id} value={dosType.naam}>{dosType.naam}</option>
                                ))}
                            </select>
                        </label>
                        <label>Start datum:
                            <input name="startDatum" onChange={handleChange} type={"date"} value={filterData.startDatum} />
                        </label>
                        <label>Beschrijving
                            <input name="Beschrijving" onChange={handleChange} type={"text"} value={filterData.Beschrijving} />
                        </label>
                        <label>Eind datum:
                            <input name="eindDatum" onChange={handleChange} type={"date"} value={filterData.eindDatum} />
                        </label>


                        <label>Lopende:
                            <input className={style.filter__checkbox} name="lopende" onChange={handleChange} type={"checkbox"} checked={filterData.lopende ? 'checked' : ''} value={!filterData.lopende} />
                        </label>
                        
                        <p className={`${style.filter__export} hidden`}>Exporteer als XLSX</p>
                                
                        <span style={{width: "100%"}}></span>
                        
                        {Object.keys(filterData.dosTypes).map((dosType, index) => {
                            return (
                                <div key={dosType} className={style.dossierFrame}>
                                    <h3>{dosType}:</h3>
                                    <label className={style.dossierFrame__label}>
                                        Start:
                                        <input name="start" onChange={(e) => handleDostypeChange(dosType, e)} type={"date"} value={`${new Date(parseInt(filterData.dosTypes[dosType].start)).toISOString().split('T')[0]}`} />
                                    </label>
    
                                    <label className={style.dossierFrame__label}>
                                        Eind:
                                        <input name="end" onChange={(e) => handleDostypeChange(dosType, e)} type={"date"} value={`${new Date(parseInt(filterData.dosTypes[dosType].end)).toISOString().split('T')[0]}`} />
                                    </label>
                                    <p className={style.dossierDelete} onClick={() => {delete filterData.dosTypes[dosType]; setFilterData({...filterData})}}>X</p>
                                </div>
                                )
                        })}

                    </div>
                </div>

                <div className="wrap">
                    <section className={style.cards}>
                        {collection.map((collect) => (
                            <Link className={style.card__wrap} key={collect.id} to={`${ROUTES.detail.to}${collect.id}`}>
                            <article className={style.card}>
                            <div className={style.card__intro}>
                                <p className={style.card__intro__title}>{collect.Client.naam}</p>
                                <p className={style.card__intro__type}>{Object.keys(collect.Type).map(el => (<span key={`${collect.id}${el}`} className={style.card__intro__type__span}>{el}</span>))}</p>
                            </div>

                            <div className={style.card__manage}>
                                <p className={style.card__manage__title}>Wordt beheerd door:</p>
                                <p className={style.card__manage__description}>{collect.Beheerder}</p>
                            </div>


                            <div className={style.card__duration}>
                                {collect.lowestDate ?
                                    (                       
                                        <>         
                                        <p className={style.card__duration__title}>Start datum:</p>                                   
                                        <p className={style.card__duration__description}>{new Date(collect.lowestDate).toLocaleDateString('en-GB')}</p>
                                        </>
                                    ): ''
                                }

                                {collect.highestDate ?
                                    (                       
                                        <>         
                                            <p className={style.card__duration__title}>Eind datum:</p>
                                            <p className={style.card__duration__description}>{new Date(collect.highestDate).toLocaleDateString('en-GB')}</p>
                                        </>
                                    ): ''
                                }
                                
                                
                            </div>
                            

                        </article>
                        </Link>
                        ))}
                    </section>

                </div>
            </main>
    );
};

export default Home;