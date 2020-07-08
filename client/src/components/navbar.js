import React,{useContext} from 'react'
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'
import { Datepicker } from 'materialize-css'

const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = ()=>{
    if(state){
        return [

          <li><Link to="/Profile">Profile</Link></li>,
          <li><Link to="/create">Create post</Link></li>,
          <li><Link to="/myfollowerspost">Followed By You</Link></li>,
         
          <li>
             <button className = "btn #c62828 red darken-3" onClick={()=>{
               localStorage.clear()
               dispatch({type:"CLEAR"})
              history.push('/signin')
               }
               }>
            Logout</button>
          </li>
        ]
    }
    else
    {
        return [
          <li><Link to="/signup">Signup</Link></li>,
          <li><Link to="/signin">Login</Link></li>  
      ]
    }
  }
    return(
    <nav>
    <div className="nav-wrapper white">
      <Link to = {state?"/":"/signin"} className="brand-logo left">Conekted</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
    )
}

export default NavBar