import React, { useState, useEffect,useContext } from 'react'
import {UserContext} from '../../App'
import "./home.css"
import {Link} from 'react-router-dom'

const Home = () => {
  const {state,dispatch} = useContext(UserContext)
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setData(result.posts)
      })
  }, [])
  const likePost = (id) =>{
      fetch('/like',{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId:id
        })
      }).then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id == result._id){
            return result
          }else{
            return item
          }
        })
        setData(newData)
          }).catch(err=>{
            console.log(err)
          })
  }
  const unlikePost = (id) =>{
    fetch('/unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id == result._id){
          return result
        }else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err)
    })
}
const makeComment = (text,postId)=>{
  fetch('/comment',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId,
      text
    })
  }).then(res=>res.json()).then(result=>{
    
    const newData = data.map(item=>{
      if(item._id == result._id){
        return result
      }else{
        return item
      }
    })
    setData(newData)
  }).catch(err=>{
    console.log(err)
  })
}

const deletePost = (postId)=>{
      fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
          "Authorization" : "Bearer "+localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
          return item._id !== result._id
        })
        setData(newData)
      })

}
const deleteComment = (commentId)=>{
  fetch(`/deletecomment/${commentId}`,{
    method:"delete",
    headers:{
      "Authorization" : "Bearer "+localStorage.getItem("jwt")
    }
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    console.log("Deleted comment")
    const newData = data.filter(item=>{
      return item._id !== result._id
    })
    setData(newData)
  })

}

  return (
    <div className="home">
      {
        data.map(item => {
          console.log(item)
          return (



            
            <div className="card home-card" id="card" key={item._id}>
          
         
              <h5 style={{padding:"8px"}}><Link to={item.postedBy._id !== state._id?"/Profile/"+item.postedBy._id:"/Profile"}>{item.postedBy.name}</Link>{item.postedBy._id == state._id
              && <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>
              } </h5>
              

              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">
                               
                {
                item.likes.includes(state._id)
                ?
                <i className="material-icons" style={{color:"#ff3d00 deep-orange accent-3"}} onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                :
                <i className="material-icons" style={{background:"#00e676 green accent-3"}} onClick={()=>{likePost(item._id)}}>thumb_up</i>
                }
               
               <h6>
                 {
                   item.likes.length==1
                   ?
                    item.likes.length + " like":
                  item.likes.length + " likes"
                 }
                 </h6>
               <h6>{item.title}</h6>
                <p>{item.body}</p>
                <h4>Comments</h4>
                <hr></hr>
                
                {
                  item.comments.map(record=>{
                  return <div style={{display:"flex"}}>
                    <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name==record.postedBy.name && record.postedBy._id == state._id?"You":record.postedBy.name}</span>  {record.text==""?" ":record.text}
                    <Link to={record.postedBy._id !== state._id?record.postedBy._id :""}></Link>{record.postedBy._id == state._id && <i className="material-icons" style={{flex:"1"}} onClick={()=>deleteComment(record._id)}>delete</i>
              }</h6>
                    <h5 style={{padding:"8px",flex:"1"}} > </h5>
                    
                     
                   </div>  
                  
                  })
                  
                }
                <form onSubmit={(e)=>{
                  e.preventDefault()
                  makeComment(e.target[0].value,item._id)
                }}>
                <input type="text" placeholder="Add comment"></input>
                </form>
              </div>
            </div>
          )
        })
      }
      

    </div>
  )
}

export default Home