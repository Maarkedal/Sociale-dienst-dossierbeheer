import { useRootContext } from "../../contexts/RootStoreProvider";
import { globalDataInterface } from "../../interfaces/interface";
import style from "./testpage.module.css";

const Testpage = () => {

    const {globalData, addDataToCollection} = useRootContext();

    const getData = async() => {
        const response = await fetch("http://localhost:4999/sdstructuur")
        const newData = await response.json();
        if(globalData.filter((el) =>{return el.id === newData[0].id;}).length === 0) addDataToCollection(newData[0])
    }


    return (
        <main className={style.main}>
            <h1 onClick={getData}>test4</h1>
            <h1 onClick={getData}>Get data</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro earum eos incidunt, facilis quas autem maxime, esse dignissimos maiores laboriosam minima itaque eveniet rem soluta non dicta unde! Fugit, perferendis!</p>
        </main>
    );
};

export default Testpage;
