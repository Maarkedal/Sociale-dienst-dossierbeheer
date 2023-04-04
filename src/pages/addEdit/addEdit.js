import React, { useEffect, useState } from "react";
import style from "./addEdit.module.css";
import { useParams } from 'react-router-dom'
import { useRootContext } from "../../contexts/RootStoreProvider";
import { ROUTES } from "../../consts/routes";
import { Link, } from "react-router-dom";


const AddEdit = () => {
    const { globalData, dossierTypes, postData, setActivePage,  user, getData, updateData } = useRootContext();
    const {action, id} = useParams();
    const [hasData, setHasData] = useState(true);
    const [timeline, setTimeline] = useState([])
    const [dostypes, setDostypes] = useState([])
    const [itemData, setItemData] = useState({
        Beheerder : user.username ?? "",
        Bestandslocatie : "",
        Client : {
            adres:"",
            land:"België",
            mail:"",
            naam:"",
            phone:"",
            postcode:"9680",
            stad:"Maarkedal"
        },
        "Meer info" : "",
        Tijdlijn : "",
        id : "",
    });
    const [queryResponse, setQueryResponse] = useState(undefined)
    const [attempts, setAttempts] = useState(0);


    const handleChange = async (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value,
        })
    };

    const handleClientChange = async (e) => {
        setItemData({
            ...itemData,
            Client: {
                ...itemData.Client,
                [e.target.name]: e.target.value,
            },
        })
    }

    const handleTimeline = async (id, type, e) => {
        const tmp = timeline;
        if(type === "datum") {
            const tempDate = new Date(e.currentTarget.value)
            tmp[id][type] = tempDate.getTime();
        }
        else tmp[id][type] = e.target.value;
        setTimeline([...tmp]);
    }

    const handleDelete = (key) => {
        const tmp = timeline;
        tmp.splice(key, 1);
        setTimeline([...tmp]);
    }

    const handleDostype = async (type, id, e) => {
        const tmp = dostypes;
        if(e.currentTarget.name === "startDatum" || e.currentTarget.name === "eindDatum" ) {
            const tempDate = new Date(e.currentTarget.value)
            tmp[type][id][e.currentTarget.name] = tempDate.getTime();
        }
        else tmp[type][id][e.currentTarget.name] = e.target.value;
        setDostypes({...tmp});
    }

    const handleDostypeDelete = (el, dosInfo) => {
        const tmp = dostypes;
        tmp[el].splice(dosInfo, 1);
        setDostypes({...tmp});
    }

    const saveItem = async() => {
        let temp =  Object.assign({}, itemData);
        temp.Tijdlijn = JSON.stringify(timeline.filter(el => el.beschrijving.replaceAll(" ", "") !== "" && el.datum !== ""));
        temp.Type = JSON.stringify(dostypes)
        temp.Client = JSON.stringify(temp.Client)
        if(action === "add") {
            const result = await postData(temp)
            if(result === true)setQueryResponse(true);
        }
        else {
            const result = await updateData(temp)
            if(result === true)setQueryResponse(true);
        }
    }

    useEffect(() => {
        if(id !== "NA" && itemData.id === "")
        {
            try {
                if(id !== "NA"){
                    const foundItem = globalData.filter(el => el.id == id)[0];
                    if(foundItem){
                        setItemData(foundItem);
                        setTimeline(foundItem.Tijdlijn);
                        setDostypes(foundItem.Type);
                    }else {
                        if(attempts <= 5) setAttempts(attempts+1);
                    }
                }
            }
            catch(ex) {
                console.log(ex);
            }
        }
    }, [id, attempts])

    useEffect(() => {
        let isActive = true;

        if(!hasData)if(isActive){getData(); if(id)setTimeout(() => {attempts(0)}, 1000)};

        return () => isActive = false;
    }, [hasData])

    useEffect(() => {
        setActivePage("CRUD");
    }, [])

    const resetState = () => {
        setHasData(true)
        setTimeline([])
        setDostypes([])
        setItemData({Beheerder:user.username ?? "",Bestandslocatie:"",Client:{adres:"",land:"België",mail:"",naam:"",phone:"",postcode:"9680",stad:"Maarkedal"},"Meer info":"",Tijdlijn:"",id:"",})
        setQueryResponse(undefined)
        setAttempts(0)
    }

    return (
        id !== "NA" && attempts <= 5 && !itemData.Beheerder ?
            attempts === 5 ?
                <p className={style.errorConnecting}>Er is een fout opgetreden</p>
                :
                <main className={style.errorConnecting}>
                    <p>We proberen met de data op te halen</p>
                    {setHasData(false)}
                    <div className={style.lds_ripple}><div></div><div></div></div>
                </main>
            :
        <main className={style.background} >

            {queryResponse === true ?
                    <div className={style.formResponse}>
                        <div className={style.formResponse__wrapper}>
                        <p className={style.formResponse__message}>Het dossier is succesvol {action === "add" ? `aangemaakt` : `geüpdatet`}</p>
                        <div  className={style.formResponse__buttonWrapper}>
                            <p  className={style.formResponse__button} onClick={resetState} to={`${ROUTES.addEdit.to}add/NA`}>Nog een dossier aanmaken</p>
                            <Link   className={style.formResponse__button} to={`${ROUTES.home}`}>Terug naar de homepagina</Link>
                        </div>
                        </div>
                    </div>
                    :
             queryResponse !== undefined ?
                    <div className={style.formResponse}>
                        <div className={style.formResponse__wrapper}>
                        <p className={style.formResponse__message}>Er is een probleem opgetreden. Gelieve contact op te nemen met de developer (Miguel De Pelsmaeker)</p>
                        <div  className={style.formResponse__buttonWrapper}>
                            <p  className={style.formResponse__button} onClick={() => {setQueryResponse(undefined);saveItem()}}>Opnnieuw proberen</p>
                            <Link   className={style.formResponse__button} to={`${ROUTES.home}`}>Terug naar de homepagina</Link>
                        </div>
                        </div>
                    </div>
                    :
                    ''
            }

            {action === "edit" ? 
                <Link to={`${ROUTES.detail.to}${id}`} className={style.return}><span>←</span> Terug</Link>
                :
                ''
            }
            
            <form className={style.form}>
                
                <div className={style.clientWrap}>
                    <h2>Client gegevens:</h2>
                    <label>Naam:
                        <input name="naam" type={"text"} onChange={handleClientChange} value={itemData.Client.naam} />
                    </label>

                    <label>Adres:
                        <input name="adres" type={"text"} onChange={handleClientChange} value={itemData.Client.adres} />
                    </label>

                    <label>Land:
                        <input name="land" type={"text"} onChange={handleClientChange} value={itemData.Client.land} />
                    </label>

                    <label>Mail:
                        <input name="mail" type={"text"} onChange={handleClientChange} value={itemData.Client.mail} />
                    </label>

                    <label>Telefoon:
                        <input name="phone" type={"text"} onChange={handleClientChange} value={itemData.Client.phone} />
                    </label>

                    <label>Postcode:
                        <input name="postcode" type={"text"} onChange={handleClientChange} value={itemData.Client.postcode} />
                    </label>

                    <label>Stad:
                        <input name="stad" type={"text"} onChange={handleClientChange} value={itemData.Client.stad} />
                    </label>
                </div>

                <label>Beheerder:
                    <input name="Beheerder" type={"text"} onChange={handleChange} value={itemData.Beheerder} />
                </label>

                <div className={style.infoBlock__wrap}>

                    {Object.keys(dostypes).map((el) => Object.keys(dostypes[el]).map((dosInfo, key) =>
                           (
                            <dl key={`${el}${dosInfo}`} className={style.dossierTypes__list}>
                                <dt className={style.dossierTypes__list__title}>Type</dt>
                                <dd className={style.dossierTypes__list__content}>{el}</dd>
                                

                                <dt className={style.dossierTypes__list__title}>Start datum</dt>
                                <dd className={style.dossierTypes__list__content}><input type={"date"} value={dostypes[el][dosInfo].startDatum === null ? '' : !isNaN(dostypes[el][dosInfo].startDatum) ? new Date(parseInt(dostypes[el][dosInfo].startDatum)+3600000).toISOString().split('T')[0] : ""} name="startDatum" onChange={(e) => handleDostype(el, dosInfo, e)}/></dd>


                                <dt className={style.dossierTypes__list__title}>Eind datum</dt>
                                {console.log(dostypes[el][dosInfo].eindDatum)}
                                <dd className={style.dossierTypes__list__content}><input type={"date"} value={dostypes[el][dosInfo].eindDatum === null ? '' : !isNaN(dostypes[el][dosInfo].eindDatum) ? new Date(parseInt(dostypes[el][dosInfo].eindDatum)+3600000).toISOString().split('T')[0] : ""} name="eindDatum" onChange={(e) => handleDostype(el, dosInfo, e)}/></dd>


                                <dt className={style.dossierTypes__list__title}>Opmerkingen</dt>
                                <dd className={style.dossierTypes__list__content}><textarea value={dostypes[el][dosInfo].opmerkingen} name="opmerkingen" onChange={(e) => handleDostype(el, dosInfo, e)}/></dd>

                                <p className={style.delete} onClick={() => handleDostypeDelete(el, dosInfo)}>X</p>
                            </dl>

                           )
                        )
                    )}

                    <dl className={style.dossierTypes__list}>
                        <dt className={style.dossierTypes__list__title}>
                            <p>Selecteer een dossiertype om een dossier toe te voegen   </p>
                            <select className={style.dossierTypes__list__select} onChange={e => {
                                if(e.currentTarget.value !== ""){
                                    if(dostypes[e.currentTarget.value]){
                                        dostypes[e.currentTarget.value].push({startDatum: NaN,eindDatum: NaN,opmerkingen:""})   
                                        setDostypes({...dostypes})
                                    }
                                    else {
                                        dostypes[e.currentTarget.value] = [{startDatum:NaN,eindDatum:NaN,opmerkingen:""}];   
                                        setDostypes({...dostypes})
                                    }

                                    e.currentTarget.value = "";
                                }
                            }} name="Type">
                                <option value={""}>----</option>
                                {dossierTypes.map(dosType => (
                                    <option key={dosType.id} value={dosType.naam}>{dosType.naam}</option>
                                ))}
                            </select>
                        </dt>
                        
                    </dl>

                </div>

                <label>Beschrijving
                    <textarea name="Meer info" onChange={handleChange} value={itemData["Meer info"]} />
                </label>

                <div className={style.tijdlijn}>
                    
                    {timeline.map((timelineItem, key) => (
                        <div key={`timeline_${key}`} className={style.tijdlijn__item}>
                            <label>
                                Datum:
                                <input type={"date"} value={!isNaN(timeline[key].datum) ? new Date(parseInt(timeline[key].datum)+3600000).toISOString().split('T')[0] : ''} onChange={(e) => handleTimeline(key, "datum", e)}/>
                            </label>

                            <label>
                                Beschrijving:
                                <textarea value={timeline[key].beschrijving} onChange={(e) => handleTimeline(key, "beschrijving", e)}/>
                            </label>
                            
                            <label>
                                Tooltip:
                                <input type={"text"} value={timeline[key].tooltip} onChange={(e) => handleTimeline(key, "tooltip", e)}/>
                            </label>

                            <p className={style.delete} onClick={() => handleDelete(key)}>X</p>
                        </div>

                    ))}


                    <p className={style.addButton} onClick={() => {
                         timeline.push({datum: new Date().getTime(),beschrijving:"",tooltip:""})   
                        setTimeline([...timeline])
                    }}>+</p>
                </div>


                <p onClick={saveItem} className={style.save}>Opslaan</p>

                <span className={style.spacer}></span>

            </form>
        </main>
    );
};

export default AddEdit;