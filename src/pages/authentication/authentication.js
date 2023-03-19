import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ROUTES } from '../../consts/routes';
import Home from '../home/home';
import style from "./authentication.module.css";
import Login from "../login/login";
import { useRootContext } from "../../contexts/RootStoreProvider";
import AddEdit from "../addEdit/addEdit";
import Detail from "../detail/detail";
import Manage from "../manage/manage";
import { useEffect, useState } from "react";
import Admin from "../admin/admin";

const Authentication = () => {

    const { user, activePage, setActivePage, logout, getData } = useRootContext();
   const [firstBoot, setFirstBoot] = useState(false);


   useEffect(() => {
    if(!firstBoot && user.loggedIn){
        getData();
        setFirstBoot(true)}
   })

    return (
        <div className={`${style.wrap}`}>
            <Router>

                

                <nav className={style.navList}>
                    <div className={style.login}>

                        <div className={style.logo}></div>

                        
                        {user.loggedIn ?
                            <div className={style.logoutWrap}>
                                <p onClick={logout} className={style.button}>&#9212;</p>
                                <p>{user.username}</p>
                            </div>
                            : ''}
                    </div>

                    <ul className={style.navList__items}>
                        <li><Link className={activePage === "Home" ? style.activePage : ''} to={ROUTES.home} onClick={e => setActivePage("Home")}>Overzicht</Link></li>
                        <li><Link className={activePage === "CRUD" ? style.activePage : ''} to={`${ROUTES.addEdit.to}add/NA`} onClick={e => setActivePage("CRUD")}>Toevoegen</Link></li>
                        <li><Link  className={activePage === "beheer" ? style.activePage : ''} to={ROUTES.manage} onClick={e => setActivePage("beheer")}>Beheer</Link></li>

                        {user.role === 'admin' ? 
                            <li><Link  className={activePage === "admin" ? style.activePage : ''} to={ROUTES.admin} onClick={e => setActivePage("admin")}>Administratie</Link></li> : ''}
                    
                    </ul>

                </nav>

                <Routes>
                    {!user.loggedIn ?
                        <Route path="*" element={<Login />} /> :
                        <>
                            <Route path={ROUTES.home} element={<Home/>}></Route>
                            <Route path={ROUTES.detail.path} element={<Detail />}></Route>
                            <Route path={ROUTES.addEdit.path} element={<AddEdit />}> </Route>
                            <Route path={ROUTES.manage} element={<Manage />}> </Route>
                            
                            {user.role === 'admin' ? 
                                <Route path={ROUTES.admin} element={<Admin />}> </Route>
                                :
                                ''
                            }
                            
                            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
                        </>
                    }
                </Routes>
            </Router>

        </div>
    );
};

export default Authentication;