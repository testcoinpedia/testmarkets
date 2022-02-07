import React from 'react';     
import {website_url,app_coinpedia_url,coinpedia_url,logo,favicon} from '../components/constants'  


export default function Footer (){

   return(
      <>

      

      <footer id="footer" className="site-footer dark-skin dark-widgetized-area">
         <div id="footer-widgets-container">
            <div className="container">
               <div className="footer-widget-area ">
                  <div className="row">

                     <div className="col-md-4 normal-side">
                        <div className="container-wrapper footer_logo">
                           <img src={logo} alt="cp-logo" />
                        </div>
                        <ul className="social-icons">
                           <li className="social-icons-item">
                              <a className="social-link rss-social-icon" rel="external noopener nofollow" target="_blank" href="https://coinpedia.org/feed/">
                                 <img src="/assets/img/social-icons/rss.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link facebook-social-icon" rel="external noopener nofollow" target="_blank" href="https://www.facebook.com/Coinpedia.org/">
                              <img src="/assets/img/social-icons/facebook.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link twitter-social-icon" rel="external noopener nofollow" target="_blank" href="https://twitter.com/Coinpedianews">
                                 <img src="/assets/img/social-icons/twitter.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link pinterest-social-icon" rel="external noopener nofollow" target="_blank" href="https://pin.it/2Dwfamj">
                                 <img src="/assets/img/social-icons/pinterest.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link linkedin-social-icon" rel="external noopener nofollow" target="_blank" href="https://in.linkedin.com/company/coinpedia">
                                 <img src="/assets/img/social-icons/linkedin.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link reddit-social-icon" rel="external noopener nofollow" target="_blank" href="https://www.reddit.com/user/Coinpedia_news">
                                 <img src="/assets/img/social-icons/reddit.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link instagram-social-icon" rel="external noopener nofollow" target="_blank" href="https://www.instagram.com/coinpedianews/">
                                 <img src="/assets/img/social-icons/instagram.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link medium-social-icon" rel="external noopener nofollow" target="_blank" href="https://coinpedianews.medium.com/">
                                 <img src="/assets/img/social-icons/medium.svg" />
                              </a>
                           </li>
                           <li className="social-icons-item">
                              <a className="social-link telegram-social-icon" rel="external noopener nofollow" target="_blank" href="https://t.me/CoinpediaMarket">
                                 <img src="/assets/img/social-icons/telegram.svg" />
                              </a>
                           </li>
                        </ul>
                     </div>

                     <div className="col-md-4 normal-side">
                        <h5>Cp-Organization</h5>
                        <div id="author-bio-widget-4" className="container-wrapper widget aboutme-widget">
                           <div className="about-author about-content-wrapper">
                              <div className="aboutme-widget-content">Coinpedia - Trusted Crypto Agency for News, Information, Exchange, PR, Blockchain Events, Crypto Wallet and Else related to Decentralized World.
                           </div>
                           <div className="dcma_protected"><a href="//www.dmca.com/Protection/Status.aspx?ID=c32974f1-5754-4dc7-8646-ff88d4b0ee60" title="DMCA.com Protection Status" class="dmca-badge"> <img src ="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=c32974f1-5754-4dc7-8646-ff88d4b0ee60" alt="DMCA.com Protection Status" /></a> <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"> </script></div>
                           <div className="clearfix" />
                           </div>
                        <div className="clearfix" /></div>		
                     </div>

                     <div className="col-md-4 normal-side twitter_side">
                        <h5>Follow Us</h5>	

                        <div className="media">
                           <img src="/assets/img/twitter.svg" alt="twitter" />
                           <div className="media-body">
                              <p>The Fourth Quarter Could Turn Bearish This Time! Everything You Need to Know! #crypto #CryptoNews https://t.co/2UKS27UZnE</p>
                           </div>
                        </div>	
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="sticky_footer_menu">
            <ul>
               <li className="footer_menu_items"><a href="https://coinpedia.org/"><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180325/home.svg" /><span>Home</span></a></li>
               <li className="footer_menu_items"><a href="https://markets.coinpedia.org/"><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180327/market.svg" /><span>Market</span></a></li>
               <li className="center_fixed_menu_img"><div className="col-md-12"><img src={favicon} /></div></li>
               <li className="footer_menu_items"><a href="https://coinpedia.org/news/"><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180329/news.svg" /><span>News</span></a></li>
               <li className="footer_menu_items"><a href="https://app.coinpedia.org/"><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180331/portfolio.svg" /><span>Portfolio</span></a></li>
            </ul>
         </div>

         <div id="site-info" className="site-info site-info-layout-2 footer-bottom-bar">
            <div className="container">
               <div className="row">  
                  <div className="col-md-12">
                     <div className="copyright-text copyright-text-first">© Copyright 2022, All Rights Reserved &nbsp;|&nbsp; 
                        <img src="/assets/img/heart.svg" className="red_heart" /> 
                        <a href={coinpedia_url} target="_blank" rel="nofollow noopener">Coinpedia</a>
                     </div>  
                  
                     <div className="footer-menu">
                        <ul id="menu-footer-menu" className="menu">
                           <li id="menu-item-58566" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-58566"><a href={coinpedia_url+"about-coinpedia/"}>About Us</a></li>
                           <li id="menu-item-83639" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-83639"><a href={coinpedia_url+"advertising/"}>Advertise</a></li>
                           <li id="menu-item-83639" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-83639"><a href={website_url+"partners"}>Partners</a></li>
                           <li id="menu-item-58568" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-58568"><a href={coinpedia_url+"authors/"}>Authors</a></li> 
                           <li id="menu-item-58570" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-58570"><a href={coinpedia_url+"privacy-policy/"} >Privacy Policy</a></li>
                           <li id="menu-item-58571" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-58571"><a href={coinpedia_url+"terms-and-conditions/"}>Terms and Conditions</a></li>
                           <li id="menu-item-58565" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-58565"><a href={coinpedia_url+"editorial-policy/"} >Editorial Policy</a></li>
                           <li id="menu-item-58565" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-58565"><a href={app_coinpedia_url+"feedback"} >Feedback</a></li>
                        </ul> 
                     </div>  

                  </div> 
               </div>
            </div>
         </div>
      </footer>
      
      
  
 
      </>
   )
} 