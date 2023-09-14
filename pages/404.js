import React from 'react' 
import Link from 'next/link'

export default function Error() 
{
    return (
        <>
            <div className="error_page">
                <div className="container">
                    <div className="wrapper">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-5">
                                    <h3>404 - Page Not Found</h3>
                                    <p>It seems that you're lost in a perpetual black hole. Let us help guide you out and get you back home.</p>
                                    <div className="buttons"><Link href="/">HOME</Link></div>
                                </div>
                                <div className="col-md-7">
                                    <div className="error_img_block"><img src="/assets/img/error.png" width="100%" height="100%" alt="Error"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}