import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { request } from "@strapi/helper-plugin";
import { markdownToHtml } from "../../utils/markdown";
import "./guide.css";

function Guide() {
  const { id } = useParams();
  const [guide, setGuide] = useState("");

  useEffect(() => {
    request("/guide/get/" + id).then((data) =>
      setGuide(markdownToHtml(data.content))
    );
  }, []);

  return (
    <div style={{}}>
      <div style={{ borderBottom: "2px solid black", padding: "1rem 0" }}>
        Katsotaan ohjetta: <strong>{id.replace(".md", "")}</strong> -{" "}
        <Link to={"/plugins/guide"}>Palaa alkuun</Link>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: guide }}
        style={{ padding: "1rem 0" }}
      ></div>
    </div>
  );
}

export default Guide;
