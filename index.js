const server = require('./src/server');


module.exports = server;

// const readline = require("readline");
// const { createReadStream } = require("fs");

// const toJSON = (csvLine) => {
//   const parts = csvLine.split(",");
//   return {
//     from: parts[0],
//     to: parts[1],
//     price: Number.parseFloat(parts[2]),
//   };
// };

// const stream = createReadStream("routes.csv");

// const rl = readline.createInterface({
//   input: stream,
// });

// const from = "GRU";
// const to = "SCL";
// const froms = [];

// const tree = [];

// rl.on("line", (line) => {
//   const route = toJSON(line);
//   if (route.from === from && route.to === to) {
//     return tree.push({ ...route, connection: [route] });
//   }

//   if (route.from === from) {
//     froms.push(route);
//   }

//   /** Todos os destinos de onde a PARTIDA esta */
//   const branch = froms.filter((f) => f.to === route.from);
//   if (branch.length) {
//     return tree.push({
//       ...route,
//       connection: [...branch, route]
//     });
//   }

//   /** inserre todas as branchs na arvore de rotas */
//   const subBranch = tree.filter((b) => b.to === route.from);
//   if (subBranch.length) {
//     const prices = subBranch.map((e) => e.price);
//     const min = Math.min(...prices);
//     const con = subBranch.find((e) => e.price === min);
//     tree.push({ ...route, connection: [...con.connection, route]
//     });
//   }
// });

// rl.on("close", () => {
//   const finalRoutes = tree.filter((t) => t.to === to);
//   console.log(JSON.stringify(finalRoutes, null, 2));
//   const response = finalRoutes.map((route) => {
//       const totalPrice = route.connection.reduce((acc, cur) => acc + cur.price,0);
//       const routes = route.connection.reduce((acc, cur) => (acc ? acc : cur.from) + '/' + cur.to, '')
//       return { totalPrice, routes }

//   });
//   console.log(response.sort((a, b) => a.totalPrice - b.totalPrice)[0]);
// });
