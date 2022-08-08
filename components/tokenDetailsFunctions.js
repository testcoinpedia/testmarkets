
const graphQlURL = "https://graphql.bitquery.io/"
const fromNToDate = (datetime,customstartdate,customenddate)=>
{
    var from_date = new Date();
    from_date = from_date.setDate(from_date.getDate() - 1);
    from_date = Date.parse((new Date(from_date)).toString()) / 1000;
    var to_date = Date.parse((new Date()).toString()) / 1000;

    if (datetime === 1) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1);
      from_date = Date.parse((new Date(from_date)).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 2) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 7);
      from_date = Date.parse(new Date(from_date).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 3) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 31);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 4) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 365);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 5) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 730);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if(datetime === 6){
     // setCustomDate(!customDate)
      from_date = Date.parse(customstartdate)
      to_date = Date.parse(customenddate)

      from_date = from_date / 1000
      to_date = to_date / 1000
    }
    else if (datetime === 7) {
      // 6 months
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 182);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 8) {
      // 3 year
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1095);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 9) {
      // 5 year
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1825);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 

    const dateSince = new Date(from_date * 1000);
    const fromDate = dateSince.toISOString();
    const dateTill = new Date(to_date * 1000);
    const toDate = dateTill.toISOString();
    return {fromDate:fromDate, toDate:toDate}
}

module.exports = { graphQlURL, fromNToDate }