/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from "react";
import { request, useNotification } from "@strapi/helper-plugin";
import { Button, Loader } from "@strapi/design-system";
import pluginPkg from "../../../../package.json";

import styled from "styled-components";

const availableContentTypes = pluginPkg.indexableContent || [];

const Section = styled.div`
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
        <h1>Search indexing</h1>
        <p>Here you can re-index all content items.</p>
      </Section>
      <Section>
        <h2>Available types</h2>
        <ul style={{ maxWidth: "30rem" }}>
          {availableContentTypes.map((t) => (
            <li key={t}>
              <ContentListItem>
                {t} <Button onClick={() => indexContent(t)}>Index</Button>
              </ContentListItem>
            </li>
          ))}
        </ul>
        <Button onClick={() => indexContent("all")}>
          Press here to index all content
        </Button>
      </Section>
      <Section>
        {loading && <Loader />}
        {indexedContent && (
          <>
            <h2>Indexed content</h2>
            <ul>
              {Object.entries(indexedContent).map(([contentType, entries]) => (
                <li key={contentType}>
                  <b>{contentType}</b>: {entries.length} entries
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
