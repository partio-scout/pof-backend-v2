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
            
            if (newKey === 'ingress') {
              newData['ingress'] = { data: newData['ingress'] ?? '' };
            }
            
            if (newKey === 'text') {
              newData['text'] = { data: newData['text'] ?? '' };
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