import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = ()=>{
    const{state,dispatch} = useContext(UserContext)
    
    const[userProfile,setProfile] = useState(null)
    const {userid} = useParams()
    const[showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    
    useEffect (()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
          
            
          setProfile(result)
        })
    },[])
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                followId : userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers : data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user : {...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                        }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                unfollowId : userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers : data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!= data._id)
                return{
                    ...prevState,
                    user : {...prevState.user,
                        followers:newFollower
                        }
                }
            })
          setShowFollow(true)
        })
    }
    return(
        <>
        {userProfile ?  <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={userProfile.user.pic}/>
                    <br>
                    </br>
                    {showfollow?<button className = "btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>followUser()} style={{left:"40px"}}>Follow</button> 
                    : <button className = "btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>unfollowUser()} style={{left:"40px"}}>UnFollow</button>}
                    
                    <br></br>
                    <br></br>
                    

               </div>
               <div>
                    <h4>{userProfile.user.name}</h4>
                    <h4>{userProfile.user.email}</h4>
                    <div style={{display:"flex",justifyContent:"space-between" , width:"108%"}}>
                        <h5>{userProfile.posts.length} posts</h5>
                        <h5>{userProfile.user.followers.length} followers</h5>
                        <h5>{userProfile.user.following.length} following</h5>
                        
                    </div>
               </div>
           </div>
       { <div className="gallery">
           {
               userProfile.posts.map(item=>{
                   return ( <img className="item"src={item.photo} alt={item.title} key={item._id}/>)
               })
           }
       </div> }
       </div>: <h2>Loading...</h2>}
      
       </>
    )
}

export default Profile