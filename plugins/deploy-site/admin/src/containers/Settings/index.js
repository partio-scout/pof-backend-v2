import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import pluginId from "../../pluginId";
import { Button, InputText, Label } from "@buffetjs/core";
import { request } from "strapi-helper-plugin";
import styled from "styled-components";

const Section = styled.div`
  margin: 2rem 0;
`;

const Settings = ({ settingsBaseURL }) => {
  const [deployWebhookUrl, setDeployWebhookUrl] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  useEffect(() => {
    request("/deploy-site").then((response) => {
      setSettings(response.settings);
    });
  }, []);

  const setSettings = (settings) => {
    setDeployWebhookUrl(settings.deploy_webhook_url);
    setPreviewUrl(settings.preview_url);
  };

  const saveSettings = () => {
    request("/deploy-site/set", {
      method: "POST",
      body: { deploy_webhook_url: deployWebhookUrl, preview_url: previewUrl },
    })
      .then((response) => {
        if (response.message === "ok") {
          setSettings(response.settings);
          strapi.notification.toggle({
            message: "Settings saved",
            timeout: 3500,
            title: "Success",
            type: "success",
          });
        } else {
          strapi.notification.toggle({
            message: "Failed saving settings: " + response.message,
            timeout: 3500,
            title: "Error",
            type: "warning",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        strapi.notification.toggle({
          message: "Failed saving settings",
          timeout: 3500,
          title: "Error",
          type: "warning",
        });
      });
  };

  return (
    <div>
      <h1>Deployment settings</h1>
      <Section>
        <Label htmlFor="input1">Deployment webhook url</Label>
        <InputText
          name="input1"
          type="text"
          onChange={({ target: { value } }) => setDeployWebhookUrl(value)}
          value={deployWebhookUrl}
        />
      </Section>
      <Section>
        <Label htmlFor="input2">Preview url</Label>
        <InputText
          name="input2"
          type="text"
          onChange={({ target: { value } }) => setPreviewUrl(value)}
          value={previewUrl}
        />
      </Section>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

Settings.propTypes = {
  settingsBaseURL: PropTypes.string.isRequired,
};

export default Settings;
