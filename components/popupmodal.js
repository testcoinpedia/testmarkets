import React,{useState,useEffect} from 'react';  



export default function Popupmodal(props){ 
    const {icon, title , content } = props.name  
    const [showmodal, setShowModal] = useState(true) 

   


    return(   
      // <div className='modal' style={showmodal ? { display: 'block' } : { display: 'none' }}>
      //     <div className="modal-dialog modal-sm modal_small">
      //     <div className="modal-content">
      //       <div className="modal-body"> 
      //         <button type="button" className="close" onClick={()=> setShowModal(!showmodal)} data-dismiss="modal">&times;</button>
      //         {icon ? <img src={icon} /> : null}
      //         {title ? <h4 className="modal-title">{title}</h4> : null}
      //         { content ? <h5 className="invalidcredential">{content}</h5>  : null}
      //       </div>
      //     </div>
      //   </div>   
      // </div>
      <div className="popup_modal_for_all modal" style={ showmodal ? { display: 'block' } : { display: 'none' }} id="myModal">
       
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" onClick={()=> setShowModal(!showmodal)} data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" /></span></button>
              <div className="text-center">
                <div className="">{icon ? <img className="prop_modal_img" src={icon} /> : null}</div>
                <h3 className="modal_title">{title}</h3>
                { content ? <h5 className="">{content}</h5>  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

