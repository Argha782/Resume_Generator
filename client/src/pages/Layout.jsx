import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader.jsx'
import Login from '../pages/Login.jsx'

function Layout() {
    const {user, loading}=useSelector(state=> state.auth)

    if(loading){
        return <Loader/>
    }
    return (
        <div>
            {
                user ? (<div className='min-h-screen bg-gray-50f'>
                <Navbar/>
                <Outlet/>
            </div>) : <Login/>
            }
        </div>
    )
}

export default Layout
