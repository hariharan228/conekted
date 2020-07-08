import React,{useContext,useState}from 'react'
import {UserContext} from '../../App'
import "../../../src/App.css"
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const SignIn = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const PostData = ()=> {
        if(!/^(([^&lt;&gt;()\[\]\\.,;:\s@"]+(\.[^&lt;&gt;()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                
                password,
                email

            })
        }).then(res=>res.json()).then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Logged in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    
    }
    
    return(
    <div className="mycard">
        <div className="card input-field " style={{padding:"20px", textAlign:"center",maxWidth:"400px",margin: "10px auto"}}>
            <h2>Conekted</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type ="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
            <button className = "btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>PostData()}>Login</button>
            <h5>
                <Link to="/signup">Dont have an account ?</Link>
            </h5>
       </div>
    </div>
    )
}

export default SignIn