import React from "react";
import {API_BASE_URL, config} from '../components/constants';
// import fs from "fs"; 

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: "https://markets.coinpedia.org",
    production: "https://markets.coinpedia.org",
  }[process.env.NODE_ENV]; 
 
    const coins = await fetch(API_BASE_URL+"sitemap/tokens", config(""))
    const meta_status = await coins.json()

    // const coins = await fetch("https://api.coinpedia.org/listing_tokens/tokens_list", constant.config)
    // meta_status = await coins.json()  
  
  const sitesmap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://markets.coinpedia.org/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
      
      <url>
        <loc>https://markets.coinpedia.org/gainers-and-losers/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>https://markets.coinpedia.org/launchpad/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>https://markets.coinpedia.org/launchpad/ended/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>https://markets.coinpedia.org/launchpad/ongoing/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>https://markets.coinpedia.org/launchpad/upcoming/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
      
      ${meta_status.message
        .map((url) => {
          return `
            <url>
              <loc>${baseUrl+"/"+url.token_id+"/"}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `; 
 
  res.setHeader("Content-Type", "text/xml");
  res.write(sitesmap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;