/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "strapi-helper-plugin";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";

const HomePage = () => {
  const [guides, setGuides] = useState([]);
  console.log(strapi)

  useEffect(() => {
    request("/guide/list").then((data) => setGuides(data.guides || []));
  }, []);

  return (
    <div>
      <h1>Ohjekirja</h1>
      <ul>
        {guides.map((guide) => (
          <li key={guide}>
            <Link to={`/plugins/guide/${guide}`}>{guide.replace(".md", "").replace('-', ' ')}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(HomePage);