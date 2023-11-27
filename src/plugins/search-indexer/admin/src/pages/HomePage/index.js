/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from "react";
import { request, useNotification } from "@strapi/helper-plugin";
import { Button, Loader, Typography } from "@strapi/design-system";
import pluginPkg from "../../../../package.json";

import styled from "styled-components";

const availableContentTypes = pluginPkg.indexableContent || [];

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const ContentListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const HomePage = () => {
  const toggleNotification = useNotification();
  const [indexedContent, setIndexedContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const indexContent = (type = "all") => {
    setLoading(true);
    request(`/search-indexer/${type}`)
      .then((res) => setIndexedContent(res.result))
      .catch((err) => {
        toggleNotification({
          type: "warning",
          message: {
            id: "indexing ocntent failed",
            defaultMessage: `Failed indexing content: ${err}`,
          },
          title: "Error",
          timeout: 10000,
        });
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "50rem" }}>
      <Section>
        <Typography variant="alpha">Search indexing</Typography>
        <Typography variant="omega">
          Here you can re-index all content items.
        </Typography>
      </Section>
      <Section>
        <Typography variant="beta">Available types</Typography>
        <ul style={{ maxWidth: "30rem" }}>
          {availableContentTypes.map((t) => (
            <li key={t}>
              <ContentListItem>
                {t} <Button onClick={() => indexContent(t)}>Index</Button>
              </ContentListItem>
            </li>
          ))}
        </ul>
      </Section>
      <Button onClick={() => indexContent("all")}>
        Press here to index all content
      </Button>
      <Section>
        {loading && <Loader />}
        {indexedContent && (
          <>
            <Typography variant="beta">Indexed content</Typography>
            <ul>
              {Object.entries(indexedContent).map(([contentType, entries]) => (
                <li key={contentType}>
                  <Typography variant="omega">
                    <b>{contentType}</b>: {entries.length} entries
                  </Typography>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </div>
  );
};

export default memo(HomePage);
