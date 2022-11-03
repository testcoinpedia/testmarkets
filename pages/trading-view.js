import React from 'react';
import ReactDynamicImport  from 'react-dynamic-import';
// const ReactDynamicImport = require('react-dynamic-import')


// const TVChartContainer = dynamic(
// 	() =>
// 		import('../components/TVChartContainer').then(mod => mod.TVChartContainer),
// 	{ ssr: false },
// );

const Index = () => {

const loader = () => import(`../components/TVChartContainer`);
const TVChartContainer = ReactDynamicImport({ loader })


	return (
    <TVChartContainer />)
};

export default Index;









// import React from 'react';
// import dynamic from 'next/dynamic'
// // const ReactDynamicImport = require('react-dynamic-import')


// const TVChartContainer = dynamic(
// 	() =>
// 		import('../components/TVChartContainer').then(mod => mod.TVChartContainer),
// 	{ ssr: false },
// );

// const Index = () => {

// const TVChartContainer = dynamic(() => import('../components/TVChartContainer'), { ssr: false });


// 	return (
//     <TVChartContainer />)
// };

// export default Index;



