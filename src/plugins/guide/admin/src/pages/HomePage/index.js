import React, { useEffect, useState } from "react";
import { request } from "@strapi/helper-plugin";
import { Typography, Link } from "@strapi/design-system";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HomePage = () => {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    request("/guide/list").then((data) => setGuides(data.guides || []));
  }, []);

  return (
    (<Container>
      <Typography variant="alpha">Ohjekirja</Typography>
      <Typography variant="omega">
        Tästä ohjekirjasta löydät ohjeet Strapin käyttöön. Alla olevista
        linkeistä voit selata ohjeita.
      </Typography>
      <ul>
        {guides.map((guide) => (
          <li key={guide}>
            <Link to={`/plugins/guide/${guide}`}>
              {guide.replace(".md", "").replace("_", " ").replace(/^\d-/, "")}
            </Link>
          </li>
        ))}
      </ul>
    </Container>)
  );
};

export default HomePage;
