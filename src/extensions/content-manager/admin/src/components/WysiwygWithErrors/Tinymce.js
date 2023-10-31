import React from "react";
import PropTypes from "prop-types";
import { Editor as Tinymce } from "@tinymce/tinymce-react";
import styled from "styled-components";

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const Editor = ({ onChange, name, value, isAdmin }) => {
  let toolbar =
    "undo redo | formatselect styleselect | \
  bold italic underline strikethrough removeformat | \
  alignleft aligncenter alignright alignjustify | \
  outdent indent | numlist bullist | \
  link anchor | charmap emoticons | table | \
  fullscreen";

  // Let's add the code editor for admins
  if (isAdmin) {
    toolbar += " code";
  }

  return (
    <>
      <Wrapper>
        <Tinymce
          tinymceScriptSrc={
            strapi.backendURL + "/tinymce/js/tinymce/tinymce.min.js"
          }
          value={value}
          init={{
            height: 500,
            menubar: false,
            convert_urls: false,
            relative_urls: true,
            remove_script_host: true,
            toolbar_mode: "wrap",
            entity_encoding: "raw",
            indent: false, // This fixes the problem where tinymce adds a newline character (\n) between p-tags
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste help wordcount",
              "media fullscreen",
              "hr visualchars imagetools emoticons",
            ],
            toolbar,
            block_formats:
              "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4;",
            style_formats: [
              {
                title: "Table with borders",
                selector: "table",
                classes: "table-border",
              },
              {
                title: "Table with light borders",
                selector: "table",
                classes: "table-border-light",
              },
              {
                title: "Table odd rows background",
                selector: "table",
                classes: "table-border-bg-odd",
              },
              {
                title: "Table even rows background",
                selector: "table",
                classes: "table-border-bg-even",
              },
            ],
            content_css: "/tinymce/editor-styles.css",
          }}
          onEditorChange={(content, editor) => {
            onChange({ target: { name, value: content } });
          }}
        />
      </Wrapper>
    </>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
};

export default Editor;
