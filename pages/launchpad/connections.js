import React, { useEffect, useState } from 'react'; 
import Head from 'next/head';  
import cookie from "cookie"
import Axios from 'axios'
import Link from 'next/link'; 
import * as myConstClass from '../components/constants'
import Popupmodal from '../components/popupmodal'
import NavigationTab from '../components/tabs';

const connections=({config, userAgent})=> {
   
  
     
        const [api_url] = useState(myConstClass.api_url) 
        const [image_base_url] = useState(myConstClass.api_url+'uploads/profile/') 
        const [followers_list, set_followers_list] = useState([])
        const [following_list, set_following_list] = useState([])
        const [Follow_request_list, set_Follow_request_list] = useState([])
        const [confirm_request_status, set_confirm_request_status] = useState()
        const [user_token] = useState(userAgent.user_token)
        const [showNav, setShowNav] = useState(false) 
        const [modal_data, Setmodal_data] = useState({  icon: "", title: "", content:""})
        const [total_followers, set_total_followers] = useState()
        const [total_following, set_total_following] = useState()
        const [total_request, set_total_request] = useState()
        const [searchFollowers, setsearchFollowers] = useState("")
        const [followersList, setfollowersList] = useState([])
        const [filteredFollowers, setfilteredFollowers] = useState([])
        const [follower, setfollower] = useState([])
        const [followings, setfollowings] = useState([])
        const [followerequest, setfollowerequest] = useState([])
         const [Count, setCount] = useState(0)
        const [searchParam] = useState(["id", "user_name"])
        const [elements,set_elements]=useState([])
        const [unfollow_confirm,set_unfollow_confirm]=useState([])
        
        const conToStr=(value)=>
        {
          return (value === null) ? '': value 
        }
        
        useEffect(() => 
        {  
           followers()
           total()
           
        }, [])  
        
        
        
        const followers=()=>
        {
          
           Axios.get(api_url+"connections/followers_list/", config)
            .then(response => {   
                
              if(response.data.status === true)
              { 
                  // console.log(response.data.message)
                  //set_total_followers(response.data.message.length)
                  set_followers_list(response.data.message)
                  setfollowersList(response.data.message) 
                  setfilteredFollowers(response.data.message)
                  setElementsForCurrentPage(response.data.message, 0)
                
              } 
            })
        }
      
        const following=()=>
        {
          setsearchFollowers("")
           Axios.get(api_url+"connections/following_list/", config)
            .then(response => {   
                
              if(response.data.status === true)
              { 
                //  console.log(response.data.message)
                 //set_total_following(response.data.message.length)
                  set_following_list(response.data.message)
                  setfollowersList(response.data.message) 
                  setfilteredFollowers(response.data.message)
                  setElementsForCurrentPage(response.data.message, 0)
                
              } 
            })
        }

        const followRequest=()=>
        {
          setsearchFollowers("")
          setShowNav(false) 
           Axios.get(api_url+"connections/follow_requests_pending/", config)
            .then(response => {   
                
              if(response.data.status === true)
              { 
                  // console.log(response.data.message)
                  //set_total_request(response.data.message.length)
                  set_Follow_request_list(response.data.message)
                  setfollowersList(response.data.message) 
                  setfilteredFollowers(response.data.message)
                  setElementsForCurrentPage(response.data.message, 0)
                
              } 
            })
        }
        const total=()=>
        {
          
           Axios.get(api_url+"connections/connections_counts/", config)
            .then(response => {   
                
              if(response.data.status === true)
              { 
                  // console.log(response.data.message)
                  set_total_followers(response.data.message.total_followers)
                  set_total_following(response.data.message.total_following)
                  set_total_request(response.data.message.total_pending)
                 
              }
              else{
                setShowNav(true)
                Setmodal_data({icon: "/assets/img/close_error.png", title: "You have 0 Followers", content: response.data.message.alert_message})
                // console.log("")
              }
            })
        }


        const followUser=(id,reqI)=>
         {
           alert(id)
          var list = []
          var j=0
          for(const i of following_list)
          { 
             
      
            if(reqI == j)
            {
              if(reqI.account_visible_type==1)
              {
                alert("publi")
              list.push({confirm_request_status:2,id:i.id, full_name:i.full_name, profile_image:i.profile_image, user_name:i.user_name,work_position:i.work_position,company_name:i.company_name,follower_user_row_id:i.follower_user_row_id})
               }
              else
              {
                alert("private")
              list.push({confirm_request_status:1,id:i.id, full_name:i.full_name, profile_image:i.profile_image, user_name:i.user_name,work_position:i.work_position,company_name:i.company_name,follower_user_row_id:i.follower_user_row_id})
              }
          }
            else
            {
              list.push(i)
            }
            j++
          }
          // console.log(list)
          set_following_list(list)
            Axios.get(api_url+"connections/follow_user/"+id, config)
           .then(response => 
          {   
            // console.log(response)
              if(response.data.status === true)
              { 
              // console.log("Succesfully Followed")
              }
           })
      }
      const unfollowConfirm=(id,reqI)=>
  { 
       
         let e= <div className="remove_modal">
      <div className="modal" id="UnfollowConnection">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <img src="/assets/img/cancel.png" />
                <p>Do you really want to Unfollow this connection ?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => unfollowUser(id,reqI)} data-dismiss="modal">Unfollow </button>
            </div>

          </div>
        </div>
      </div> 
    </div>
   set_unfollow_confirm(e)
  
  }   

  const unfollowUser=(id, reqI)=>
  {   
    alert(id)
    var list = []
    var j=0
    for(const i of following_list)
    {  
      if(reqI == j)
      { 
        list.push({account_visible_type:i.account_visible_type,confirm_request_status:0,id:i.id, full_name:i.full_name, profile_image:i.profile_image, user_name:i.user_name,work_position:i.work_position,company_name:i.company_name,follower_user_row_id:i.follower_user_row_id})
      }
      else
      {
        list.push(i)
      }
      j++
    }
    // console.log(list)
    set_following_list(list)
      setShowNav(false)
      Axios.get(api_url+"connections/unfollow_user/"+id, config)
      .then(response => { 
        // console.log(response)
        if(response.data.tokenStatus === true){ 
            if(response.data.status === true)
            {  
              // console.log("Succesfully Unfollowed")
            }
        }
      })
  }

  const btnremove=(follower_user_row_id)=>
  { 
    // console.log(follower_user_row_id) 
      // let ele = followers_list.map((e,i)=>{
        
      //  if (e.id==follower_user_row_id)
      //   return <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      //   <div class="modal-dialog modal-dialog-centered" role="document">
      //   <div class="modal-content">
      //   <div class="modal-header">
      //   <div className="col-md-6 col-7">
      //   <div class="media">
      //   <img src={image_base_url+(conToStr(e.profile_image) ? e.profile_image :"default.png")} />
      //   <h6 class="modal-title1" id="exampleModalLongTitle">Remove Follower?</h6>
        
      //   </div>
      //   </div>
      //   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      //   <span aria-hidden="true">&times;</span>
      //   </button>
      //   </div>
      //   <div class="modal-body">
        
      //   <h6>Coinpedia won't tell {e.user_name} they were removed from your followers.</h6>
         
      //   </div>
      //   <div class="modal-footer">
      //   <button type="button" className="company_follow mt-2" onClick={()=> Remove(follower_user_row_id)} data-dismiss="modal">Remove</button>
      //   <button type="button" className="company_follow mt-2" data-dismiss="modal">Cancel</button>
       
      //  </div>
      //  </div>
      //  </div>
      //  </div>
      let ele= <div className="remove_modal">
      <div class="modal" id="removeConnection">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-body">
              <div className="text-center">
                <img src="/assets/img/cancel.png" />
                <p>Do you want to really remove this connection ?</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" onClick={() => Remove(follower_user_row_id)} data-dismiss="modal"> Remove </button>
            </div>

          </div>
        </div>
      </div> 
    </div>
  
      //  })
      set_elements(ele)
  }   
        
  const Remove=(follower_user_row_id)=>
  { 
        // console.log(follower_user_row_id)
      setShowNav(false) 
      Axios.get(api_url+"connections/remove_user_from_follower/"+follower_user_row_id, config)
      .then(response => { 
        if(response.data.tokenStatus === true){ 
            if(response.data.status === true)
            { 
              // console.log("Succesfully Removed")
              setShowNav(true)  
              followers()
              Setmodal_data({icon: "/assets/img/update-successful.png", title: " Removed ", content: response.data.message.alert_message})
            }
        }
        else{ 
          setShowNav(true)
          Setmodal_data({icon: "/assets/img/close_error.png", title: "OOPS! Something Went Wrong", content: response.data.message.alert_message})
          // console.log(error)
        } 
      })
  }    
    
  const Delete=(follower_user_row_id)=>
  { 
      setShowNav(false) 
      Axios.get(api_url+"connections/delete_follow_request/"+follower_user_row_id, config)
      .then(response => { 
        if(response.data.tokenStatus === true){ 
            if(response.data.status === true)
            { 
              // console.log("Succesfully Deleted")
              followRequest()
              setShowNav(true) 
              Setmodal_data({icon: "/assets/img/update-successful.png", title: "Deleted Successfully", content: response.data.message.alert_message})
            }
        }
        else{ 
          setShowNav(true)
          Setmodal_data({icon: "/assets/img/close_error.png", title: "OOPS! Something Went Wrong", content: response.data.message.alert_message})
          // console.log("")

        } 
      })
  }  
  const confirm=(follower_user_row_id)=>
  { 
      setShowNav(false) 
      Axios.get(api_url+"connections/confirm_request/"+follower_user_row_id, config)
      .then(response => { 
        if(response.data.tokenStatus === true){ 
            if(response.data.status === true)
            { 
              // console.log("Request Accepted Succesfully ")
              followRequest()
              setShowNav(true)  
              Setmodal_data({icon: "/assets/img/update-successful.png", title: "Request Accepted Successfully", content: response.data.message.alert_message})
              
              
            }
        }
        else{ 
          setShowNav(true)
          Setmodal_data({icon: "/assets/img/close_error.png", title: "OOPS! Something Went Wrong", content: response.data.message.alert_message})
          // console.log("")
        } 
      })
  }      
  const getSearchData=(searchValue) =>
   {
    
      setsearchFollowers(searchValue)
      if(searchValue != '')
      {  
         var followersListData = followersList
         const filteredFollowers =  followersListData.filter((item) => {
           return searchParam.some((newItem) => {
                return (
                    item[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(searchValue) > -1
                        
                )
            })
        })
         setfilteredFollowers(filteredFollowers)
        //  console.log(filteredFollowers)
         setElementsForCurrentPage(filteredFollowers, 0) 

       }
      else
      {
        setfilteredFollowers(followersList)
        setElementsForCurrentPage(followersList, 0) 
       
      }
   }
  
   const setElementsForCurrentPage=(items)=> 
   {   
            let follower = items.map((e)=>
            <div className="connections_elements">
              <div className="row">
                <div className="col-xl-5 col-lg-12 col-md-12">
                  <div class="media connections_media">
                    <Link  href={"/"+e.user_name} title="View Tickets">
                      <a target="_blank" >
                        <img className="mr-2" src={image_base_url+(conToStr(e.profile_image) ? e.profile_image :"default.png")} />
                      </a>
                    </Link>
                    <div class="media-body">
                      <h5 className="connection_name">{e.user_name}</h5>
                      <p> {e.work_position ? e.work_position : null} {e.work_position ? "at" :null} {e.company_name ? e.company_name : null}</p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-8 col-sm-8 col-8 connection_skills" >
                  <div className="profile_block_preview2">
                    <ul>
                      <li>Entrepreneur</li>
                      <li>Investor</li>
                      <li>Media &amp; PR</li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-sm-4 col-4 connection_remove_btn_block">
                <button type="button" className="company_follow connections_btns" data-toggle="modal" data-target="#removeConnection" onClick={() => btnremove(e.follower_user_row_id)} >
                  Remove
                </button> 
                   
                </div>
                {elements}
                              
                  </div>
                </div>
          )
         
      setfollower(follower)  
    
      let followings = items.map((e,i)=>
           <div className="connections_elements">
           <div className="row">
             <div className="col-xl-5 col-lg-12 col-md-12">
               <div class="media connections_media">
                 <Link  href={"/"+e.user_name} title="View Tickets">
                   <a target="_blank" >
                     <img className="mr-2" src={image_base_url+(conToStr(e.profile_image) ? e.profile_image :"default.png")} />
                   </a>
                 </Link>
                 <div class="media-body">
                   <h5 className="connection_name"> {e.user_name}</h5>
                   <p>{e.work_position ? e.work_position : null} {e.work_position ? "at" :null} {e.company_name ? e.company_name : null}</p>
                 </div>
               </div>
             </div>
             <div className="col-xl-5 col-lg-8 col-sm-8 col-8 connection_skills"  >
               <div className="profile_block_preview2">
                 <ul>
                   <li>Entrepreneur</li>
                   <li>Investor</li>
                   <li>Media &amp; PR</li>
                 </ul>
               </div>
             </div>
             <div className="col-xl-2 col-lg-4 col-sm-4 col-4 connection_remove_btn_block">
               {/* <button className="company_follow mt-2">Unfollow</button> */}
               {
                 user_token 
                 ?
                 parseInt(e.confirm_request_status) === 1
                 ?
                 <button className="company_follow" onClick={() => unfollowUser(e.id,i)}>Requested</button>
                 :
                   parseInt(e.confirm_request_status) === 0
                 ?
                 <button  className="company_follow connections_btns"  onClick={() => followUser(e.id,i)}>Follow</button>
                 :
                 <button  className="company_follow connections_btns"  data-toggle="modal" data-target="#UnfollowConnection" onClick={() => unfollowConfirm(e.id, i)}>Unfollow</button>
                 :
                 <Link href="/login"><a className="company_follow">Follow</a></Link>
               }
               
             </div>
           </div>
       </div>
      )
      setfollowings(followings) 
      

      let followerequest = items.map((e)=>
      <div className="connections_elements">
      <div className="row">
        <div className="col-xl-5 col-lg-12 col-md-12">
          <div class="media connections_media">
            <Link  href={"/"+e.user_name} title="View Tickets">
              <a target="_blank" >
                <img className="mr-2" src={image_base_url+(conToStr(e.profile_image) ? e.profile_image :"default.png")} />
              </a>
            </Link>
            <div class="media-body">
              <h5 className="connection_name">{e.user_name}</h5>
              <p> {e.work_position ? e.work_position : null} {e.work_position ? "at" :null} {e.company_name ? e.company_name : null}</p>
            </div>
          </div>
        </div>
        <div className="col-xl-5 col-lg-8 col-sm-8 col-8 connection_skills connections_spacing" >
          <div className="profile_block_preview2 ">
              <ul>
                <li>Entrepreneur</li>
                <li>Investor</li>
                <li>Media &amp; PR</li>
              </ul>
          </div>
        </div>
        <div className="col-xl-2 col-lg-4 col-sm-4 col-4  connections_spacing">
          <button type="submit" className="custom_connection_btn custom_connection_spacing" onClick={() => confirm(e.follower_user_row_id)} >Confirm</button>
          <button type="submit" className="custom_connection_btn" onClick={() => Delete(e.follower_user_row_id)} >Delete</button>
        </div>
      </div>
  </div>
      )
      setfollowerequest(followerequest) 
      
    } 

     
    
    return (
        <>
        <div>
            <Head>
                <title>Connections</title>
            </Head>
            {
             showNav 
             ?
             <Popupmodal name={modal_data} />
             :
             null
           }
          
            <div>
               <div className="container connections_modal">
                    <div className="col-md-12 header_title">
                        <h3>Connections</h3>
                        <p>Here you will get the list of followers, followings and Follow requests</p>
                    </div>
                    
                    <div className="padding_div_for_web"><NavigationTab /></div>
                    {/* ......bootstrap custom tabs starts here..... */}
                        <div className="col-md-12">
                            <div className="tab_block">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-one" role="tab" aria-controls="nav-home" aria-selected="true" onClick={()=> followers()}>
                                      {total_followers}  Followers
                                    </a>
                                    <a className="nav-item nav-link" id="nav-two-tab" data-toggle="tab" href="#nav-two" role="tab" aria-controls="nav-two" aria-selected="false" onClick={()=> following()}>
                                      {total_following} Following
                                    </a>
                                    <a className="nav-item nav-link" id="nav-three-tab" data-toggle="tab" href="#nav-three" role="tab" aria-controls="nav-three" aria-selected="false" onClick={()=> followRequest()}>
                                      {total_request}  Pending Requests
                                    </a>
                                </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-6">
                                
                              </div>
                              <div className="col-lg-6">
                                <div className="connections_search">
                                  <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text"><img src="/assets/img/new_search.png" /></span>
                                    </div>
                                    <input type="text" placeholder="Search by name"  value={searchFollowers} onChange={(e)=> getSearchData(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                   
                          <div className="col-md-12 tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-one" role="tabpanel" aria-labelledby="nav-one-tab">
                              
                           {
                              follower.length > 0 ?
                              follower
                              
                              :
                              <>
                              <div className="connections_elements no_data_found">
                                  Sorry, No followers found.
                                </div>
                              </>
                           }
                          </div>
                            <div className="tab-pane fade " id="nav-two" role="tabpanel" aria-labelledby="nav-two-tab">
                            {
                              followings.length > 0 ?
                              followings
                              
                              :
                              <>
                             <div className="connections_elements no_data_found">
                                  Sorry, No followings found.
                                </div>
                              </>
                            }
                           
                            </div>
                            
                            <div className="tab-pane fade " id="nav-three" role="tabpanel" aria-labelledby="nav-three-tab">
                            {
                              followerequest.length > 0 ?
                              followerequest
                              :
                              <>
                              <div className="connections_elements no_data_found">
                                  Sorry, No requests found.
                                </div>
                              </>
                           }
                           </div>
                        </div>
                    {/* ...bootstrap custom tabs ends here... */}
               </div>
            </div>
            {elements}
            {unfollow_confirm}
        </div>

        </>
    )
}
export async function getServerSideProps({query, req}) 
{
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    var user_token = userAgent.user_token ? userAgent.user_token:""
    
    const config = {
      headers : {
        "X-API-KEY": myConstClass.x_api_key,
        "token":user_token
      }
    }

    
    if(userAgent.user_token)
    {
      return {props: {userAgent:userAgent, config:config}}
    }
    else
    {
      return {
          redirect: {
            destination: 'login',
            permanent: false,
          }
      }
    }
}
export default connections