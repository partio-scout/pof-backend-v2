module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    const changeComponentKey = (data) => {
      if (Array.isArray(data)) {
        return data.map(changeComponentKey);
      } else if (data !== null && typeof data === 'object') {
        const newData = {};
        for (const key of Object.keys(data)) {
          const newKey = key === '__component' ? 'strapi_component' : key;
          newData[newKey] = changeComponentKey(data[key]);

          if (newKey === 'content') {
            newData['content'] = { data: newData['content'] ?? '' };
            newData['contentData'] = newData['content'];
          }
          
          if (newKey === 'ingress') {
            newData['ingressData'] = newData['ingress'] ?? '';
          }

        }
        return newData;
      }
      return data;
    };

    if (ctx.response.body) {
      ctx.response.body = changeComponentKey(ctx.response.body);
    }
  };
};