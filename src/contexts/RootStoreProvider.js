import { AES, enc } from "crypto-js";
import { createContext, useContext, useEffect, useState } from "react";
import {SHA256} from 'crypto-js';


const KEY = "ROOTSTORE_USER";
const secrcet = "RReZm04b5eKmW8lJKVyj7WY0qnfcCjMCj7N";

const RootStore = createContext();
const saveLoginToStorage = (user) => localStorage.setItem(KEY, (user));

const RootStoreProvider = ({ children }) => {
    const PORT = 8080;
    const [user, setUser] = useState(false);
    const [activePage, setActivePage] = useState("SubsidieOproepen")
    const [globalData, setGlobalData] = useState([]);
    const [dossierTypes, setDossierTypes] = useState([]);

    useEffect(() => {
        if (user) {
            saveLoginToStorage(user.mail);
        } else {
            let userFromStorage = localStorage.getItem(KEY);
            if(userFromStorage !== null)setUser({mail: userFromStorage});
        }
    }, [user]);

    const getData = async() => {

        if(user.loggedIn)
        {
            getDossierTypes()
            getDossiers();
        }
    }

    const getDossiers = async() => {
        const response = await fetch(`http://localhost:${PORT}/dossiers`)
        const newData = JSON.parse(await decrypt(await response.json()));
        newData.forEach(async (singleData) => {
            if(globalData.filter((el) =>{return el.id === singleData.id;}).length === 0) 
            {
                singleData["Verloop start"] = singleData["Verloop start"] ? noramliseDate(new Date(singleData["Verloop start"])) : ''
                singleData["Verloop stop"] = singleData["Verloop stop"] ? noramliseDate(new Date(singleData["Verloop stop"])) : ''
                singleData.Tijdlijn = JSON.parse(singleData.Tijdlijn);
                singleData.Type = JSON.parse(singleData.Type)
                singleData.Client = JSON.parse(singleData.Client)
                let dateInfo = await dateMinMax(singleData.Type)
                singleData.lowestDate = dateInfo.lowest > 5672527600000 || dateInfo.lowest <= 1 ? false : dateInfo.lowest
                singleData.highestDate = dateInfo.highest > 5672527600000 || dateInfo.highest <= 1 ? false : dateInfo.highest
                addDataToCollection(singleData)

            }
        });
    }

    const deleteDossierTypes = async id => {
        const encId = await encrypt(id)

        const response = await fetch(`http://localhost:${PORT}/dossiertypes/321`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({toDelete: encId})
            })
            .then(async value => await value.json())
            .then(async value => await decrypt(value.res));

        if(response === "Dossier type was deleted!") {
            const projectIndex = dossierTypes.findIndex(p => p.id.toString() === id.toString());
            dossierTypes.splice(projectIndex, 1);
            setDossierTypes([...dossierTypes])
            return true;
        }
        
    }

    const deleteDossier = async id => {
        const encId = await encrypt(id)

        const response = await fetch(`http://localhost:${PORT}/dossiers/321`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({toDelete: encId})
            })
            .then(async value => await value.json())
            .then(async value => await decrypt(value.res));

        if(response === "Dossier was deleted!") {
            const projectIndex = globalData.findIndex(p => p.id.toString() === id.toString());
            globalData.splice(projectIndex, 1);
            setGlobalData([...globalData])
            return true;
        } else return false
        
    }

    const getDossierTypes = async() => {
        const response = await fetch(`http://localhost:${PORT}/dossiertypes`)
        const newData = JSON.parse(await decrypt(await response.json()));

        newData.forEach((singleData) => {
      
            if(dossierTypes.filter((el) =>{return el.id === singleData.id;}).length === 0) 
            {
                addDossierTypesToCollection(singleData)
            }
        });
    }

    const noramliseDate = (date) => {
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();

    }

    const postData = async (object) => {
   
        try {
                const response = fetch(`http://localhost:${PORT}/dossiers`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data: await encrypt(JSON.stringify(object))})
            })


            const result = await response
                .then(async value => await value.json())
                .then(async value => await decrypt(value))
                .then(async value => await JSON.parse(value));
            
            if(result.id) {
                let newObject = object;
                newObject.id = result.id;
                newObject["Verloop start"] = noramliseDate(new Date(newObject["Verloop start"]))
                newObject["Verloop stop"] = noramliseDate(new Date(newObject["Verloop stop"]))
                newObject.Tijdlijn = JSON.parse(newObject.Tijdlijn);
                newObject.Type = JSON.parse(newObject.Type)
                newObject.Client = JSON.parse(newObject.Client)
                const dateInfo = await dateMinMax(newObject.Type)
                newObject.lowestDate = dateInfo.lowest
                newObject.highestDate = dateInfo.highest
                addDataToCollection(newObject)
                //globalData.push(newObject);
                return true
            }
            else alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${result}`)

        }catch (err) {
            alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
            return false;
        }
        
    }

    const postDostypeData = async (object) => {
   
        try {
            const response = fetch(`http://localhost:${PORT}/dossiertypes`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( {data : await encrypt(JSON.stringify(object))})
            })

            
            const result = await response
                .then(async value => await value.json())
                .then(async value => await decrypt(value))
                .then(async value => await JSON.parse(value));

            if(result.id) {
                addDossierTypesToCollection(result);
                return result
            }
            else return result
        }catch (err) {
            alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
            return false;
        }
        
    }

    const updateData = async (object) => {
        try {
            const response = fetch(`http://localhost:${PORT}/dossiers/${object.id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data: await encrypt(JSON.stringify(object))})
        })

        const result = await response
            .then(async value => await value.json())
            .then(async value => await decrypt(value))
            .then(async value => await JSON.parse(value));
            
        if(result.id) {
            let newObject = object;
            newObject.id = result.id;
            newObject["Verloop start"] = noramliseDate(new Date(newObject["Verloop start"]))
            newObject["Verloop stop"] = noramliseDate(new Date(newObject["Verloop stop"]))
            newObject.Tijdlijn = JSON.parse(newObject.Tijdlijn);
            newObject.Type = JSON.parse(newObject.Type)
            newObject.Client = JSON.parse(newObject.Client)
            const dateInfo = await dateMinMax(newObject.Type)
            newObject.lowestDate = dateInfo.lowest
            newObject.highestDate = dateInfo.highest
            addDataToCollection(newObject)
            return true
        }
        else alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${result}`)
    }catch (err) {
        alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
        return false;
    }
        
    }

    const handleLogout = () => {
        setUser(false);
        localStorage.removeItem(KEY)
    };

    const resetPassword = async (resetData) => {
        const randomLength = Math.floor(Math.random()*resetData.salt.length);
        resetData.secondSalt = randomLength;
        resetData.password = JSON.stringify(SHA256(`${resetData.salt.substring(0, randomLength)}${resetData.password}${resetData.salt.substring(randomLength)}`))

        try {
            const response = fetch(`http://localhost:${PORT}/resetPW`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( {data : await encrypt(JSON.stringify(resetData))})
            })

            
            const result = await response
                .then(async value => await value.json())
                .then(async value => await decrypt(value))
                .then(async value => await JSON.parse(value));
            if(result.id) {
                return {state: true, message: "Het wachtwoord is veranderd."}
            }
            else return {state: false, message: "Er was een probleem met het aanpassen van de gebruiker, controlleer of het e-mail adres correct is."}
        }catch (err) {
            alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
            return false;
        }
    }

    const createLogin = async (loginData) => {
        const randomLength = Math.floor(Math.random()*loginData.salt.length);
        loginData.secondSalt = randomLength;
        loginData.password = JSON.stringify(SHA256(`${loginData.salt.substring(0, randomLength)}${loginData.password}${loginData.salt.substring(randomLength)}`))

        try {
            const response = fetch(`http://localhost:${PORT}/users`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( {data : await encrypt(JSON.stringify(loginData))})
            })

            
            const result = await response
                .then(async value => await value.json())
                .then(async value => await decrypt(value))
                .then(async value => await JSON.parse(value));
            if(result.id) {
                return {state: true, message: "De gebruiker is aangemaakt"}
            }
            else if(result === "duplicate key value violates unique constraint \"uniquemail\"") return {state: false, message: "Dit mail adres is al in gebruik"}
            else return {state: false, message: "Er was een probleem met het aanmaken van de gebruiker"}
        }catch (err) {
            alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
            return false;
        }
    }

    const handleLogin = async (user) => {

        try {
            const response = fetch(`http://localhost:${PORT}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( {data : await encrypt(JSON.stringify({mail: user.mail}))})
            })

            const result = await response
                .then(async value => await value.json())
                .then(async value => await decrypt(value))
                .then(async value => await JSON.parse(value))
                .then(async value => {
                    if(value.salt) {
                        user.password = JSON.stringify(SHA256(`${value.salt.substring(0, parseInt(value.secondSalt))}${user.password}${value.salt.substring(parseInt(value.secondSalt))}`))
                        if(value.password === user.password) {
                            getData();
                            setUser({
                                mail: value.mail,
                                username: value.username,
                                role: value.role,
                                id: value.id,
                                loggedIn: true
                            })

                            saveLoginToStorage(user.mail);
                            return true
                        }else return false

                    } else return false

                });
            return result
        }catch (err) {
            alert(`Er is een fout opgetreden. Gelieve de onderstaande code door te geven aan de ICT Administrator \n \r ${err}`)
            return false;
        }

    };

    const getLogin = () => {return user;}

    const addDataToCollection = (data) => {
            const exists = globalData.filter(dossier => dossier.id === data.id)
            if(exists.length > 0) {
                const index = globalData.indexOf(exists[0])
                globalData[index] = data;
                setGlobalData(globalData)
            }
            else {
                globalData.push(data);
                setGlobalData(globalData)
            }
    }

    const addDossierTypesToCollection = (data) => {
            dossierTypes.push(data);
            setDossierTypes(dossierTypes)
    }

    const encrypt = async (data) => {
        if(typeof data !== "string") data = data.toString()
        const msg = await AES.encrypt(data, secrcet).toString();
        return msg
    }
      
    const decrypt = async (data) => {
      var bytes  = await AES.decrypt(data, secrcet);
      return await bytes.toString(enc.Utf8);
    }

    const dateMinMax = (data) => {
        let valueRange = Object.values(data).flat().reduce((acc, item) => {
            const values = Object.values(item).filter(value => !isNaN(parseInt(value)) && typeof value !== "boolean");
          
            if (values.length > 0) {
              const lowest = Math.min(...values);
              const highest = Math.max(...values);
          
              if (lowest < acc.lowest) {
                acc.lowest = lowest;
              }
          
              if (highest > acc.highest) {
                acc.highest = highest;
              }
            }
          
            return acc;
          }, { lowest: Number.MAX_VALUE, highest: Number.MIN_VALUE });
          return valueRange;
    }

    return (
        <RootStore.Provider
            value={{ 
                user,
                login: handleLogin, 
                logout: handleLogout, 
                getLogin: getLogin,
                activePage,
                setActivePage,
                globalData,
                addDataToCollection,
                getData,
                postData,
                updateData,
                postDostypeData,
                dossierTypes,
                dateMinMax,
                deleteDossierTypes,
                deleteDossier,
                createLogin,
                resetPassword
            }}>
            {children}
        </RootStore.Provider>
    );


};

export const useRootContext = () => {
    return useContext(RootStore);
};


export default RootStoreProvider;