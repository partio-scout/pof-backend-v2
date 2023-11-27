import React, { useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Button, Error } from "@buffetjs/core";
import { Description, ErrorMessage } from "@buffetjs/styles";
import { Label, useUser } from "@strapi/helper-plugin";
import Editor from "./Tinymce";
import MediaLib from "./MediaLib";

const WysiwygWithErrors = ({
  inputDescription,
  error: inputError,
  errors,
  label,
  name,
  noErrorsDescription,
  onChange,
  value,
  validations,
}) => {
  const user = useUser();

  // We can distinguish admins by the role: "admin::roles.create"
  const isAdmin =
    user.userPermissions.find(
      (permission) => permission.action === "admin::roles.create"
    ) !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  let spacer = !isEmpty(inputDescription) ? (
    <div style={{ height: ".4rem" }} />
  ) : (
    <div />
  );

  if (!noErrorsDescription && !isEmpty(errors)) {
    spacer = <div />;
  }
  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleImage = (data) => {
    return `<p><img src="${data.url}" alt="${data.alternativeText}"/></p>`;
  };

  const handleVideo = (data) => {
    return `
      <video width="320" height="240" controls data-url="${data.url}" data-mime="${data.mime}">
        <source src="${data.url}" type="${data.mime}">
        Your browser does not support the video tag.
      </video>
    `;
  };

  const handleFile = (data) => {
    return `<a href="${data.url}">${data.url}</a>`;
  };

  const handleChange = (data) => {
    if (typeof window === "undefined") return;

    let change;
    if (data.mime.includes("image")) {
      change = handleImage(data);
    } else if (data.mime.includes("video")) {
      change = handleVideo(data);
    } else if (data.mime.includes("application/pdf")) {
      change = handleFile(data);
    } else {
      console.log("TinyMCE: Unkown data:", data);
    }

    if (change) {
      window.tinymce.activeEditor.insertContent(change);
      const newValue = window.tinymce.activeEditor.getContent();
      onChange({ target: { name, value: newValue } });
    }
  };
  console.log(noErrorsDescription, errors);
  console.log(validations);
  return (
    <Error
      inputError={inputError}
      name={name}
      type="text"
      validations={validations}
    >
      {({ canCheck, onBlur, error, dispatch }) => {
        const hasError = Boolean(error);

        return (
          <div
            className="col-12"
            style={{
              marginBottom: "1.6rem",
              fontSize: "1.3rem",
              fontFamily: "Lato",
            }}
          >
            <Label
              htmlFor={name}
              message={label}
              style={{ marginBottom: 10 }}
            />
            <div>
              <Button
                style={{ lineHeight: "1", marginBottom: "16px" }}
                color="primary"
                onClick={handleToggle}
              >
                Media Library
              </Button>
            </div>
            <Editor
              name={name}
              onChange={onChange}
              value={value || ""}
              isAdmin={isAdmin}
            />
            {!hasError && inputDescription && (
              <Description>{inputDescription}</Description>
            )}
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
            {spacer}
            <MediaLib
              onToggle={handleToggle}
              isOpen={isOpen}
              onChange={handleChange}
            />
          </div>
        );
      }}
    </Error>
  );
};

WysiwygWithErrors.defaultProps = {
  errors: [],
  inputDescription: null,
  label: "",
  noErrorsDescription: false,
  value: "",
};

WysiwygWithErrors.propTypes = {
  errors: PropTypes.array,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default WysiwygWithErrors;
