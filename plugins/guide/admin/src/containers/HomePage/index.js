import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "strapi-helper-plugin";

const HomePage = () => {
  const [guides, setGuides] = useState([]);
  console.log(strapi);

  useEffect(() => {
    request("/guide/list").then((data) => setGuides(data.guides || []));
  }, []);

  return (
    <div>
      <h1>Ohjekirja</h1>
      <p>
        Tästä ohjekirjasta löydät ohjeet Strapin käyttöön. Alla olevista
        linkeistä voit selata ohjeita.
      </p>
      <ul>
        {guides.map((guide) => (
          <li key={guide}>
            <Link to={`/plugins/guide/${guide}`}>
              {guide.replace(".md", "").replace("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
