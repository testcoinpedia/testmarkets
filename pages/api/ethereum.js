export default async function handler(req, res) {
    try {
      const response = await fetch('https://blockworks.co/_next/data/aqg2BtpBd_CN4FlN2Lw1r/ethereum-etf.json');
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  }

  