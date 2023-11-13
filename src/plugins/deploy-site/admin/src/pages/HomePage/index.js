/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Button,
} from "@strapi/design-system";
import styled from "styled-components";
import { request } from "@strapi/helper-plugin";
import { useNotification } from "@strapi/helper-plugin";

const StyledBox = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const HomePage = () => {
  const toggleNotification = useNotification();
  const [settings, setSettings] = useState();
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    request("/deploy-site").then(({ settings }) => {
      setSettings(settings);
    });
    request("/deploy-site/changes").then(({ changes }) => {
      setChanges(changes);
    });
  }, []);

  console.log("changes", changes);

  const deploySite = () => {
    if (!settings.deploy_webhook_url) {
      toggleNotification({
        message: {
          defaultMessage:
            "Setting `deploy_webhook_url` is not set. Contact your administrator for setting it",
        },
        timeout: 3500,
        title: "Error",
        type: "warning",
      });
      return;
    }

    request("/deploy-site/deploy")
      .then(() => {
        toggleNotification({
          message: { defaultMessage: "Deployment started successfully" },
          timeout: 3500,
          title: "Success",
          type: "success",
        });
      })
      .then(() => request("/deploy-site/changes"))
      .then(({ changes }) => setChanges(changes))
      .catch((error) => {
        console.error(error);
        toggleNotification({
          message: {
            defaultMessage:
              "Deployment failed to start. Contact your administrator for fixing this. " +
              error,
          },
          timeout: 60000,
          title: "Error",
          type: "warning",
        });
      });
  };

  const openPreview = () => {
    if (!settings.preview_url) {
      toggleNotification({
        message: {
          defaultMessage:
            "Preview is not set up. Contact your administrator for fixing this.",
        },
        timeout: 60000,
        title: "Error",
        type: "warning",
      });
      return;
    }

    open(settings.preview_url);
  };

  const tableHeaders = [
    {
      name: "Id",
      value: "content_id",
    },
    {
      name: "Title",
      value: "content_name",
    },
    {
      name: "Type",
      value: "content_type",
    },
    {
      name: "Change type",
      value: "change_type",
    },
    {
      name: "Change time",
      value: "change_time",
    },
  ];

  return (
    <StyledBox>
      <h1>Deployment actions</h1>
      <Section>
        <p>There are {changes.length} unpublished changes</p>
        {changes.length > 0 && (
          <Box padding={8} background="neutral100">
            <Table colCount={tableHeaders.length} rowCount={changes.length}>
              <Thead>
                <Tr>
                  {tableHeaders.map((header) => (
                    <Th>{header.name}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {changes.map((change) => (
                  <Tr key={change.id}>
                    <Td>{change.id}</Td>
                    <Td>{change.content_name}</Td>
                    <Td>{change.content_type}</Td>
                    <Td>{change.change_type}</Td>
                    <Td>{change.change_time}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Section>
      <Section>
        <p>From this button you can start the website's deployment</p>
        <Button onClick={deploySite}>Deploy site</Button>
      </Section>
      <Section>
        <p>
          From this button you can open the preview site, which shows any
          changes made to Strapi's content
        </p>
        <Button onClick={openPreview}>Open preview</Button>
      </Section>
    </StyledBox>
  );
};

export default memo(HomePage);
