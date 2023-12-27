import React,{useState,useEffect} from 'react';  



export default function Popupmodal(props){ 
    const {icon, title , content } = props.name  
    const [showmodal, setShowModal] = useState(true) 
    return(   
     
      <div className="popup_modal_for_all modal" style={ showmodal ? { display: 'block' } : { display: 'none' }} id="myModal">
       
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body" style={{padding:"30px"}}>
              <button type="button" className="close" onClick={()=> setShowModal(!showmodal)} data-dismiss="modal"><span><img src="/assets/img/close_icon.svg"  alt = " Close"  /></span></button>
              <div className="text-center">
                <div className="">{icon ? <img className="prop_modal_img" alt="icon" src={icon} /> : null}</div>
                <h3 className="modal_title">{title}</h3>
                { content ? <h5 className="">{content}</h5>  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

