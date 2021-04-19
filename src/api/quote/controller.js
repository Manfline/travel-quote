const HttpStatus = require('http-status-codes');
const FileStream = require('../../utils/FileStream');
const Helper = require('../../helpers/quote');

class Controller {
  async get(req, res) {
    try {
      const { from, to } = req.params;
      const originRoutes = [];
      const treeRoutes = [];
      const rl = FileStream.readLine(process.env.PATH_ROUTES);
      const quote = await new Promise((resolve, reject) => {
        rl.on('line', line => {
          try {
            const route = Helper.toJson(line);

            if (route.from === from && route.to === to) {
              return treeRoutes.push({
                ...route,
                connections: Helper.getConnections([], route)
              });
            }

            if (route.from === from) {
              originRoutes.push(route);
            }

            const branchRoute = originRoutes.filter(
              originRoute => originRoute.to === route.from
            );
            if (branchRoute.length) {
              const minPriceRoute = Helper.getMinPriceRoute(branchRoute);
              return treeRoutes.push({
                ...route,
                connections: Helper.getConnections([minPriceRoute], route)
              });
            }

            const forkedBranchRoute = treeRoutes.filter(
              branchRoute => branchRoute.to === route.from
            );
            if (forkedBranchRoute.length) {
              const minPriceRoute = Helper.getMinPriceRoute(forkedBranchRoute);
              return treeRoutes.push({
                ...route,
                connections: Helper.getConnections(
                  minPriceRoute.connections,
                  route
                )
              });
            }
          } catch (error) {
            reject(error);
          }
        });

        rl.on('close', () => {
          try {
            if (!treeRoutes.length) {
              return resolve();
            }
            let finalRoutes = treeRoutes.filter(
              branchRoute => branchRoute.to === to
            );

            finalRoutes = finalRoutes.map(finalRoute => {
              const totalPrice = Helper.getTotalPriceConnections(
                finalRoute.connections
              );
              return { ...finalRoute, totalPrice };
            });

            const minPriceRoute = Helper.getMinPriceRoute(
              finalRoutes,
              'totalPrice'
            );
            const route = Helper.getTravelRoutes(minPriceRoute.connections);
            resolve({ route, price: minPriceRoute.totalPrice });
          } catch (error) {
            reject(error);
          }
        });
      });
      if (!quote) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Origem ou destino não encontrado' });
      }
      res.status(HttpStatus.OK).json(quote);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      });
    }
  }

  async post(req, res) {
    try {
      const newLine = Helper.toLine(req.body);
      const wl = FileStream.writeLine(process.env.PATH_ROUTES);
      await new Promise((resolve, reject) => {
        wl.write('\n' + newLine, error => {
          if (error) {
            reject(error);
          }
          resolve(true);
        });
      });
      res
        .status(HttpStatus.OK)
        .json({ message: 'Rota adicionada com sucesso' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      });
    }
  }
}

module.exports = new Controller();
