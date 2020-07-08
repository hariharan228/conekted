import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = ()=>{
    const{state,dispatch} = useContext(UserContext)
    const[mypics,setPics] = useState([])
    const [image,setImage] = useState("")
    
    
    useEffect (()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            setPics(result.mypost)

        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","instaclone")
            data.append("cloud_name","hariinstaclone")
            fetch("https://api.cloudinary.com/v1_1/hariinstaclone/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(data=>{
                
               //
                //
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json()).then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
                console.log(err)
            })
        
        }
    },[image])
const updatePhoto = (file)=>{
    setImage(file)
  }
    
    return(
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state?state.pic:"Loading..."}/>
                    

                    

               </div>
               <div class="tooltip">
                    
                    <label for="file-input">
                        <i id="add" class="material-icons" style={{width:"40px",height:"40px"}} >add_circle</i>
                        <span class="tooltiptext">Update profile picture</span>
                    </label>

                     <input id="file-input" style={{display: "none"}} onChange={(e)=>updatePhoto(e.target.files[0])} type="file"/>
                </div>  
               
               
               <div>
               
                    <h4>{state?state.name:"Loading ..."}</h4>
                    <h5>{state?state.email:"Loading ..."}</h5>
                    <div style={{display:"flex",justifyContent:"space-between" , width:"108%"}}>
                        <h5>{mypics?mypics.length:"Loading...."} posts</h5> 
                        <h5>{state?state.followers.length:"Loading ..."} followers</h5>
                        <h5>{state?state.following.length:"Loading ..."} following</h5>   
                    </div>
                   
               </div>
           </div>
       <div className="gallery">
           {
               mypics.map(item=>{
                   return ( <img className="item"src={item.photo} alt={item.title} key={item._id}/>)
               })
           }
       </div>
       </div>
    )
}

export default Profile