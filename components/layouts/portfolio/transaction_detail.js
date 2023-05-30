/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import moment from 'moment'
import dynamic from 'next/dynamic' 
import { USDFormatValue,getZeroAppendValues, roundNumericValue, getNetworkImageNameByID, getNetworkNameByID, getValueShortForm, setActiveNetworksArray, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,graphqlPricingTokenData, getSevenDaysValues} from '../../../components/config/helper'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import {getShortWalletAddress} from '../../../components/constants'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function TransactionDetail({transaction}) 
{   
    const [line_graph_values, set_line_graph_values] = useState([])
    const [line_graph_days, set_line_graph_days] = useState([])
    const [copy_hash_address, set_copy_hash_address]=useState("")

    const [showTooltip1, setShowTooltip1] = useState(false);
    const [showTooltip2, setShowTooltip2] = useState(false);
    const [showTooltip3, setShowTooltip3] = useState(false);

    const tooltip1 = <Tooltip arrowOffsetTop={20} id="button-tooltip">Copied!</Tooltip>;
    const tooltip2 = <Tooltip id="button-tooltip">Copied!</Tooltip>;
    const tooltip3 = <Tooltip id="button-tooltip">Copied!</Tooltip>;
  
    useEffect( ()=>
    {
      
    },[]) 

    const copyAddress=(pass_address, param)=>
    {
      if(parseInt(param) === 1)
      {
        setShowTooltip1(true)
      }
      else if(parseInt(param) === 2)
      {
        setShowTooltip2(true)
      }
      else
      {
        setShowTooltip3(true)
      }

      var copyText = document.createElement("input")
      copyText.value = pass_address
      document.body.appendChild(copyText)
      copyText.select()
      document.execCommand("Copy")
      copyText.remove()
      if(parseInt(param) === 1)
      {
        setTimeout(() => setShowTooltip1(false), 3000)
      }
      else if(parseInt(param) === 2)
      {
        setTimeout(() => setShowTooltip2(false), 3000)
      }
      else
      {
        setTimeout(() => setShowTooltip3(false), 3000)
      }
    }

    return(
    <>
        <table className='table token-details-table'>
          <tbody>
            <tr>
              <td><label className='token-type-name'>Transaction Hash</label></td>
              <td className='token-value-details'>
                <div className="media mb-0">
                <div className='media-body align-self-center'>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 200, hide: 200 }}
                  overlay={tooltip1}
                  arrowOffsetTop={20}
                  show={showTooltip1}>
                    <span onClick={()=>copyAddress(transaction.hash, 1)}  >
                        <img src="/assets/img/copy_img.svg" className='ml-2' style={{width:"auto"}}/>
                    </span>
                  </OverlayTrigger> &nbsp;
                 
                  <a className="txn-hash-link" 
                    href={(
                      (transaction.txnType == 1) || (transaction.txnType == 2) ? 
                      "https://etherscan.io/tx/"
                      :
                      (transaction.txnType == 3) || (transaction.txnType == 4) ? 
                      "https://bscscan.com/tx/"
                      :
                      (transaction.txnType == 5) || (transaction.txnType == 6) ? 
                      "https://ftmscan.com/tx/"
                      :
                      (transaction.txnType == 7) || (transaction.txnType == 8) ? 
                      "https://polygonscan.com/tx/"
                      :
                      ""
                      )+transaction.hash
                      } 
                    target="_blank">
                    {getShortWalletAddress(transaction.hash)}
                  </a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className='table token-details-table'>
          <tbody>
            <tr>
              <td><label className='token-type-name'>N/w</label></td>
              <td className='token-value-details'> {
                (transaction.txnType == 1) || (transaction.txnType == 2) ?
                <>
                <img className="txn-netwok" src="/assets/img/portfolio/eth.svg" alt="Token" title="Token" />        
                </>
                :
                (transaction.txnType == 3) || (transaction.txnType == 4) ?
                <>
                <img className="txn-netwok" src="/assets/img/portfolio/bsc.svg" alt="Token" title="Token" /> 
                </>
                    :
                (transaction.txnType == 5) || (transaction.txnType == 6) ?
                <>
                <img className="txn-netwok" src="assets/img/portfolio/ftm.svg" alt="Token" title="Token" />
                </>
                :
                (transaction.txnType == 7) || (transaction.txnType == 8) ?
                <>
                <img className="txn-netwok" src="/assets/img/portfolio/polygon.svg" alt="Token" title="Token" />
                </>
                :
                <>
                </>
              }</td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Date</label></td>
                <td className='token-value-details'> 
                  {moment(transaction.timeStamp*1000).format("DD MMM YYYY")} &nbsp;
                  {moment(transaction.timeStamp*1000).format("h:mma")}
                </td>
            </tr> 

            <tr>
              <td><label className='token-type-name'>Value</label></td>
                <td className='token-value-details'> {parseFloat((transaction.value/getZeroAppendValues(transaction.tokenDecimal)).toFixed(4))}&nbsp;{
                  transaction.txnType == 1 ?
                  <>
                  ETH              
                  </>
                  :
                  transaction.txnType == 2 ?
                  <>
                  {transaction.tokenSymbol}
                  </>
                  :
                  transaction.txnType == 3 ?
                  <>
                  BNB
                  </>
                  :
                  transaction.txnType == 4 ?
                  <>
                  {transaction.tokenSymbol}
                  </>
                  :
                  transaction.txnType == 5 ?
                  <>
                  MATIC
                  </>
                  :
                  transaction.txnType == 6 ?
                  <>
                  {transaction.tokenSymbol}
                  </>
                  :
                  transaction.txnType == 7 ?
                  <>
                  FTM
                  </>
                  :
                  transaction.txnType == 8 ?
                  <>
                  {transaction.tokenSymbol}
                  </>
                  :
                  <>
                  </>
              }</td>
            </tr> 

            <tr>
              <td><label className='token-type-name'>From</label></td>
              <td className='token-value-details'> 
              <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 200, hide: 200 }}
                  overlay={tooltip2}
                  show={showTooltip2}>
                    <span onClick={()=>copyAddress(transaction.from, 2)} >
                    <img src="/assets/img/copy_img.svg" className='ml-2' />  
                </span></OverlayTrigger> &nbsp;
                {getShortWalletAddress(transaction.from)}
              </td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Interacted With (To)</label></td>
              <td className='token-value-details'> 
              <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 200, hide: 200 }}
                  overlay={tooltip3}
                  show={showTooltip3}>
                    <span onClick={()=>copyAddress(transaction.to, 3)} >
                    <img src="/assets/img/copy_img.svg" className='ml-2' />  
                </span></OverlayTrigger> &nbsp;
                {getShortWalletAddress(transaction.to)}
              </td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Gas</label></td>
              <td className='token-value-details'> {transaction.gas}</td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Gas Price</label></td>
              <td className='token-value-details'> {transaction.gasPrice}</td>
            </tr>

          </tbody>
        </table>


        </>
   )
}