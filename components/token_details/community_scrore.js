import React, { useState, useEffect, useRef } from 'react'
import { API_BASE_URL, config, separator, getURLWebsiteName, getShortWalletAddress, createValidURL, app_coinpedia_url, market_coinpedia_url, IMAGE_BASE_URL, roundNumericValue, volume_time_list } from '../constants'
import { tokenBasic, otherDetails, volume24Hrs, getHighLow24h, sevenDaysDetails } from '../search_contract_address/live_price'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

import LoginModal from '../../components/layouts/auth/loginModal'

import { Tooltip, OverlayTrigger, ProgressBar } from 'react-bootstrap'

export default function MyFunction({ reqData }) {
  const { total_voting_count, positive_voting_counts, parent_user_token, token_row_id ,request_config, my_voting_status} = reqData

  const [login_modal_status, set_login_modal_status] = useState(false)

  const [action_row_id, set_action_row_id] = useState("")
  const [action_type, set_action_type] = useState("")
  const [user_token, set_user_token] = useState(parent_user_token)
  const [my_vote_status, set_my_vote_status] = useState(my_voting_status ? my_voting_status:0)
  const [total_vote_count, set_total_vote_count] = useState(total_voting_count ? total_voting_count:0)
  const [positive_vote_count, set_positive_vote_count] = useState(positive_voting_counts ? positive_voting_counts:0)
  

  
  const loginModalStatus = async (pass_id, pass_type) => 
  {
    await set_login_modal_status(false)
    await set_login_modal_status(true)
    await set_action_row_id(pass_id)
    await set_action_type(pass_type)
  }

  const getDataFromChild = async (pass_object) => 
  {
    // console.log("pass_object", pass_object)
    await set_login_modal_status(false)
    await set_user_token(JsCookie.get("user_token"))
    await updateVotingDetails(action_type)
  }

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  //voting_status 1: positive, 2:negative
  const updateVotingDetails = async (param) => 
  {
    if(my_vote_status != param)
    {
        const update_obj = {
          token_row_id,
          voting_status:param
        }
        const res = await Axios.post(API_BASE_URL + "markets/cryptocurrency/update_voting_details", update_obj , config(JsCookie.get("user_token")))
        if(res.data.status) 
        {
          await set_my_vote_status(param)
          set_total_vote_count(res.data.total_vote_count)
          set_positive_vote_count(res.data.positive_vote_count)
          // await setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message })
        }
    }
  }


  
  
  // const [total_voting_count, set_total_voting_count] = useState("") 
  // const [positive_voting_counts, set_positive_voting_counts] = useState("") 

  // const [user_token, set_user_token] = useState(userAgent.user_token ? userAgent.user_token : "");

  // console.log("Community Score", reqData)

  useEffect(() => 
  {
  }, [])


  return (
    <div>
      <section className='community-trust mt-5'>
        <h5 className='sub_title_main'>
          Community Trust
          <span>
            <OverlayTrigger
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => (
                <Tooltip {...props} className="custom_pophover">
                  <p>This bar represents the trust of the Coinpedia community in this token. Each member has one vote per token, and they can modify their trust accordingly.</p>
                </Tooltip>
              )}
              placement="bottom">
              <span className='info_col' > <img src="/assets/img/information_token.svg" alt="Info" />
              
              </span>
            </OverlayTrigger>

          </span> &nbsp;:
        </h5>
        <div className='community_block_data'>
        <div className='row'>

          <div className='col-3 text-center'>

                <span className='like_text_color like_dislike_text'>
                            { total_vote_count ?((positive_vote_count/total_vote_count) * 100).toFixed(1):"0.00"}%
                         
                          {
                my_vote_status != 2 ?
                <OverlayTrigger
                delay={{ hide: 450, show: 300 }}
                overlay={(props) => (
                  <Tooltip {...props} className="custom_pophover">
                    <p>
                      {
                        user_token ?
                        <>
                        {
                          (my_vote_status == 1) ?
                          <>You trust this token </>
                          :
                          (my_vote_status == 2) ?
                          <></>
                          :
                          <>Trust in this token</>
                        }
                        </>
                        :
                        <>
                       Sign in to trust this token.
                        </>
                      }
                    </p>
                  </Tooltip>
                )}
                placement="bottom">
                {
                  user_token ?
                  <span onClick={()=>updateVotingDetails(1)}> <img src="/assets/img/like.svg" alt="like" /></span>
                  :
                  <span onClick={() => loginModalStatus(token_row_id, 1)}> <img src="/assets/img/like.svg" alt="like" /></span>
                } 
                </OverlayTrigger>
                :
                 <span onClick={()=>updateVotingDetails(1)}> <img src="/assets/img/like.svg" alt="like" /></span>
              }
                          </span>
              

          </div>
          <div className='col-6'>
            <h5 className='converter-title text-center'>{total_vote_count} Votes  </h5>
            <div className="progress gainer-progress">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: ((positive_vote_count/total_vote_count) * 100) + "%" }}
              >
                {/* {e.total_voting_count} Gainers */}
              </div>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: ((((total_vote_count-positive_vote_count)/total_vote_count))* 100) + "%" }}
              >
                {/* {e.total_tokens-e.total_gainers} Losers */}
              </div>
            </div>
          </div>
          <div className='col-3 text-center'>
            <span className='dislike_text_color like_dislike_text'>
            {
              my_vote_status != 1 ?
                <OverlayTrigger delay={{ hide: 450, show: 300 }}  overlay={(props) => (
                  <Tooltip {...props} className="custom_pophover" >
                    <p>
                      {
                        user_token ?
                        <>
                        {
                          (my_vote_status == 1) ?
                          <></>
                          :
                          (my_vote_status == 2) ?
                          <>You don't trust this token</>
                          :
                          <>Do not trust in this token</>
                        }
                        </>
                        :
                        <>
                        Sign in to untrust this token.
                        </>
                      }
                    </p>
                  </Tooltip>
                )}
                placement="bottom">
                {
                  user_token ?
                  <span className={(my_vote_status == 2 ? " community-bigger":" community-smaller")} onClick={()=>updateVotingDetails(2)}>  <img src="/assets/img/dislike.svg" alt="like" /></span>
                  :
                  <span onClick={() => loginModalStatus(token_row_id, 2)}>  <img src="/assets/img/dislike.svg" alt="like" /></span>
                } 
              </OverlayTrigger>
              :
              <span className={(my_vote_status == 2 ? " community-bigger":" community-smaller")} onClick={()=>updateVotingDetails(2)}>  <img src="/assets/img/dislike.svg" alt="like" /></span> 
            }
            {total_vote_count ? ((((total_vote_count-positive_vote_count)/total_vote_count))* 100).toFixed(1):"0.00"}% 
            </span>
          </div>
          {/* <div className='col-2'></div> */}
        </div>
        </div>
      </section>

      {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
    </div>
  )
}
