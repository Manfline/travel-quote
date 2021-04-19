class Quote {
  static toJson(line, separator = ',') {
    const parts = line.split(separator);
    return {
      from: parts[0],
      to: parts[1],
      price: Number.parseFloat(parts[2])
    };
  }

  static getMinPriceRoute(routes, key = 'price') {
    return routes.sort((a, b) => a[key] - b[key])[0];
  }

  static getConnections(branchRoute, route) {
    return [...branchRoute, route];
  }

  static getTotalPriceConnections(connections) {
    return connections.reduce((acc, route) => acc + route.price, 0);
  }

  static getTravelRoutes(connections, separator = ',') {
    return connections.reduce(
      (acc, curr) => (acc || curr.from) + separator + curr.to,
      ''
    );
  }

  static toLine(body) {
    return Object.values(body).join(',');
  }
}

module.exports = Quote;
